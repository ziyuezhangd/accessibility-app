import React from 'react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Blurb from '../components/landing/Blurb';
import Faq from '../components/landing/Faq';
import MeetTheTeam from '../components/landing/MeetTheTeam';

export default function Landing() {
  return (
    <>
      <div>Landing</div>
      <Hero />
      <Features />
      <Blurb />
      <Faq />
      <MeetTheTeam />
    </>
  );
}
