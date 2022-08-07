import React, { useState, useEffect } from "react";
import { Ag, Gradient, GradientAngle } from "../../components/styles/Gradient";
import { Card } from "../../components/styles/Card";
import { Button, LockClosedSVG, Typography } from "@ensdomains/thorin";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { useLocalStorage } from "react-use-storage";
import { is500 } from "../Listings/fortune500";

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding-bottom: 5vh;
`;

const LinkButton = styled(Button)`
  background: linear-gradient(90deg, #e8dab2, #d4d8c9, #c0d6df);
  color: #000;
  border: 1px solid #b6b3a7;
  border-radius: 40px;
  width: 15vw;
  height: 10vh;
  margin-top: 5vh;
  font-size: 36px;
`;

export function Home() {
  const [names, setNames, removeNames] = useLocalStorage("names-searched", []);
  console.log(names);

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

  const to5 = (array: any) => {
    return array.slice(array.length - 4, array.length);
  };

  document.title = "RavePlace"

  return (
    <div className="App">
      <Wrapper>
        <h1
          style={{
            fontSize: "86px",
          }}
        >
          <Ag>RavePlace - Buy and sell .ftm names</Ag>
        </h1>
        <h1 style={{ color: "#585756", fontSize: "42px", paddingTop: "2vh" }}>
          Trade usernames on the fastest chain
        </h1>
        <Stack direction="row">
          <Link to="/listings">
            <LinkButton>Explore</LinkButton>
          </Link>
          {/*<Link to="/my" style={{ marginLeft: '12px', }}>
          <LinkButton>Your Profile</LinkButton>
        </Link>*/}
        </Stack>
        {window.localStorage.getItem("names") && (
          <h2 style={{ fontSize: "44px", color: '#585756' }}>
            <Gradient>Pick up where you left off</Gradient>
            <Typography as="h2" style={{fontSize: "34px", }}>Names you were looking at</Typography>
          </h2>
        )}
        <Stack direction="row">
          {window.localStorage.getItem("names") &&
            // @ts-ignore
            to5(JSON.parse(window.localStorage.getItem("names"))).map(function (
              // @ts-ignore
              name,
              // @ts-ignore
              key
            ) {
              return (
                <Link to={`/name/${name}`}>
                  <Card height="40vh" width="45vh" darker={true} right={false}>
                    <h1 style={{ fontSize: "15px" }}>
                      This name is a {whatIs(name)}
                    </h1>
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
        <h2 style={{ fontSize: "44px" }}>
          <Gradient>Search by Category</Gradient>
        </h2>
        <Stack direction="column">
          <Stack direction="row">
            <Link to="/listings/ftm">
              <Card height="35vh" width="45vh">
                <h1>.ftm Names</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        ftm.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        z.ftm
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        💀.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        cool.ftm
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
            <Link to="/listings/0x">
              <Card height="35vh" width="45vh">
                <h1>0xNames</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        0x0
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        0xFA
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        0xLabs
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        0xUnified
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
            <Link to="/listings/single">
              <Card height="35vh" width="45vh">
                <h1>Single letters</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        a.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        z.ftm
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        *.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        ?.ftm
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
          </Stack>
          <Stack direction="row">
            <Link to="/listings/double">
              <Card height="35vh" width="45vh">
                <h1>Double letters</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        fr.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        ig.ftm
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        aa.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        pp.ftm
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
            <Link to="/listings/triple">
              <Card height="35vh" width="45vh">
                <h1>Triple letters</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        ftm.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        ???.ftm
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        omg.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        red.ftm
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
            <Link to="/listings/fortune500">
              <Card height="35vh" width="45vh">
                <h1>Fortune 500</h1>
                <Gradient>
                  <Stack direction="column">
                    <Stack direction="row">
                      <Card height="5vh" width="11vh" inner={true} text="#FFF">
                        AMZN.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        apple.ftm
                      </Card>
                    </Stack>
                    <Stack direction="row">
                      <Card height="5vh" width="12vh" inner={true} text="#FFF">
                        google.ftm
                      </Card>
                      <Card height="5vh" width="10vh" inner={true} text="#FFF">
                        cvs.ftm
                      </Card>
                    </Stack>
                  </Stack>
                </Gradient>
              </Card>
            </Link>
          </Stack>
        </Stack>
      </Wrapper>
    </div>
  );
}
