import styles from "../styles/Home.module.css";
import Deposit from "./deposit.js";
import DepositData from "./depositData.js";

export default function Main() {
  return (
    <section className={styles.container}>
      <Deposit />
      <DepositData />
    </section>
  );
}
