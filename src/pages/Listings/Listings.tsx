import { makeContract } from "../../contracts/RaveMarket";
import { Ag, Gradient, GradientAngle, Card } from "../../components/styles";
import React, { useState, useEffect, useContext } from "react";
import type { Contract } from "ethers";
import { WalletContext } from "../../App";
import { is500 } from "./fortune500";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Stack from "@mui/material/Stack";

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
      address: "0x000000000000000000000000000000000",
    })
  );
  const [allListings, setAllListings]: [string[][] | undefined, any] = useState(
    [["0xLoading", "loading.ftm"]]
  );

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
        listings = await contract.functions.getAllListings();
      } catch (e) {
        listings = ["0xLabs", "z.ftm", "amazon.ftm"];
      }
      console.log(listings.length);
      let newListings = listings.slice();
      if (category) {
        newListings = listings.filter((listing: string) =>
          // idk why so many parentheses
          whatIsRaw(listing).includes(category)
        );
        /* Here for reference.
        for (let i=0; listings.length > i; i++) {
          console.log('Index:', i);
          console.log('Testing:', listings[i]);
          console.log('Includes:', whatIsRaw(listings[i]).includes(category));
          if (!((whatIsRaw(listings[i]).includes(category)))) {
            console.log('Removed:', listings[i]);
            tempListings = newListings.splice(i, 1);
            console.log('Listings ; newListings', listings , ';', newListings)
          }
        }
        */
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
        address: "0x000000000000000000000000000000000",
      })
    );
    getAllListings();
  }, [signer]);

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
    console.log(is, name);
    return is;
  };

  return (
    <Wrapper>
      <h1
        style={{
          fontSize: "72px",
        }}
      >
        <Ag>{title}</Ag>
      </h1>
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
