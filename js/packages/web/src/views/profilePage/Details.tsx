import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useWallet } from '@solana/wallet-adapter-react';
import { Identicon } from '@oyster/common';

import { Profile }  from '../../services/profile/profile.types';

interface DetailsProps {
  profile?: Profile;
}

export const Details = ({
  profile,
}: DetailsProps) => {
  const wallet = useWallet();
  const userId = wallet?.publicKey?.toString();

  const identicon = (
    <Identicon
      address={wallet?.publicKey?.toString()}
      style={{ width: 42, height: 42 }}
    />
  );

  const memberSince = useMemo(() => {
    if (profile?.member_since) {
      return moment(profile?.member_since).format('MMM D, YYYY');
    }
    return '';
  }, [profile?.member_since]);

  return (
    <div className="profile-details-container">
      {profile ? (
        <img className="profile-avatar" src={profile.imageUrl} />
      ) : (
        <ListItemAvatar>{identicon}</ListItemAvatar>
      )}
      <div className="profile-name-container">
        {profile ? profile.name : 'Caseclosed'}
        {/* <Share className="profile-share" fontSize="small" /> */}
      </div>
      {profile && profile.ownerId == userId && (
        <>
          <Link to={`/edit-profile`} style={{ width: '100%' }}>
            <button className="profile-action-button" style={{borderRadius: 12}}>
              Edit profile
            </button>
          </Link>
        </>
      )}
      {profile && (
        <>
          {profile?.description && (
            <div className="profile-about">
              {profile?.description}
            </div>
          )}
          <div className="profile-member-since">
            {`MEMBER SINCE: ${memberSince}`}
          </div>
        </>
      )}
      {profile && profile.ownerId != userId && (
        <>
          <Link to={`/`} style={{ marginBottom: 24, width: '100%' }}>
            <button className="profile-action-button">Follow</button>
          </Link>
          <div className="following-area">
            <div>Followers</div>
            <div>{profile.followers}</div>
          </div>
          <div className="following-area">
            <div>Following</div>
            <div>{profile.following}</div>
          </div>
        </>
      )}
    </div>
  );
};