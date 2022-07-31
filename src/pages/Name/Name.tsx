import React, { useState, useEffect, useContext } from "react";
import { Ag, GradientAngle } from "../../components/styles/Gradient";
import { Card } from "../../components/styles/Card";
import { Button, Avatar, Typography } from "@ensdomains/thorin";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { WalletContext } from "../../App";
import { truncateAddress } from "../../utils/truncateAddress";
import { Rave } from "@rave-names/rave";
import type { RaveName } from "@rave-names/rave";
import { is500 } from "../Listings/fortune500";
import { useLocalStorage } from "react-use-storage";

const rave = new Rave();

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
  padding-right: 2vh;
`;

const saveToStorage = (name: string) => {
  console.log(name);
  if (typeof window.localStorage.getItem("names") !== "string") {
    window.localStorage.setItem("names", JSON.stringify([]));
  }
  // @ts-ignore
  const gotten = JSON.parse(window.localStorage.getItem("names"));
  if (!(gotten[gotten.length - 1] === name)) gotten.push(name);
  window.localStorage.setItem("names", JSON.stringify(gotten));
};

export function Name() {
  const { signer, set } = useContext(WalletContext);
  const [wallet, setWallet]: [any, any] = useState();
  const [nameData, setNameData]: [RaveName | undefined,any] = useState();
  const { name } = useParams();

  document.title = `RavePlace: ${name}`;

  useEffect(() => {
    const getData = async () => {
      return await rave.reverse(await rave.resolveStringToAddress(name as string));
    }

    saveToStorage(name as string);
    getData().then(res => setNameData(res));
  }, []);

  console.log(nameData)

  /*const getWallet = async() => {
    let wallet: string | boolean;
    if (signer._isSigner) {
      wallet = signer.getAddress();
    } else {
      wallet = false;
    }
    return wallet || false;
  }

  useEffect(() => {
    console.log('useEffect trigger');
    console.log('',signer,'');
    getWallet().then(res => {
      setWallet(res);
    });
  }, [signer]);*/

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

  //  if (wallet) ((new Rave()).reverse(wallet)).then(res => setName(res.name));

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
        <Ag>{name}</Ag>
      </h1>
      <Stack direction="row" style={{ width: "60vh" }}>
        <GradientAngle>
          <div style={{ width: "22vw" }}>
            {/* @ts-ignore MFW THIS SHIT*/}
            <Avatar src={(typeof nameData !== "undefined") ? nameData.avatar : "https://rave.domains/RaveBase.png"} />
            <Typography as="h1" style={{fontSize: '36px'}}>{name}</Typography>
          </div>
        </GradientAngle>
        <Stack direction="column">
          <div style={{ marginLeft: '2vh' }}>
            <Card height="25vh" width="65vw">
              <Stack direction="column" style={{
                alignItems: 'center'
              }}>
                <Typography as="h1">No active listings.</Typography>
                <LinkButton>Offer</LinkButton>
              </Stack>
            </Card>
          </div>
          <div style={{ marginLeft: '2vh' }}>
            <Card height="25vh" width="67vw">
              <Stack direction="column" style={{
                alignItems: 'center'
              }}>
                <Typography as="h1">ℹ Information</Typography>
                <br />
                <Typography as="h2"><ul>
                  {/* @ts-ignore */}
                  <li>Owner: {(typeof nameData !== "undefined") ? nameData.owner : "None"}</li>
                  {/* @ts-ignore */}
                  <li>Avatar: {(typeof nameData !== "undefined") ? nameData.avatar : "None Set"}</li>
                  {/* @ts-ignore */}
                  <li>Collections: {whatIs(name)}</li>
                </ul></Typography>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Stack>
    </Wrapper>
  );
}
