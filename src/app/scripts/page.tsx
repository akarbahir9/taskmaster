"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Film, 
  Plus, 
  Calendar, 
  Users, 
  Tag,
  Edit3,
  Trash2,
  FileText
} from "lucide-react";
import { ScriptProject } from "@/types";

export default function ScriptsPage() {
  const router = useRouter();
  const [scripts, setScripts] = useState<ScriptProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = () => {
    try {
      const savedScripts = localStorage.getItem('scripts');
      if (savedScripts) {
        const parsedScripts = JSON.parse(savedScripts);
        setScripts(parsedScripts);
      }
    } catch (error) {
      setError("Failed to load scripts");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScript = (id: string) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        const updatedScripts = scripts.filter(script => script.id !== id);
        localStorage.setItem('scripts', JSON.stringify(updatedScripts));
        setScripts(updatedScripts);
      } catch (error) {
        setError("Failed to delete script");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading scripts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <FileText className="w-10 h-10 mr-3 text-primary" />
            My Scripts
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Manage and edit your generated screenplays
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-6">
              <Plus className="w-5 h-5 mr-2" />
              Create New Script
            </Button>
          </Link>
        </div>

        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scripts Grid */}
        {scripts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No scripts yet</h2>
              <p className="text-muted-foreground mb-6">
                Start creating your first screenplay with ScriptSpark
              </p>
              <Link href="/create">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Script
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <Card key={script.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {script.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1 ml-2">
                      <Link href={`/script/${script.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteScript(script.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {script.logline}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Tag className="w-3 h-3 mr-1" />
                      Genres
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {script.genres.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      Characters ({script.characters.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {script.characters.slice(0, 3).map((character) => (
                        <span key={character.id} className="text-xs bg-secondary/50 px-2 py-1 rounded">
                          {character.name}
                        </span>
                      ))}
                      {script.characters.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{script.characters.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(script.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/script/${script.id}`}>
                      <Button size="sm" variant="outline">
                        View Script
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}