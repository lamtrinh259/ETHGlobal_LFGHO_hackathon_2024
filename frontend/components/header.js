import { useEffect, useState } from "react";
import { Beans } from "@web3uikit/icons";
import styles from "../styles/Home.module.css";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useModal } from "connectkit";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { setOpen } = useModal();

  useEffect(() => {
    if (!isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);

  return (
    <section className={styles.header}>
      <section className={styles.header__logoSection}>
        <h1 className={styles.title}>GHOmium Assets</h1>
        <Beans fontSize="20px" className={styles.beans} />
      </section>

      <section className={styles.header_btn}>
        {!isLoggedIn ? (
          <button className={styles.connectBtn} onClick={disconnect}>
            DISCONNECT WALLET
          </button>
        ) : (
          <>
            <button
              //disabled={!connector.ready}
              onClick={() => setOpen(true)}
              className={styles.connectBtn}
            >
              CONNECT WALLET
            </button>
          </>
        )}
      </section>
    </section>
  );
}
