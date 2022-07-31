import styled, { keyframes } from "styled-components";
import { Typography } from "@ensdomains/thorin";

const transitionGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const Gradient = styled(Typography)`
  color: #caf0f8;
  background-image: linear-gradient(90deg, #03045e, #0096c7);
  padding: 2px 20px;
  border-radius: 15px;
  margin-top: 4vh;
  padding-bottom: 10px;
`;

export const GradientAngle = styled(Typography)`
  color: #caf0f8;
  background-image: linear-gradient(315deg, #03045e, #0096c7);
  padding: 2px 20px;
  border-radius: 15px;
  margin-top: 4vh;
  padding-bottom: 10px;
`;

export const AnimatedGradient = styled(Typography)`
  color: #caf0f8;
  background-image: linear-gradient(90deg, #03045e, #0096c7);
  padding: 2px 20px;
  border-radius: 15px;
  margin-top: 4vh;
  background-size: 200% 200%;
  animation-name: ${transitionGradient};
  animation-duration: 8s;
  animation-iteration-count: infinite;
`;

export const Ag = AnimatedGradient;
