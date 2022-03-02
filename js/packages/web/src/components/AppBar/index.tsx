import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Modal } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { HowToBuyModal } from '../HowToBuyModal';
import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../CurrentUserBadge';
import { ConnectButton } from '@oyster/common';
import { MobileNavbar } from '../MobileNavbar';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Search } = Input;

const getDefaultLinkActions = (connected: boolean) => {
  return [
    <Link to={`/home`} key={'explore'}>
      <Button className="app-btn">Explore</Button>
    </Link>,
    <Link to={`/collections`} key="collections">
      <Button className="app-btn">Collections</Button>
    </Link>,
    <Link to={`/artists`} key={'artists'}>
      <Button className="app-btn">Creators</Button>
    </Link>,
    <Link to={`/rank-board`} key={'rankboard'}>
      <Button className="app-btn">Stats</Button>
    </Link>,
  ];
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const { width } = useWindowDimensions();

  const onSearch = () => history.push(`/search?q=` + searchText);

  const onSearchChange = e => {
    setSearchText(e.target.value);
  };

  const searchInput =
    width < 1180 ? (
      ''
    ) : (
      <Input
        className={'search-box'}
        placeholder="Search Collections"
        value={searchText}
        onChange={onSearchChange}
        onPressEnter={onSearch}
      />
    );
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
        }}
      >
        {getDefaultLinkActions(connected)}
      </div>
      {searchInput}
    </>
  );
};

export const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { connected } = useWallet();

  if (width < 950)
    return (
      <>
        <Modal
          title={
            <img src={'/unimoon-text-logo.png'} style={{ height: '30px' }} />
          }
          visible={isModalVisible}
          footer={null}
          className={'modal-box app-bar-modal'}
          closeIcon={
            <img
              onClick={() => setIsModalVisible(false)}
              src={'/modals/close.svg'}
            />
          }
        >
          <div className="site-card-wrapper mobile-menu-modal">
            <Menu onClick={() => setIsModalVisible(false)}>
              {getDefaultLinkActions(connected).map((item, idx) => (
                <Menu.Item key={idx}>{item}</Menu.Item>
              ))}
            </Menu>
            <div className="actions">
              {!connected ? (
                <div
                  className="actions-buttons"
                  style={{ textAlign: 'center' }}
                >
                  <ConnectButton
                    onClick={() => setIsModalVisible(false)}
                    className="unimoon-button gradient-button"
                  />
                </div>
              ) : (
                <>
                  <CurrentUserBadgeMobile
                    showBalance={false}
                    showAddress={true}
                    iconSize={24}
                    closeModal={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  {/* <Notifications /> */}
                  {/* <Cog /> */}
                </>
              )}
            </div>
          </div>
        </Modal>
        <MenuOutlined
          onClick={() => setIsModalVisible(true)}
          style={{ fontSize: '1.4rem' }}
        />
      </>
    );

  return <DefaultActions />;
};

export const LogoLink = () => {
  return (
    <Link to={`/`}>
      <img src={'/metaplex-logo.png'} height={90} />
    </Link>
  );
};

export const AppBar = () => {
  const { connected } = useWallet();

  return (
    <>
      <MobileNavbar />
      <div id="desktop-navbar">
        <div className="app-left">
          <LogoLink />
        </div>
        <div className="app-right">
          <MetaplexMenu />
          {!connected && (
            <ConnectButton
              style={{ height: 48 }}
              allowWalletChange
              className="unimoon-button gradient-button"
            />
          )}
          {connected && (
            <>
              <CurrentUserBadge
                showBalance={false}
                showAddress={true}
                iconSize={24}
              />
              {/* <Notifications /> */}
              {/* <Cog /> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};
