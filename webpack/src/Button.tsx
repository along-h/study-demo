import React from "react";
import styled from "styled-components";
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}
const SCxButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
`;
export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <SCxButton onClick={onClick}>{children}</SCxButton>;
};
