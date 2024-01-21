import express from "express";
import Moralis from "moralis";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
const port = 5001;
dotenv.config();

app.use(cors());
app.use(express.json());

const MORALIST_API_KEY = process.env.MORALIST_API_KEY;

// Our endpoint
app.get("/getWalletbalance", async (req, res) => {
  try {
    const {query} = req;
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0xaa36a7", // chain ID of Sepolia
      address: query.address,
    });

    return res.status(200).send(response);
  } catch (e) {
      console.log(`Something went wrong ${e}`);
      return res.status(400).json({ error: e });
  }
})

Moralis.start({
  apiKEY: MORALIST_API_KEY,
}).then(() => {
  app.listen(port,() => {
    console.log("Listening for API calls");
    });
});
