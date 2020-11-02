import React from 'react';

import './styles.scss';

interface SharedButtonTypes {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SharedButton = ({ label, onClick }: SharedButtonTypes) => {
  return <button onClick={onClick}>{label}</button>;
};

export default SharedButton;
