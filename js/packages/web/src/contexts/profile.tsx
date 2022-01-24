import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// import { useMutation } from 'react-query';
import profileService from '../services/profile';
import { ProfileOwnerRequest, Profile } from '../services/profile/profile.types';

export type ProfileContextType = {
  profile: Profile | null;
  profileLoading: boolean | false;
};

export type ProfileProviderProps = {
  children: ReactNode;
};

const ProfileContext =
  React.createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const wallet = useWallet();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
  
    const userId = wallet?.publicKey?.toString();
  
    // const profileOwnerMutation = useMutation(
    //   (params: ProfileOwnerRequest) => profileService.getProfileOwner(params),
    //   {
    //     onSuccess: result => {
    //       if (result?.length > 0) {
    //         setProfile(result[0]);
  
    //         setProfileLoading(false);
    //       }
    //     },
    //   },
    // );
  
    useEffect(() => {
      setProfileLoading(true);
  
      if (userId) {
        // profileOwnerMutation.mutate({ ownerId: userId });
      }
    }, [userId]);
  
    return (
      <ProfileContext.Provider
        value={{
          profile,
          profileLoading
        }}
      >
        {children}
      </ProfileContext.Provider>
    );
  };
  
  export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    return context as ProfileContextType;
  };
