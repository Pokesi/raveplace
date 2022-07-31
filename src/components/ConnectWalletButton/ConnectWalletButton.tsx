import { Button, LockClosedSVG } from "@ensdomains/thorin";
import styled from "styled-components";
import { useState } from "react";
import { ethers, providers } from "ethers";
import { Rave } from "@rave-names/rave";

declare const window: any; // allow the window.ethereum shim

const rave = new Rave();

const ConnectButton = styled(Button)`
  background: linear-gradient(90deg, #e8dab2, #d4d8c9, #c0d6df);
  color: #000;
  align-self: flex-end;
  justify-self: flex-end;
  float: right;
  border: 1px solid #b6b3a7;
`;

const ConnectWrapper = styled.div`
  &:hover ${ConnectButton} {
    shadow: none;
  }
`;

interface AcctData {
  account: string | boolean;
  signer: ethers.providers.JsonRpcSigner | boolean;
  name: string | boolean;
}

type BtnProps = {
  data: object;
  style?: any;
};

export function ConnectWallet({ data, style }: BtnProps) {
  const [state, setState] = useState(false);

  // @ts-ignore
  const { signer, set } = data;

  const acctDataDefault: AcctData = {
    account: false,
    signer: false,
    name: false,
  };

  const [acctData, setAcctData] = useState(acctDataDefault);

  const connectWallet = async () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xFA",
          rpcUrls: ["https://rpc.ftm.tools"],
          chainName: "Fantom Opera",
          nativeCurrency: {
            name: "FTM",
            symbol: "FTM",
            decimals: 18,
          },
          blockExplorerUrls: ["https://ftmscan.com/"],
        },
      ],
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum, 250);
    let signer = provider.getSigner();
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    const name = await rave.reverse(account);

    setAcctData({
      signer: signer,
      account: account,
      name: name.name,
    });

    set(signer);

    console.log(acctData);
  };

  return (
    <ConnectWrapper>
      <div style={{ width: "240px" }}>
        <ConnectButton
          prefix={<LockClosedSVG />}
          shadowless={true}
          variant="primary"
          disabled={false}
          loading={state}
          onClick={async () => {
            setState(true);
            await connectWallet();
            setState(false);
          }}
        >
          {acctData.account
            ? acctData.name || acctData.account
            : "Connect Wallet"}
        </ConnectButton>
      </div>
    </ConnectWrapper>
  );
}
