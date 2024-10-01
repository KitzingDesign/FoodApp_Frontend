import React from "react";
import styled from "styled-components";

import { COLORS } from "./constants";

const SIZES = {
  small: {
    "--borderRadius": 4 + "px",
    "--fontSize": 16 / 16 + "rem",
    "--padding": "4px 14px",
  },
  medium: {
    "--borderRadius": 100 + "px",
    "--fontSize": 18 / 16 + "rem",
    "--padding": "12px 22px",
  },
  large: {
    "--borderRadius": 4 + "px",
    "--fontSize": 24 / 16 + "rem",
    "--padding": "20px 64px",
  },
};

const Button = ({ variant, size, children, ...props }) => {
  const styles = SIZES[size];

  let Component;
  if (variant === "fill") {
    Component = FillButton;
  } else if (variant === "outline") {
    Component = OutlineButton;
  } else {
    Component = GhostButton;
  }

  return <Component style={styles}>{children}</Component>;
};

const ButtonBase = styled.button`
  font-size: var(--fontSize);
  display: inline-flex;
  font-family: "Inter-SemiBold", Helvetica;
  padding: var(--padding);
  color: var(--textColor);
  text-transform: uppercase;
  border-radius: var(--borderRadius);
  border: 2px solid transparent;

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

const OutlineButton = styled(ButtonBase)`
  background-color: ${COLORS.beige};
  color: ${COLORS.primary};
  border: 2px solid currentColor;

  &:hover {
    background-color: ${COLORS.offWhite};
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
