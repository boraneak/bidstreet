import React, { CSSProperties } from 'react';

const useStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};
export const UnderConstructionPage: React.FC<{ message: string }> = ({
  message,
}) => {
  return (
    <div style={useStyles.container}>
      <h3>{message}</h3>
    </div>
  );
};
