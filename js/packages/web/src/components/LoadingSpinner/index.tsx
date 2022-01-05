import React from 'react';
import { Progress } from 'antd';

export const LoadingSpinner = (props: any) => {
  const { size = 60, color = 'var(--theme-color-1)' } = props;

  return (
    <div className="loading-spinner" style={{ color: color }}>
      <Progress
        type="circle"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={90}
      />
    </div>
  );
};
