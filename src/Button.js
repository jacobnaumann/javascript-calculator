import React from 'react';

const Button = ({ label, id, onClick }) => {
  return <button id={id} onClick={() => onClick(label)}>{label}</button>;
}

export default Button;
