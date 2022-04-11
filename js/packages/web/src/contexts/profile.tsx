import React, { useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import profileService, { Profile } from '../services/profile';

export type ProfileContextType = {
  profile: Profile | null;
  profileLoading: boolean | false;
  setProfile: Function;
};

export type ProfileProviderProps = {
  children: ReactNode;
};

const ProfileContext = React.createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const wallet = useWallet();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const userId = wallet?.publicKey?.toString();

  useEffect(() => {
    setProfileLoading(true);

    if (userId) {
      (async () => {
        try {
          await profileService.getProfileByID(userId).then(res => {
            // setProfile(res);
            setProfileLoading(false);
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [userId]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profileLoading,
        setProfile,
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
