import React from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ServicesSection from '@/components/services-section';
import FacultiesSection from '@/components/faculties-section';
import NewsSection from '@/components/news-section';
import BrochureSection from '@/components/brochure-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import BottomNavigation from '@/components/bottom-navigation'; // Import Bottom Navigation
import { MadeWithDyad } from '@/components/made-with-dyad';

const Index = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0"> {/* Tambahkan padding bawah untuk mobile */}
      <Navbar />
      <main>
        <section id="home">
          <HeroSection key="hero-section" />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="faculties">
          <FacultiesSection />
        </section>
        <section id="news">
          <NewsSection />
        </section>
        <section id="brochure">
          <BrochureSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
      <BottomNavigation /> {/* Tambahkan Bottom Navigation */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;