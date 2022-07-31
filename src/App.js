import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { GiBoltSpellCast } from "react-icons/gi";
import abi from "./abi/abi.json";
import data from "./data/data.json";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [nfts, setNfts] = useState(data);

  const balance = async (nft) => {
    const contract = new ethers.Contract(nft.address, abi, provider);
    const tempBalance = await contract.balanceOf(account);
    const tempNfts =[...nfts.list];
    const tempNft=tempNfts[tempNfts.findIndex((obj)=>obj.id==nft.id)];
    tempNft.owner=tempBalance >0;
    tempNft.count=tempBalance.toString();
    setNfts({
      list:tempNfts,
    })
  };

  const checkCollection = () => {
    data.list.forEach((nft) => {
      balance(nft);
    });
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
      setAccount(accounts[0]);
    } else {
      console.log("Install Metamask");
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    checkCollection();
  }, [account]);

  return (
    <div className="page">
      <div className="header">
        <img src={require(`./assets/images/logo.png`)} className="artIcon" />
        <p className="head">
          NFTMarket web 3.0
          <span>
            <GiBoltSpellCast style={{ marginLeft: "5px" }} />
          </span>
        </p>
        {account == "" ? (
          <button onClick={initConnection} className="button">
            Connect
          </button>
        ) : (
          <p className="p">
            Metamask wallet contract address
            <br />
            {account}
          </p>
        )}
      </div>
      <div className="main">
        {nfts.list.map((nft, index) => {
          return (
            <div key={index} className="card">
              <div style={{ position: "relative" }}>
                <a target={"_blank"} href={`${nft.link}`}>
                  <img
                    src={require(`./assets/images/opensea-logo.png`)}
                    className="cardimage"
                  />
                </a>
                <GiBoltSpellCast
                  className="cardimage"
                  style={{ opacity: nft.owner ? 1 : 0.2 }}
                />
              </div>
              <p className="counter">{nft.count}</p>
              <img
                src={require(`./assets/images/${nft.id}.${nft.type}`)}
                className="nftimage"
                style={{ opacity: nft.owner ? 1 : 0.2 }}
              />
              <p className="nfttext">{nft.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
