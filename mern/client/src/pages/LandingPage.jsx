import React from 'react';
import Blurb from '../components/landing/Blurb';
import Faq from '../components/landing/Faq';
import Features from '../components/landing/Features';
import Hero from '../components/landing/Hero';
import MeetTheTeam from '../components/landing/MeetTheTeam';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Blurb />
      <Faq />
      <MeetTheTeam />
    </>
  );
}
