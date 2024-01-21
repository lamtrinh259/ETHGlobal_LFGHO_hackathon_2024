import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, ABI } from "../contracts/index.js";

export default function Deposit() {
  const { isConnected, address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [walletBalance, setWalletBalance] = useState("");

  const [depositTab, setDepositTab] = useState(true);
  const [withdrawTab, setWithdrawTab] = useState(false);
  const [withdrawValue, setWithdrawValue] = useState(0);

  const [assetIds, setAssetIds] = useState([]); // array of position ids in the smart contract
  const [assets, setAssets] = useState([]); // array of assets in the smart contract
  const [amount, setAmount] = useState(0);

  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEther = (wei) => ethers.utils.formatEther(wei);

  useEffect(() => {
    async function getWalletBalance() {
      await axios
        .get("http://localhost:5001/getwalletbalance", { // this is with the backend
          params: { address },
        })
        .then((response) => {
          setWalletBalance(response.data.balance);
        });
    }

    if (isConnected) {
      getWalletBalance();
    }
  }, [isConnected]);

  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    signerOrProvider: signer || provider,
  });

  const switchToWithdraw = async () => {
    if (!withdrawTab) {
      setWithdrawTab(true);
      setDepositTab(false);
      const assetIds = await getAssetIds(address, signer);
      setAssetIds(assetIds);
      getAssets(assetIds, signer);
    }
  };

  const switchToDeposit = () => {
    if (!depositTab) {
      setDepositTab(true);
      setWithdrawTab(false);
    }
  };

  const getAssetIds = async (address) => {
    const assetIds = await contract.getPositionIdsForAddress(address);
    return assetIds;
  };

  // unused function
  // const calcDaysRemaining = (unlockDate) => {
  //   const timeNow = Date.now() / 1000;
  //   const secondsRemaining = unlockDate - timeNow;
  //   return Math.max((secondsRemaining / 60 / 60 / 24).toFixed(0), 0);
  // };

  const getAssets = async (ids) => {
    const queriedAssets = await Promise.all(
      ids.map((id) => contract.getPositionById(id))
    );

    queriedAssets.map(async (asset) => {
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: calcDaysRemaining(Number(asset.unlockDate)),
        etherInterest: toEther(asset.weiInterest),
        etherDeposited: toEther(asset.weiDeposited),
        open: asset.open,
      };

      setAssets((prev) => [...prev, parsedAsset]);
    });
  };

  const depositEther = async () => { // no params because there's no deposit length
    const wei = toWei(String(amount));
    const data = { value: wei };
    await contract.depositEther(data);
  };

  const withdraw = (positionId) => {
    contract.closePosition(positionId);
  };

  return (
    <section className={styles.depositContainer}>
      <section>
        <section className={styles.depositWithdrawTab}>
          <section
            className={`${depositTab ? styles.depositType : ""}`}
            id="deposit"
            onClick={switchToDeposit}
          >
            Deposit
          </section>
          <section
            className={`${withdrawTab ? styles.depositType : ""}`}
            id="withdraw"
            onClick={switchToWithdraw}
          >
            Withdraw
          </section>
        </section>
        <section className={styles.depositSection}>
          <span className={styles.apy}>5% APY</span>
          {depositTab ? (
            <section className={styles.depositBox}>
              <h2>Deposit</h2>
              <input
                className={styles.inputField}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                id="inputField"
                maxLength="120"
                placeholder="Enter Amount"
                required
              />
              <section className={styles.depositInfo}>
                <p>
                  Balance:{" "}
                  <span>{(walletBalance / 10 ** 18).toLocaleString()}</span>
                </p>
                {/* hard coded number, need to modify */}
                <p>Exchange Rate: 1.03582967</p>
                {/* <p>Transaction Cost</p> */}
              </section>
              <button
                className={styles.depositBtn}
                onClick={() => depositEther(0, "5%")}
              >
                DEPOSIT
              </button>
            </section>
          ) : (
            <section className={styles.depositBox}>
              <h2>Withdraw</h2>
              <input
                className={styles.inputField}
                value={withdrawValue}
                onChange={(e) => setWithdrawValue(e.target.value)}
                type="number"
                id="inputField"
                maxLength="120"
                placeholder="Enter Amount"
                required
              />
              <section className={styles.depositInfo}>
                <p>
                  Balance:{" "}
                  {assets.length > 0 &&
                    assets.map((a, id) => {
                      if (a.open) {
                        return <span key={id}>{a.etherDeposited}</span>;
                      } else {
                        return <span></span>;
                      }
                    })}
                </p>
                {/* <p>Transaction Cost</p> */}
                <p>
                  You Receive: {withdrawValue == 0 ? "" : withdrawValue * 1.07}
                </p>
              </section>
              <button
                className={styles.depositBtn}
                onClick={() => withdraw(assets[assets.length - 1].positionId)}
              >
                WITHDRAW
              </button>
            </section>
          )}
        </section>
      </section>
      <section>
        <section className={styles.depositInfoSection}>
          <section className={styles.depositInfo}>
            <h2>Locked Deposit</h2>
            <section className={styles.lockedDeposit}>
              <span>Locked 30 days</span>
              <span className={styles.lockedDepositAPY}>8% API</span>
              <input
                className={styles.inputField}
                type="number"
                id="inputField"
                maxLength="120"
                placeholder="Enter Amount"
                required
              />
            </section>
          </section>
          <button className={styles.depositBtn}>DEPOSIT</button>
        </section>
      </section>
    </section>
  );
}
