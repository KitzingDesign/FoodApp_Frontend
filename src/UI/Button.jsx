import React from "react";
import styled from "styled-components";

import { COLORS } from "./constants";
import { Link } from "react-router-dom";

const SIZES = {
  small: {
    "--borderRadius": 4 + "px",
    "--fontSize": 16 / 16 + "rem",
    "--padding": "4px 14px",
  },
  medium: {
    "--borderRadius": 4 + "px",
    "--fontSize": "16px",
    "--padding": "8px 16px",
  },
  large: {
    "--borderRadius": 4 + "px",
    "--fontSize": 24 / 16 + "rem",
    "--padding": "20px 64px",
  },
};

const Button = ({ variant, size, children, destination, ...props }) => {
  const styles = SIZES[size];

  let Component;
  if (variant === "fill") {
    Component = FillButton;
  } else if (variant === "fillRed") {
    Component = FillButtonRed;
  } else if (variant === "outline") {
    Component = OutlineButton;
  } else if (variant === "outlineRed") {
    Component = OutlineButtonRed;
  } else {
    Component = GhostButton;
  }

  return (
    <Component to={destination} style={styles} {...props}>
      {children}
    </Component>
  );
};

const ButtonBase = styled(Link)`
  font-size: var(--fontSize);
  display: inline-flex;
  font-family: "Inter", Helvetica;
  padding: var(--padding);
  color: var(--textColor);
  border-radius: var(--borderRadius);
  border: 2px solid transparent;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;

  &:focus {
    outline-color: ${COLORS.primary};
    outline-offset: 4px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FillButton = styled(ButtonBase)`
  background-color: ${COLORS.primary};
  color: ${COLORS.white};

  &:hover {
    background-color: ${COLORS.primaryLight};
  }
`;

const FillButtonRed = styled(ButtonBase)`
  background-color: ${COLORS.secondary};
  color: ${COLORS.white};

  &:hover {
    background-color: ${COLORS.secondaryLight};
  }
`;

const OutlineButton = styled(ButtonBase)`
  background-color: none;
  color: ${COLORS.primary};
  border: solid 2px #4156a1;

  &:hover {
    background-color: ${COLORS.offWhite};
  }
`;

const OutlineButtonRed = styled(ButtonBase)`
  background-color: none;
  color: ${COLORS.secondary};
  border: solid 2px ${COLORS.secondary};

  &:hover {
    background-color: ${COLORS.hoverRed};
  }
`;

const GhostButton = styled(ButtonBase)`
  color: ${COLORS.gray};
  background-color: transparent;

  &:focus {
    outline-color: ${COLORS.transparentGray75};
  }

  &:hover {
    color: ${COLORS.black};
    background-color: ${COLORS.transparentGray15};
  }
`;

export default Button;
