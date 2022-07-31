import { ConnectWallet } from "../ConnectWalletButton/ConnectWalletButton";
import React, { useState, useContext } from "react";
import { WalletContext } from "../../App";
import { Typography, Avatar } from "@ensdomains/thorin";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";

const Wrapper = styled.div`
  padding-top: 1vh;
  margin-left: 1vh;
`;

declare const window: any; // allow the window.ethereum shim

export function Navbar() {
  const { signer, set } = useContext(WalletContext);

  console.log(signer);

  return (
    <Wrapper>
      <Grid container spacing={2}>
        <Grid item xs={0.75}>
          <div style={{ width: "7.5vh" }}>
            <Avatar label="RavePlace" src="https://rave.domains/RaveBase.png" />
          </div>
        </Grid>
        <Grid item xs={0.9}>
          <Typography
            as="h3"
            variant="extraLarge"
            weight="bold"
            style={{
              marginTop: "2px",
            }}
          >
            <b>RavePlace</b>
          </Typography>
        </Grid>
        <Grid item xs={0.25}>
          <Typography
            as="h3"
            variant="extraLarge"
            weight="semiBold"
            style={{
              marginTop: "2px",
            }}
          >
            {" "}
            |{" "}
          </Typography>
        </Grid>
        <Grid item xs={0.6}>
          <Link to="/">
            <Typography
              as="h3"
              variant="extraLarge"
              weight="semiBold"
              style={{
                marginTop: "2px",
              }}
            >
              Home
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={0.25}>
          <Typography
            as="h3"
            variant="extraLarge"
            weight="semiBold"
            style={{
              marginTop: "2px",
            }}
          >
            {" "}
            |{" "}
          </Typography>
        </Grid>
        <Grid item xs={0.6}>
          <Link to="/listings">
            <Typography
              as="h3"
              variant="extraLarge"
              weight="semiBold"
              style={{
                marginTop: "2px",
              }}
            >
              Listings
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={0.25}>
          <Typography
            as="h3"
            variant="extraLarge"
            weight="semiBold"
            style={{
              marginTop: "2px",
            }}
          >
            {" "}
            |{" "}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Link to="/my">
            <Typography
              as="h3"
              variant="extraLarge"
              weight="semiBold"
              style={{
                marginTop: "2px",
              }}
            >
              My Profile
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={4.4} />
        <Grid item xs={3}>
          <ConnectWallet data={{ signer: signer, set: set }} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}
