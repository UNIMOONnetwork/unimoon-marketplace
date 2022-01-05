import { useMeta } from '@oyster/common';
import React, { FC } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoaderProvider: FC = ({ children }) => {
  const { isLoading } = useMeta();

  const antIcon = <LoadingOutlined style={{ fontSize: 100, color: 'white' }} spin />;

  return (
    <>
      <div className={`loader-container ${isLoading ? 'active' : ''}`}>
        <div className="loader-block">
          <div className="loader-title">loading</div>
          <div className='loader'>
            <Spin indicator={antIcon} />
            <img className="loader-img" src="/unimoon1.png" width={100}/>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};
