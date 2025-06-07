
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartupPitchDeck = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "Pitch_Deck_v2.pdf",
      size: "2.3 MB",
      uploadDate: "2024-01-15",
      views: 23,
      downloads: 7
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0,
        downloads: 0
      };
      setUploadedFiles(prev => [...prev, newFile]);
      toast({
        title: "File Uploaded",
        description: "Your pitch deck has been uploaded successfully.",
      });
    }
  };

  const handleDelete = (id: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File Deleted",
      description: "Pitch deck has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Pitch Deck Upload
          </CardTitle>
          <CardDescription>
            Upload your pitch deck to share with interested investors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Pitch Deck</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: PDF, PPT, PPTX (Max 10MB)
            </p>
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={handleFileUpload}
              className="hidden"
              id="pitch-deck-upload"
            />
            <label htmlFor="pitch-deck-upload">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Pitch Decks
          </CardTitle>
          <CardDescription>
            Manage your pitch deck files and track engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>No pitch decks uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        <span>Uploaded: {file.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{file.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{file.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Active</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-blue-700">Pitch Deck Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Keep your pitch deck to 10-15 slides maximum</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Include: Problem, Solution, Market, Business Model, Traction, Team, Financials, Ask</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Use clear, compelling visuals and avoid text-heavy slides</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Update your pitch deck regularly to reflect latest metrics and progress</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupPitchDeck;
