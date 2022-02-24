import React from 'react';
import { HeaderSection } from './components/HeaderSection';
import { AuctionsSection } from './components/AuctionsSection';
import { CollectionsSection } from './components/CollectionsSection';
import { RecentListSection } from './components/RecentList';
import { ActionsSection } from './components/ActionsSection';
import { CreatorsSection } from './components/CreatorsSection';

export const LandingView = () => {
  return (
    <div className="landing-view">
      <HeaderSection />
      <AuctionsSection />
      <CollectionsSection />
      <RecentListSection />
      <ActionsSection />
      <CreatorsSection />
    </div>
  );
};
