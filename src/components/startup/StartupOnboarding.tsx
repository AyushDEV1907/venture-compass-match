import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Building2, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StartupOnboardingProps {
  onComplete: () => void;
}

const StartupOnboarding = ({ onComplete }: StartupOnboardingProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "",
    stage: "",
    fundingTarget: "",
    location: "",
    teamSize: "",
    revenue: "",
    traction: "",
    foundedYear: "",
    website: "",
    linkedinUrl: "",
    businessModel: "",
    competitiveAdvantage: ""
  });
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'SaaS', 
    'E-commerce', 'BioTech', 'CleanTech', 'Gaming', 'Hardware',
    'AgTech', 'PropTech', 'Cybersecurity', 'Retail Tech', 'FoodTech'
  ];

  const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  
  const teamSizes = ['1-5', '6-10', '11-25', '26-50', '51-100', '100+'];

  const revenueRanges = [
    '$0 (Pre-revenue)', '$1K-$10K MRR', '$10K-$50K MRR', 
    '$50K-$100K MRR', '$100K-$500K MRR', '$500K+ MRR'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, PPT, or PPTX file",
          variant: "destructive"
        });
        return;
      }
      
      setPitchDeck(file);
      toast({
        title: "File selected",
        description: `${file.name} ready for upload`
      });
    }
  };

  const uploadPitchDeckToStorage = async (userId: string, startupId: string, file: File) => {
    console.log('StartupOnboarding: Starting pitch deck upload');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/pitch-deck-${Date.now()}.${fileExt}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('pitch-decks')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('StartupOnboarding: Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('StartupOnboarding: File uploaded successfully, recording metadata');

      // Record metadata in pitch_deck_uploads table
      const { error: metadataError } = await supabase
        .from('pitch_deck_uploads')
        .insert({
          startup_id: startupId,
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          content_type: file.type,
          upload_status: 'completed'
        });

      if (metadataError) {
        console.error('StartupOnboarding: Metadata insert error:', metadataError);
        throw metadataError;
      }

      console.log('StartupOnboarding: Pitch deck upload completed successfully');
      return fileName;
    } catch (error) {
      console.error('StartupOnboarding: Error uploading pitch deck:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    console.log('StartupOnboarding: Form submission started');
    
    if (!formData.name || !formData.sector || !formData.stage) {
      toast({
        title: "Missing required fields",
        description: "Please fill in company name, sector, and stage",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      console.log('StartupOnboarding: Getting current user');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('StartupOnboarding: No authenticated user found');
        throw new Error("Not authenticated");
      }

      console.log('StartupOnboarding: User found, updating progress');
      setUploadProgress(25);

      // First, get or create the startup record
      console.log('StartupOnboarding: Checking for existing startup record');
      const { data: existingStartup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let startupId = existingStartup?.id;

      // Update or create startup record
      if (startupId) {
        console.log('StartupOnboarding: Updating existing startup record');
        const { error: updateError } = await supabase
          .from('startups')
          .update({
            name: formData.name,
            description: formData.description,
            sector: formData.sector,
            stage: formData.stage,
            funding_target: formData.fundingTarget,
            location: formData.location,
            team_size: formData.teamSize,
            revenue: formData.revenue,
            traction: formData.traction
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('StartupOnboarding: Update error:', updateError);
          throw updateError;
        }
      } else {
        console.log('StartupOnboarding: Creating new startup record');
        const { data: newStartup, error: insertError } = await supabase
          .from('startups')
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            sector: formData.sector,
            stage: formData.stage,
            funding_target: formData.fundingTarget,
            location: formData.location,
            team_size: formData.teamSize,
            revenue: formData.revenue,
            traction: formData.traction
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('StartupOnboarding: Insert error:', insertError);
          throw insertError;
        }
        startupId = newStartup.id;
      }

      console.log('StartupOnboarding: Startup record processed, updating progress');
      setUploadProgress(50);

      // Upload pitch deck if provided
      let pitchDeckUrl = null;
      if (pitchDeck && startupId) {
        try {
          console.log('StartupOnboarding: Starting pitch deck upload process');
          pitchDeckUrl = await uploadPitchDeckToStorage(user.id, startupId, pitchDeck);
          setUploadProgress(75);
          
          // Update startup record with pitch deck URL
          console.log('StartupOnboarding: Updating startup with pitch deck URL');
          await supabase
            .from('startups')
            .update({ pitch_deck_url: pitchDeckUrl })
            .eq('id', startupId);

          toast({
            title: "Pitch deck uploaded successfully! 📄",
            description: "Your pitch deck has been securely stored."
          });
        } catch (uploadError) {
          console.error('StartupOnboarding: Upload error:', uploadError);
          toast({
            title: "Pitch deck upload failed",
            description: "Your profile was saved, but the pitch deck couldn't be uploaded. You can try again later.",
            variant: "destructive"
          });
        }
      }

      setUploadProgress(90);

      // Update user profile
      console.log('StartupOnboarding: Updating user profile');
      await supabase
        .from('profiles')
        .update({
          name: formData.name,
          company: formData.name,
          sector: formData.sector,
          stage: formData.stage,
          description: formData.description,
          location: formData.location
        })
        .eq('id', user.id);

      setUploadProgress(100);

      toast({
        title: "Profile Updated! 🚀",
        description: "Your startup profile has been successfully created."
      });

      console.log('StartupOnboarding: Profile setup completed successfully');
      
      // Small delay to show 100% progress before completing
      setTimeout(() => {
        onComplete();
      }, 500);

    } catch (error) {
      console.error('StartupOnboarding: Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="w-6 h-6" />
            Complete Your Startup Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Help investors discover your startup by providing detailed information about your company.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what your company does and the problem you're solving..."
              className="min-h-[100px]"
            />
          </div>

          {/* Industry & Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Sector *</Label>
              <Select onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage *</Label>
              <Select onValueChange={(value) => handleInputChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fundingTarget">Funding Target</Label>
              <Input
                id="fundingTarget"
                value={formData.fundingTarget}
                onChange={(e) => handleInputChange('fundingTarget', e.target.value)}
                placeholder="e.g., $500K"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Current Revenue</Label>
              <Select onValueChange={(value) => handleInputChange('revenue', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  {revenueRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Team Size</Label>
              <Select onValueChange={(value) => handleInputChange('teamSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                placeholder="2023"
              />
            </div>
          </div>

          {/* Traction & Business Model */}
          <div>
            <Label htmlFor="traction">Key Traction & Metrics</Label>
            <Textarea
              id="traction"
              value={formData.traction}
              onChange={(e) => handleInputChange('traction', e.target.value)}
              placeholder="Share your key achievements, metrics, customer growth, partnerships..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="businessModel">Business Model</Label>
            <Textarea
              id="businessModel"
              value={formData.businessModel}
              onChange={(e) => handleInputChange('businessModel', e.target.value)}
              placeholder="Describe how your company makes money..."
              className="min-h-[60px]"
            />
          </div>

          {/* Pitch Deck Upload */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-2">Upload Pitch Deck (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your pitch deck (PDF, PPT, or PPTX - Max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
                id="pitch-deck-upload"
                disabled={isSubmitting}
              />
              <Label htmlFor="pitch-deck-upload" className="cursor-pointer">
                <Button variant="outline" asChild disabled={isSubmitting}>
                  <span>Choose File</span>
                </Button>
              </Label>
              {pitchDeck && (
                <div className="mt-2">
                  <Badge variant="secondary">{pitchDeck.name}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(pitchDeck.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Complete Profile Setup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupOnboarding;
