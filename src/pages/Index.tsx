import React from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ServicesSection from '@/components/services-section';
import FacultiesSection from '@/components/faculties-section';
import NewsSection from '@/components/news-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection key="hero-section" />
        <AboutSection />
        <ServicesSection />
        <FacultiesSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Index;