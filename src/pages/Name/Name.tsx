import React, { useState, useEffect, useContext } from "react";
import { Ag, GradientAngle } from "../../components/styles/Gradient";
import { Card } from "../../components/styles/Card";
import { Button, Avatar, Typography, Modal, Card as ThorinCard } from "@ensdomains/thorin";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { WalletContext } from "../../App";
import { truncateAddress } from "../../utils/truncateAddress";
import { Rave } from "@rave-names/rave";
import type { Contract } from 'ethers';
import { ethers } from 'ethers';
import type { RaveName } from "@rave-names/rave";
import { is500 } from "../Listings/fortune500";
import { useLocalStorage } from "react-use-storage";
import { makeContract as c } from "../../contracts/RaveMarket";
import { makeContract as r } from "../../contracts/Rave";

const ravejs = new Rave();

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

interface Modals {
  list: boolean;
  offer: boolean;
}

interface Listing {
  name: string;
  value: number;
  expireTimestamp: number;
  active: boolean;
}

export function Name() {
  const { signer, set } = useContext(WalletContext);
  const [wallet, setWallet]: [any, any] = useState();
  const [nameData, setNameData]: [RaveName | undefined, any] = useState();
  const [contract, setContract]: [Contract | undefined, any] = useState(
    c({
      signerOrProvider: signer,
      address: "0x1A8D16c2e9398BcD43DbE6Cb2d7aa846ce3D131d",
    })
  );
  const [rave, setRave]: [Contract | undefined, any] = useState(
    r({
      signerOrProvider: signer,
      address: "0x6a403ffbbf8545ee0d99a63a72e5f335dfcae2bd",
    })
  )
  // was meant to be wallet but eh
  const [owner, setOwner]: [string, any] = useState(""); // can be initialised as not undefined because we'll only use it in === operations
  const { name } = useParams();
  const [ modals, setModals ]: [Modals, any] = useState({
    list: false,
    offer: false
  });
  const [ stage, setStage ]: [number, any] = useState(0);
  const [ input, setInput ]: [any, any] = useState();
  const [ loading, setLoading ]: [boolean, any] = useState(false);
  const [ listed, setListed ]: [boolean, any] = useState(false);
  const [ listing, setListing ]: [Listing | undefined, any] = useState();

  document.title = `RavePlace: ${name}`;

  useEffect(() => {
    const getData = async () => {
      return await ravejs.reverse(await ravejs.resolveStringToAddress(name as string));
    }

    const getListing = async () => {
      if (
        // @ts-ignore
        (await contract.functions.isListed(name.toUpperCase()))[0]
      ) {
        setListed(true);
        // @ts-ignore
        setListing(await contract.functions.getListing(name.toUpperCase()))
      } else {
        setListed(false);
      }
      // @ts-ignore
      console.log(await contract.functions.isListed(name.toUpperCase()))
    }

    saveToStorage(name as string);
    getData().then(res => setNameData(res));
    try {
      signer.getAddress().then((res: any) => setOwner(res));
    } catch (e) {
      setOwner('');
    }
    setContract(
      c({
        signerOrProvider: signer,
        address: "0x1A8D16c2e9398BcD43DbE6Cb2d7aa846ce3D131d",
      })
    );
    setRave(
      r({
        signerOrProvider: signer,
        address: "0x6a403ffbbf8545ee0d99a63a72e5f335dfcae2bd",
      })
    );// need to create a new contract every time the signer updates
    getListing();
  }, [signer]);

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

  const change = (e: any) => {
    setInput(e.target.value)
  }

  //  if (wallet) ((new Rave()).reverse(wallet)).then(res => setName(res.name));
  // @ts-ignore
  const isOwner = (owner === ((typeof nameData != "undefined") ? nameData.owner : "0x0"));

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
      <Modal open={modals.list} onDismiss={() => {setModals({list: false, offer: false})}}>
        <ThorinCard style={{
          width: '40vw',
          height: '40vh'
        }}>
          <Typography as="h1" style={{
            fontSize: '52px',
            marginBottom: '2vh'
          }}>
            List {name}
          </Typography>
          <Stack direction="row">
            <input type="number" style={{
              width: '25vw',
              marginRight: '2vw',
              fontSize: '36px',
              border: '1px solid #888888',
              padding: '5px',
              borderRadius: '15px',
              paddingLeft: '9px',
            }}
            value={input}
            onChange={change}/>
            <Button style={{
              width: '10vw'
            }}
            loading={loading}
            onClick={async () => {
              if (stage === 0) {
                setLoading(true);
                // @ts-ignore
                await rave.functions.approveName(name.toUpperCase(), owner, contract.address);
                setLoading(false);
                setStage(stage + 1);
              } else if (stage === 1) {
                setLoading(true);
                // @ts-ignore
                await contract.functions.listName(name.toUpperCase(), input as number, (~~(Date.now() / 1000) + 31536000), {value: ethers.utils.parseEther('1')}); //list for a year
                setLoading(false);
                setStage(stage + 1);
              }
            }}
            >List (Stage {stage}/2)</Button>
          </Stack>
          <Button onClick={() => {
            setModals({
              list: false,
              offer: false,
            });
            setLoading(false);
          }}
          style={{
            width: "99%",
            marginTop: "5vh"
          }}>Close</Button>
        </ThorinCard>
      </Modal>
      <Modal open={modals.offer} onDismiss={() => {setModals({list: false, offer: false})}}>
        <ThorinCard style={{
          width: '40vw',
          height: '40vh'
        }}>
          <Typography as="h1" style={{
            fontSize: '52px'
          }}>
            Offer for {name}
          </Typography>
          <Typography as="h3" style={{
            marginBottom: '2vh'
          }}>
            Offers last for 7 days, the owner of {name} must approve it before accepting the offer
          </Typography>
          <Stack direction="row">
            <input type="number" style={{
              width: '25vw',
              marginRight: '2vw',
              fontSize: '36px',
              border: '1px solid #888888',
              padding: '5px',
              borderRadius: '15px',
              paddingLeft: '9px',
            }}
            value={input}
            onChange={change}/>
            <Button style={{
              width: '10vw'
            }}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              // @ts-ignore
              await contract.functions.makeOffer(name.toUpperCase(), ethers.utils.parseEther((input).toString()), (~~(Date.now() / 1000) + 604800), owner, {value: ethers.utils.parseEther((input).toString())}); //list for a week
              setLoading(false);
            }}
            >Offer</Button>
          </Stack>
          <Button onClick={() => {
            setModals({
              list: false,
              offer: false,
            });
            setLoading(false);
          }}
          style={{
            width: "99%",
            marginTop: "5vh"
          }}>Close</Button>
        </ThorinCard>
      </Modal>
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
            <Stack direction="row">
              {listed && <Card height="25vh" width="30.25vw">
                <Typography as="h1" style={{
                  fontSize: '42px'
                }}>
                  {name} is Listed
                </Typography>
                <Stack direction="row">
                  <Typography as="h1" style={{
                    fontSize: '31px',
                  }}>
                    {/* @ts-ignore MFW THIS SHIT*/}
                    Price: {listing.value}
                  </Typography>
                  <LinkButton onClick={() => {
                    // @ts-ignore MFW THIS SHIT
                    contract.functions.buyName(name.toUpperCase(), owner, {value: ethers.utils.parseEther(listing.value.toString())});
                  }}>Buy!</LinkButton>
                </Stack>
              </Card>}
              <Card height="25vh" width={listed ? "34vw" : "66vw"}>
                <Stack direction="column" style={{
                  alignItems: 'center'
                }}>
                  <Typography as="h3">
                    Actions
                  </Typography>
                  <Stack direction="row">
                    <LinkButton onClick={() => {setModals({list: false, offer: true})}}>Offer</LinkButton>
                    {/* @ts-ignore */}
                    {isOwner && <LinkButton onClick={() => {setModals({list: true, offer: false})}}>List</LinkButton>}
                  </Stack>
                </Stack>
              </Card>
            </Stack>
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
