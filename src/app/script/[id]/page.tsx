"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Film, 
  Download, 
  Edit3, 
  Save, 
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  Tag
} from "lucide-react";
import { ScriptProject } from "@/types";
import { formatScriptForDownload } from "@/ai/script-generator";

interface ScriptEditorProps {
  params: {
    id: string;
  };
}

export default function ScriptEditorPage({ params }: ScriptEditorProps) {
  const router = useRouter();
  const [script, setScript] = useState<ScriptProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    loadScript();
  }, [params.id]);

  const loadScript = () => {
    try {
      const scripts = JSON.parse(localStorage.getItem('scripts') || '[]');
      const foundScript = scripts.find((s: ScriptProject) => s.id === params.id);
      
      if (foundScript) {
        setScript(foundScript);
        setEditedScript(foundScript.script || "");
      } else {
        setError("Script not found");
      }
    } catch (error) {
      setError("Failed to load script");
    } finally {
      setIsLoading(false);
    }
  };

  const saveScript = () => {
    if (!script) return;
    
    setSaveStatus('saving');
    
    try {
      const scripts = JSON.parse(localStorage.getItem('scripts') || '[]');
      const updatedScripts = scripts.map((s: ScriptProject) =>
        s.id === params.id 
          ? { ...s, script: editedScript, updatedAt: new Date() }
          : s
      );
      
      localStorage.setItem('scripts', JSON.stringify(updatedScripts));
      setScript(prev => prev ? { ...prev, script: editedScript } : null);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setError("Failed to save script");
      setSaveStatus('idle');
    }
  };

  const downloadScript = (format: 'pdf' | 'fdx' | 'txt') => {
    if (!script) return;
    
    const content = formatScriptForDownload(editedScript, format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading script...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <Alert className="max-w-md mx-auto">
              <AlertDescription>{error || "Script not found"}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => router.push("/")} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Film className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">{script.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadScript('txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  TXT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadScript('pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadScript('fdx')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  FDX
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedScript(script.script || "");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      saveScript();
                      setIsEditing(false);
                    }}
                    disabled={saveStatus === 'saving'}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Script Details Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Script Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Logline</p>
                  <p className="text-sm">{script.logline}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Genres
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {script.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tones</p>
                  <div className="flex flex-wrap gap-1">
                    {script.tones.map((tone) => (
                      <Badge key={tone} variant="outline" className="text-xs">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Characters
                  </p>
                  <div className="space-y-1">
                    {script.characters.map((character) => (
                      <div key={character.id} className="text-sm">
                        <span className="font-medium">{character.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({character.role})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created
                  </p>
                  <p className="text-sm">
                    {new Date(script.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Script Editor */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Screenplay</span>
                  {saveStatus === 'saved' && (
                    <Badge variant="secondary" className="text-xs">
                      Saved
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedScript}
                    onChange={(e) => setEditedScript(e.target.value)}
                    className="min-h-[600px] font-mono text-sm leading-relaxed resize-none"
                    placeholder="Your screenplay content will appear here..."
                  />
                ) : (
                  <div className="min-h-[600px] p-4 bg-secondary/10 rounded-md">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {script.script || "No script content available"}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}