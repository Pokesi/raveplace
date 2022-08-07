import React, { useState, useEffect, useContext } from "react";
import { Ag, GradientAngle } from "../../components/styles/Gradient";
import { Card } from "../../components/styles/Card";
import { Button } from "@ensdomains/thorin";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { WalletContext } from "../../App";
import { truncateAddress } from "../../utils/truncateAddress";
import { Rave } from "@rave-names/rave";
import type { RaveName } from "@rave-names/rave";
import { is500 } from "../Listings/fortune500";

const LinkButton = styled(Button)`
  background: linear-gradient(90deg, #e8dab2, #d4d8c9, #c0d6df);
  color: #000;
  border: 1px solid #b6b3a7;
  border-radius: 40px;
  width: 15vw;
  height: 10vh;
  margin-top: 5vh;
  font-size: 36px;
  margin-left: 2vh;
`;

const Wrapper = styled.div`
  padding-bottom: 2vh;
  margin-left: 2vh;
`;

export function Profile() {
  const { signer } = useContext(WalletContext);
  const [wallet, setWallet]: [any, any] = useState();
  const [name, setName]: [RaveName | boolean, any] = useState(false);

  document.title = "RavePlace: My Profile"

  useEffect(() => {
    const getWallet = async () => {
      let wallet: string | boolean;
      if (signer._isSigner) {
        wallet = signer.getAddress();
      } else {
        wallet = false;
      }
      return wallet || false;
    };
    console.log("useEffect trigger");
    console.log("", signer, "");
    getWallet().then((res) => {
      setWallet(res);
    });
  }, [signer]);

  const whatIs = (name: string | boolean) => {
    let is = [];
    if (!(typeof name === "boolean")) {
      if (/[a-zA-Z0-9]*\.ftm/gm.test(name)) {
        is.push(".ftm Name");
      }
      if (/0x[a-zA-Z0-9]*/gm.test(name)) {
        is.push("0x Name");
      }
      if (name.split(".ftm")[0].length === 1) {
        is.push("Single-letter Name");
      }
      if (name.split(".ftm")[0].length === 2) {
        is.push("Double-letter Name");
      }
      if (name.split(".ftm")[0].length === 3) {
        is.push("Triple-letter Name");
      }
      if (is500(name)) {
        is.push("Fortune 500 Name");
      }
    }
    return is.join(", ");
  };

  if (wallet) new Rave().reverse(wallet).then((res) => setName(res.name));

  return (
    <Wrapper>
      <h1
        style={{
          fontSize: "72px",
          marginBottom: "0px",
          paddingBottom: "0px",
          width: "98vw",
        }}
      >
        <Ag>
          {wallet ? truncateAddress(wallet) : "Connect to view your profile"}
          {name && ` | ${name}`}
        </Ag>
      </h1>
      {/* Only render this if a wallet is connected */}
      {wallet && (
        <>
          {name ? (
            <Card height="60vh" width="98vw" darker={true}>
              <h1>This name is a {whatIs(name)}</h1>
              <GradientAngle>
                <h1 style={{ fontSize: "72px" }}>
                  <Card height="25vh" width="94vh" inner={true} text="#FFF">
                    You own {name}
                  </Card>
                </h1>
              </GradientAngle>
              <Stack direction="row">
                <Link to={`/name/${name}`}>
                  <LinkButton>View</LinkButton>
                </Link>
              </Stack>
            </Card>
          ) : (
            <p>Register or buy a name to view this part of your profile</p>
          )}
        </>
      )}
    </Wrapper>
  );
}
