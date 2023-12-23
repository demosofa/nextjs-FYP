import { AblyContext, MediaContext, SWRContext } from '@contexts';
import Layout from '@layouts';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { store } from '@redux/store';

import { ErrorBoundary } from '../frontend/components';
import '../sass/style.scss';

function MyApp({ Component, pageProps, ...appProps }) {
	return (
		<ErrorBoundary>
			<Provider store={store}>
				<AblyContext>
					<MediaContext>
						<Layout routerPath={appProps.router.pathname}>
							<Head>
								<meta
									name='viewport'
									content='initial-scale=1.0, width=device-width'
								/>
							</Head>
							<SWRContext>
								<Component {...pageProps} />
							</SWRContext>
						</Layout>
					</MediaContext>
				</AblyContext>
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;
