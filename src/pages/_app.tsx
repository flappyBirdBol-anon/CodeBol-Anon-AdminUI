import { AuthProvider } from '../app/components/AuthContext';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <Component {...pageProps} key={router.asPath} />
    </AuthProvider>
  );
}

export default MyApp;
