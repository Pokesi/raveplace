import { makeContract } from "../../contracts/RaveMarket";
import { Ag, Gradient, GradientAngle, Card } from "../../components/styles";
import { Typography } from "@ensdomains/thorin";
import React, { useState, useEffect, useContext } from "react";
import type { Contract } from "ethers";
import { WalletContext } from "../../App";
import { is500 } from "./fortune500";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Stack from "@mui/material/Stack";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)`
  borderRadius: 15px;
  border: 1px solid #888888;
`

const Wrapper = styled.div`
  margin: 2vh;
`;
const regex = {
  ftm: /[a-zA-Z0-9]*\.ftm/gm,
  ox: /0x[a-zA-Z0-9]*/gm,
  single: /[a-zA-Z0-9].ftm/gm,
  double: /[a-zA-Z0-9]{2}.ftm/gm,
  triple: /[a-zA-Z0-9]{3}.ftm/gm,
};
export function Listings({
  category,
}: {
  category?: "ftm" | "0x" | "single" | "double" | "triple" | "fortune500";
}) {
  document.title = `RavePlace: ${category || ""} Listings`

  const { signer, set } = useContext(WalletContext);
  const [contract, setContract]: [Contract | undefined, any] = useState(
    makeContract({
      signerOrProvider: signer,
      address: "0x1A8D16c2e9398BcD43DbE6Cb2d7aa846ce3D131d",
    })
  );
  const [allListings, setAllListings]: [string[][] | undefined, any] = useState(
    [["0xLoading", "loading.ftm"]]
  );
  const [ input, setInput ]: [string, any] = useState("");

  let title;
  switch (category) {
    case null || undefined:
      title = "Explore";
      break;
    case "ftm":
      title = "Explore .ftm Names";
      break;
    case "0x":
      title = "Explore 0x Names";
      break;
    case "single":
      title = "Explore single-letter Names";
      break;
    case "double":
      title = "Explore double-letter Names";
      break;
    case "triple":
      title = "Explore triple-letter Names";
      break;
    case "fortune500":
      title = "Explore Fortune 500 Names";
      break;
  }

  useEffect(() => {
    const getAllListings = async () => {
      let listings;
      try {
        listings = (await contract.functions.getAllListings())[0];
      } catch (e) {
        listings = ["0xLabs", "z.ftm", "amazon.ftm"];
      }
      if (listings === ['']) listings = ["0xLabs", "z.ftm", "amazon.ftm"]
      let newListings: string[];
      if (category) {
        newListings = listings.filter((listing: string) =>
          // idk why so many parentheses
          whatIsRaw(listing.toLowerCase()).includes(category)
        );
      } else {
        newListings = [...listings];
        newListings.shift();
      }
      newListings = newListings.filter((listing: string) =>
        // idk why so many parentheses
        listing.toLowerCase().startsWith(input as string)
      );
      for (let i=0; i < newListings.length; i++) {
        newListings[i] = newListings[i].toLowerCase();
      }
      // @dev Credit: https://typeofnan.dev/how-to-split-an-array-into-a-group-of-arrays-in-javascript/
      const result = new Array(
        Math.ceil((newListings.length + Number.EPSILON) / 5)
      )
        // Make sure each element isn't empty
        .fill("")
        // For each group, grab the right `slice` of the input array
        .map((_, i) => newListings.slice(i * 5, (i + 1) * 5));

      setAllListings(result);
    };
    setContract(
      makeContract({
        signerOrProvider: signer,
        address: "0x1A8D16c2e9398BcD43DbE6Cb2d7aa846ce3D131d",
      })
    );
    getAllListings();
  }, [signer, category, input]);

  const whatIs = (name: string) => {
    let is = [];
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
    return is.join(", ");
  };

  const whatIsRaw = (name: string) => {
    console.log(name);
    let is = [];
    if (/[a-zA-Z0-9]*\.ftm/gm.test(name)) {
      is.push("ftm");
    }
    if (/0x[a-zA-Z0-9]*/gm.test(name)) {
      is.push("0x");
    }
    if (name.split(".ftm")[0].length === 1) {
      is.push("single");
    }
    if (name.split(".ftm")[0].length === 2) {
      is.push("double");
    }
    if (name.split(".ftm")[0].length === 3) {
      is.push("triple");
    }
    if (is500(name)) {
      is.push("fortune500");
    }
    return is;
  };


  const change = (e: any) => {
    setInput(e.target.value as string)
  }

  return (
    <Wrapper>
      <h1
        style={{
          fontSize: "72px",
        }}
      >
        <Ag>{title}</Ag>
      </h1>
      <Stack direction="row" style={{
        paddingTop: '1vh'
      }}>
        <Typography as="h1" id="demo-simple-select-label" style={{
          marginTop: '2vh',
          marginLeft: '1vh',
          fontSize: '27px',
          marginRight: '1vh',
        }}>Filter names</Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{
            width: '40vw',
            height: '8vh',
            borderRadius: '15px'
          }}
          placeholder={category || "All"}
          input={<BootstrapInput />}
        >
          <Link to="/listings"><MenuItem value={10}>All Names</MenuItem></Link>
          <Link to="/listings/ftm"><MenuItem value={10}>.ftm Names</MenuItem></Link>
          <Link to="/listings/0x"><MenuItem value={10}>0x Names</MenuItem></Link>
          <Link to="/listings/single"><MenuItem value={10}>Single letter Names</MenuItem></Link>
          <Link to="/listings/double"><MenuItem value={10}>Double letter Names</MenuItem></Link>
          <Link to="/listings/triple"><MenuItem value={10}>Triple letter Names</MenuItem></Link>
          <Link to="/listings/fortune500"><MenuItem value={10}>Fortune 500 Names</MenuItem></Link>
        </Select>
        <input style={{
            width: '25vw',
            marginRight: '2vw',
            fontSize: '36px',
            border: '1px solid #888888',
            padding: '5px',
            borderRadius: '15px',
            marginLeft: '2vh',
            paddingLeft: '20px',
            background: 'transparent',
          }}
          value={input}
          onChange={change}
          placeholder='Search for a name'
        />
      </Stack>
      {/* \/ This maps the 5-split arrays */}
      <Stack direction="column">
        {/* @ts-ignore */}
        {allListings.map(function (item, index) {
          /* \/ This maps the 5 in the split arrays */
          return (
            <Stack direction="row">
              {/* @ts-ignore */}
              {item.map(function (name, key) {
                return (
                  <Link to={`/name/${name}`}>
                    <Card height="40vh" width="45vh" darker={true}>
                      <h1>This name is a {whatIs(name)}</h1>
                      <GradientAngle>
                        <h1 style={{ fontSize: "36px" }}>
                          <Card
                            height="17.5vh"
                            width="10vh"
                            inner={true}
                            text="#FFF"
                          >
                            {name}
                          </Card>
                        </h1>
                      </GradientAngle>
                    </Card>
                  </Link>
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </Wrapper>
  );
}
