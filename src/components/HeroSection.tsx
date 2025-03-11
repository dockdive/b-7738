
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

const HeroSection = ({ title, subtitle, ctaText, ctaUrl }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16 md:py-24">
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl md:max-w-2xl mx-auto mb-8">{subtitle}</p>
        <Link to={ctaUrl}>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
