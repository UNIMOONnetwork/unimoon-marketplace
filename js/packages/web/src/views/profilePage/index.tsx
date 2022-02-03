import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
// import { useMutation } from 'react-query';
import BN from 'bn.js';
import {
  ProfileByIDRequest,
  Profile,
} from '../../services/profile/profile.types';
// import profileService from '../../services/profile';

import {
  AuctionView,
  AuctionViewState,
  useAuctions,
  useCreatorArts,
  useUserArts,
} from '../../hooks';

import { Inventory } from './inventory';

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile>();

  // const profileOwnerMutation = useMutation(
  //   (params: ProfileByIDRequest) => profileService.getProfileByID(params),
  //   {
  //     onSuccess: result => {
  //       if (result?.length > 0) {
  //         setProfile(result[0]);
  //       }
  //     },
  //   },
  // );

  useEffect(() => {
    // profileOwnerMutation.mutate({ profileId: id });
    setProfile({
      profileId: 'test',
      ownerId: '3qp2RYC8kGGFHhi9owgBoeNA7ZGZrG1drdj1auJjgc7y',
      name: 'Steven',
      email: 'steven.wang.dev@gmail.com',
      phone: '12345678',
      bio: '',
      imageUrl: '',
      banner_url: '',
      on_sale: [],
      collectible: [],
      created: [],
      liked: [],
      activity: [],
      followers: 0,
      following: 0,
      description: 'I am a blockchain developer',
      member_since: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }, [id]);

  if (!id) {
    return <Redirect to="/" />;
  }
  const created = useCreatorArts(profile?.ownerId);
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

  let auctions: AuctionView[] = [];
  if (profile) {
    auctions = allAuctions.filter(
      auction =>
        auction.auctionManager.authority == profile.ownerId ||
        (auction.state !== AuctionViewState.Defective &&
          auction.auction.info.bidState.bids.some(
            b => b.key == profile.ownerId,
          )),
    );
  }

  let myCollections: any[] = [];
  let keys: string[] = [];
  return (
    <>
      {profile && (
        <div className="profile-main-content">
          <Inventory
            owned={owned}
            profile={profile}
            auctions={auctions}
            nfts={created}
          />
        </div>
      )}
      {/* <LoadingScreen open={profileOwnerMutation.isLoading} /> */}
    </>
  );
};
