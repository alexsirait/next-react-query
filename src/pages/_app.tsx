import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Hydrate } from 'react-query/hydration';
const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<div className="container p-4">
					<h1 className="fw-bold mb-3">NextJS-Query</h1>
					<Component {...pageProps} />
				</div>
			</Hydrate>
		</QueryClientProvider>
	);
}
