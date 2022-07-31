import styled from "styled-components";

const Wrapper = styled.div`
  margin-left: 1vh;
  align-items: center;
  align-self: center;
  align: center;
`;

export function Footer() {
  return (
    <Wrapper>
      <p>&copy; Rave Names 2022-{new Date().getFullYear()}</p>
    </Wrapper>
  );
}
