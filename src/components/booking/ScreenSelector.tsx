
'use client';

import type { Screen } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ScreenSelectorProps {
  screens: Screen[];
  onScreenSelect: (screen: Screen) => void;
}

export default function ScreenSelector({ screens, onScreenSelect }: ScreenSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
      {screens.map((screen) => (
        <Card key={screen.id} className="flex flex-col bg-card/80 backdrop-blur-sm border-glow-primary overflow-hidden group">
          <div className="block relative w-full h-36 sm:h-48 overflow-hidden rounded-t-md">
            <Image
              src={screen.imagePlaceholderUrl}
              alt={screen.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={screen.imageAiHint}
              className="rounded-t-md" 
            />
          </div>
          <CardHeader className="flex-row items-center space-x-2 sm:space-x-3 pb-2 sm:pb-3 pt-3 sm:pt-4 px-3 sm:px-4">
            {screen.icon && <screen.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
            <CardTitle className="text-lg sm:text-2xl text-primary">{screen.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow justify-between p-3 sm:p-4 pt-0">
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
              Experience immersive gaming on our state-of-the-art {screen.name.toLowerCase()}. Perfect for solo adventures or battling with friends.
            </p>
            <Button
              onClick={() => onScreenSelect(screen)}
              className="w-full btn-glow-primary btn-gradient-primary-accent mt-auto text-sm sm:text-lg py-2 sm:py-3" // Changed to primary-accent gradient
              aria-label={`Choose ${screen.name}`}
            >
              Choose {screen.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
