"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, User, Target, Lightbulb, Film } from "lucide-react";
import { Character, Genre, Tone, ScriptFormData } from "@/types";
import { generateScript } from "@/ai/script-generator";

export default function CreateScriptPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ScriptFormData>({
    title: "",
    logline: "",
    genres: [],
    tones: [],
    synopsis: "",
    characters: [],
  });

  const genres: Genre[] = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Thriller',
    'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Western'
  ];

  const tones: Tone[] = [
    'Gritty', 'Lighthearted', 'Suspenseful', 'Hopeful', 'Dark',
    'Satirical', 'Whimsical', 'Serious', 'Epic', 'Intimate'
  ];

  const characterRoles = ['protagonist', 'antagonist', 'supporting', 'other'];

  const addCharacter = () => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: "",
      role: 'protagonist',
      archetype: "",
      motivation: "",
      traits: [],
      characterArc: "",
    };
    setFormData(prev => ({
      ...prev,
      characters: [...prev.characters, newCharacter],
    }));
  };

  const removeCharacter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.filter(char => char.id !== id),
    }));
  };

  const updateCharacter = (id: string, field: keyof Character, value: any) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map(char =>
        char.id === id ? { ...char, [field]: value } : char
      ),
    }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : prev.genres.length < 2
        ? [...prev.genres, genre]
        : prev.genres,
    }));
  };

  const toggleTone = (tone: string) => {
    setFormData(prev => ({
      ...prev,
      tones: prev.tones.includes(tone)
        ? prev.tones.filter(t => t !== tone)
        : prev.tones.length < 3
        ? [...prev.tones, tone]
        : prev.tones,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateScript(formData);
      
      if (response.success) {
        // Save to localStorage for now (would be database in production)
        const scriptId = crypto.randomUUID();
        const scriptProject = {
          id: scriptId,
          ...formData,
          script: response.script,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const existingScripts = JSON.parse(localStorage.getItem('scripts') || '[]');
        existingScripts.push(scriptProject);
        localStorage.setItem('scripts', JSON.stringify(existingScripts));
        
        router.push(`/script/${scriptId}`);
      } else {
        setError(response.error || 'Failed to generate script');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() &&
           formData.logline.trim() &&
           formData.genres.length > 0 &&
           formData.tones.length > 0 &&
           formData.synopsis.trim() &&
           formData.characters.length > 0 &&
           formData.characters.every(char => 
             char.name.trim() && char.archetype.trim() && char.motivation.trim()
           );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your movie title"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logline">Logline</Label>
              <Input
                id="logline"
                value={formData.logline}
                onChange={(e) => setFormData(prev => ({ ...prev, logline: e.target.value }))}
                placeholder="A one-sentence summary of your movie's plot"
                className="text-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label>Genres (select up to 2)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={formData.genres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Tones (select up to 3)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tones.map((tone) => (
                    <Badge
                      key={tone}
                      variant={formData.tones.includes(tone) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTone(tone)}
                    >
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="synopsis">Story Synopsis</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
                placeholder="Provide a detailed outline of your story (500-1000 words). Include main plot points, turning points, and the overall narrative arc."
                rows={10}
                className="text-base"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Character Profiles</Label>
              <Button onClick={addCharacter} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Character
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {formData.characters.map((character, index) => (
                  <Card key={character.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-primary" />
                        <span className="font-medium">Character {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCharacter(character.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={character.name}
                          onChange={(e) => updateCharacter(character.id, 'name', e.target.value)}
                          placeholder="Character name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <select
                          value={character.role}
                          onChange={(e) => updateCharacter(character.id, 'role', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          {characterRoles.map(role => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Archetype</Label>
                        <Input
                          value={character.archetype}
                          onChange={(e) => updateCharacter(character.id, 'archetype', e.target.value)}
                          placeholder="The Hero, The Mentor, The Rebel, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Core Motivation</Label>
                        <Input
                          value={character.motivation}
                          onChange={(e) => updateCharacter(character.id, 'motivation', e.target.value)}
                          placeholder="What drives this character?"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Character Arc</Label>
                        <Textarea
                          value={character.characterArc}
                          onChange={(e) => updateCharacter(character.id, 'characterArc', e.target.value)}
                          placeholder="How will this character change throughout the story?"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <Film className="w-10 h-10 mr-3 text-primary" />
            Create Your Script
          </h1>
          <p className="text-muted-foreground">
            Follow the steps below to generate your professional screenplay
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(step / 3) * 100} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Basic Info</span>
            <span>Synopsis</span>
            <span>Characters</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && <Target className="w-5 h-5 mr-2" />}
              {step === 2 && <Lightbulb className="w-5 h-5 mr-2" />}
              {step === 3 && <User className="w-5 h-5 mr-2" />}
              {step === 1 && "Basic Information"}
              {step === 2 && "Story Synopsis"}
              {step === 3 && "Character Development"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!formData.title || !formData.logline || formData.genres.length === 0 || formData.tones.length === 0)) ||
                (step === 2 && !formData.synopsis.trim())
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !isFormValid()}
              className="min-w-[150px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-2" />
                  Generate Script
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}