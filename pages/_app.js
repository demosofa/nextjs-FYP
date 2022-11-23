import { Provider } from "react-redux";
import { store } from "../frontend/redux/store";
import "../styles/_globals.scss";
import Layout from "../frontend/layouts";
import Head from "next/head";
import { MediaContext, AblyContext } from "../frontend/contexts";

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
