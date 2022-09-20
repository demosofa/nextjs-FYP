import { useMedia } from "../hooks";
import { Devices } from "../shared";
import { createContext } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/_globals.scss";
import Layout from "../layouts";
import Head from "next/head";

export const Media = createContext();

function MyApp({ Component, pageProps, ...appProps }) {
  const device = useMedia();
  return (
    <Provider store={store}>
      <Media.Provider value={{ device, Devices }}>
        <Layout routerPath={appProps.router.pathname}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </Media.Provider>
    </Provider>
  );
}

export default MyApp;
