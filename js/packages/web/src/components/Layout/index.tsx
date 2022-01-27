import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { Footer } from '../Footer';

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <>
      <Layout id={'main-layout'}>
        <span id={'main-bg'}></span>
        <span id={'bg-gradient'}></span>
        <span id={'static-header-gradient'}></span>
        <span id={'static-end-gradient'}></span>
        <Header
          className="App-Bar"
          style={{
            position: 'fixed',
            zIndex: 1,
            left: 0,
            background: '#121212',
          }}
        >
          <AppBar />
        </Header>
        <Layout id={'width-layout'}>
          <Content
            className="App-Content"
            style={{
              overflow: 'scroll',
              padding: '30px 48px ',
            }}
          >
            {props.children}
          </Content>
        </Layout>
        {/*<Footer />*/}
      </Layout>
    </>
  );
});
