
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const PreferencesPrompt = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Set Your Investment Preferences
        </CardTitle>
        <CardDescription>
          Configure your investment criteria to receive personalized startup recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Preferences Set</h3>
        <p className="text-muted-foreground mb-4">
          Set your investment preferences to get AI-powered startup recommendations
        </p>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          Set Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreferencesPrompt;
