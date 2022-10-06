import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/_globals.scss";
import Layout from "../layouts";
import Head from "next/head";
import { MediaContext, AblyContext } from "../contexts";

function MyApp({ Component, pageProps, ...appProps }) {
  return (
    <Provider store={store}>
      <AblyContext>
        <MediaContext>
          <Layout routerPath={appProps.router.pathname}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </MediaContext>
      </AblyContext>
    </Provider>
  );
}

export default MyApp;
