"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Sparkles, BookOpen, Users, Download, Edit3 } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Advanced AI creates compelling, professionally formatted screenplays from your ideas."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Industry Standard Format",
      description: "Scripts follow professional screenplay formatting with proper scene headings and dialogue."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Rich Character Development",
      description: "Create detailed character profiles with motivations, arcs, and personality traits."
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Interactive Editor",
      description: "Edit and refine your generated scripts with our built-in screenplay editor."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Export Formats",
      description: "Download your scripts in PDF, Final Draft, or plain text formats."
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: "Genre Flexibility",
      description: "Create scripts in any genre or blend multiple genres for unique storytelling."
    }
  ];

  const genres = [
    "Action", "Comedy", "Drama", "Horror", "Thriller", 
    "Sci-Fi", "Fantasy", "Romance", "Mystery", "Western"
  ];

  const tones = [
    "Gritty", "Lighthearted", "Suspenseful", "Hopeful", 
    "Dark", "Satirical", "Whimsical", "Serious", "Epic", "Intimate"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ScriptSpark
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your movie ideas into professional screenplays with AI
          </p>
          <div className="space-y-4">
            <a href="/create" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Start Creating
            </a>
            <br />
            <a href="/scripts" className="inline-block border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors">
              My Scripts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
