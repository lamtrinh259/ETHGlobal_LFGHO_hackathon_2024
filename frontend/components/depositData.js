import styles from "../styles/Home.module.css";

export default function DepositData() {
  return (
    // all hard-coded data for now
    <section className={styles.depositDataContainer}>
      <section className={styles.depositData}>
        <span>Total Deposited Tokens</span>
        <span className={styles.depositData__value}>$1,000,000</span>
      </section>
      <section className={styles.depositData}>
        <span>Total Interest Paid</span>
        <span className={styles.depositData__value}>$10,000</span>
      </section>
      <section className={styles.depositData}>
        <span>Stakers</span>
        <span className={styles.depositData__value}>100</span>
      </section>
      </section>
  )
  }
