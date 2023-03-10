import Head from "next/head";
import { Provider } from "react-redux";
import { AblyContext, MediaContext, SWRContext } from "../frontend/contexts";
import Layout from "../frontend/layouts";
import { store } from "../frontend/redux/store";
import "../sass/style.scss";

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
            <SWRContext>
              <Component {...pageProps} />
            </SWRContext>
          </Layout>
        </MediaContext>
      </AblyContext>
    </Provider>
  );
}

export default MyApp;
