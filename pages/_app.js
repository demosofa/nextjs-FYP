import { useMedia } from "../hooks";
import { Devices } from "../shared";
import { createContext } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/_globals.scss";
import Layout from "../Layout";

export const Media = createContext();

function MyApp({ Component, pageProps, ...appProps }) {
  const device = useMedia();
  return (
    <Provider store={store}>
      <Media.Provider value={{ device, Devices }}>
        <Layout routerPath={appProps.router.pathname}>
          <Component {...pageProps} />
        </Layout>
      </Media.Provider>
    </Provider>
  );
}

export default MyApp;
