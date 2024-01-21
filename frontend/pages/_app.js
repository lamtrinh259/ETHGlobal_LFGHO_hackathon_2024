import "@/styles/globals.css";
import {
  configureChains,
  sepolia,
  WagmiConfig,
  createClient,
  createConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";

const chains = [sepolia];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID,
    chains,
    appName: "GHOmium Assets",
  })
);

export default function App({ Component, pageProps }) {
  const { provider, webSocketProvider } = configureChains(
    [sepolia],
    [publicProvider()]
  );

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="midnight">
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
