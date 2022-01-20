import {
  AccountsProvider,
  ConnectionProvider,
  StoreProvider,
  WalletProvider,
  MetaProvider,
} from '@oyster/common';
import React, { FC } from 'react';
import { ConfettiProvider } from './components/Confetti';
import { AppLayout } from './components/Layout';
import { LoaderProvider } from './components/Loader';
import { CoingeckoProvider } from './contexts/coingecko';
import { ProfileProvider } from './contexts/profile';

export const Providers: FC = ({ children }) => {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <AccountsProvider>
          <CoingeckoProvider>
            <StoreProvider
              ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
              storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
            >
              <MetaProvider>
                <LoaderProvider>
                  <ConfettiProvider>
                    <ProfileProvider>
                      <AppLayout>{children}</AppLayout>
                    </ProfileProvider>
                  </ConfettiProvider>
                </LoaderProvider>
              </MetaProvider>
            </StoreProvider>
          </CoingeckoProvider>
        </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
