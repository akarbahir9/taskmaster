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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Film className="w-12 h-12 text-primary mr-3" />
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ScriptSpark
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your movie ideas into professional screenplays with the power of AI. 
              Create compelling stories with rich characters and industry-standard formatting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/scripts">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                  <BookOpen className="w-5 h-5 mr-2" />
                  My Scripts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ScriptSpark?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to bring your storytelling vision to life
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Genres & Tones Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Supported Genres</h3>
              <p className="text-muted-foreground mb-6">
                Choose from a wide range of genres or blend them for unique storytelling
              </p>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-sm py-1 px-3">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">Tone Options</h3>
              <p className="text-muted-foreground mb-6">
                Set the emotional and stylistic feel of your screenplay
              </p>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <Badge key={tone} variant="outline" className="text-sm py-1 px-3">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl mb-4">Ready to Create Your Script?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of writers who are bringing their stories to life with ScriptSpark
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/create">
                <Button size="lg" className="text-lg px-12 py-6">
                  <Film className="w-5 h-5 mr-2" />
                  Start Your First Script
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
