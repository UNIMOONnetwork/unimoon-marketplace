import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import BN from 'bn.js';
import profileService, { Profile } from '../../services/profile';

import {
  AuctionViewState,
  useAuctions,
  useCreatorArts,
  useUserArts,
  useCollections,
} from '../../hooks';

import { List } from './list';

export const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    // if (id)
    // (async () => {
    //   try {
    //     await profileService.getProfileByID(id).then(res => {
    //       setProfile(res);
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
    if (id)
      setProfile({
        id: 'test',
        wallet: '3qp2RYC8kGGFHhi9owgBoeNA7ZGZrG1drdj1auJjgc7y',
        username: 'Steven',
        gender: 'male',
        email: 'steven.wang.dev@gmail.com',
        mobile: '12345678',
        country_code: '00000',
        profile_image: 'https://wallpapercave.com/mwp/wp2337008.jpg',
        bio: 'I am a blockchain developer',
        birthdate: '1990.05.05',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  }, [id]);

  if (!id) {
    return <Redirect to="/" />;
  }
  const created = useCreatorArts(id);
  const owned = useUserArts();

  const { auctionViews: auctionsLive } = useAuctions(AuctionViewState.Live);
  const { auctionViews: auctionsEnded } = useAuctions(AuctionViewState.Ended);

  const liveAuctions = auctionsLive.sort(
    (a, b) =>
      a.auction.info.endedAt
        ?.sub(b.auction.info.endedAt || new BN(0))
        .toNumber() || 0,
  );

  const allAuctions = liveAuctions
    .concat(auctionsEnded)
    .sort((a, b) =>
      (b.auction.info.priceFloor.minPrice! || new BN(0))
        .sub(a.auction.info.priceFloor.minPrice || new BN(0))
        .toNumber(),
    );

  const auctions = allAuctions.filter(
    auction =>
      auction.auctionManager.authority == id ||
      (auction.state !== AuctionViewState.Defective &&
        auction.auction.info.bidState.bids.some(b => b.key == id)),
  );

  // const { collections } = useCollections(id);
  const collections = [];

  return (
    <>
      {profile && (
        <div className="profile-main-content">
          <List
            owned={owned}
            profile={profile}
            auctions={auctions}
            created={created}
            collections={collections}
          />
        </div>
      )}
      {/* <LoadingScreen open={profileOwnerMutation.isLoading} /> */}
    </>
  );
};
