'use client'

import { UserProvider, useUser } from '../context/UserContext';

import Login from './Login';
import EquitySelector from '../app/EquitySelector';


function InnerApp({ Component, pageProps }) {
  const { user } = useUser();

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <div>
        <EquitySelector />
      </div>
    </>
  );
}

export default function App(props) {
  return (
    <UserProvider>
      <InnerApp {...props} />
    </UserProvider>
  );
}
