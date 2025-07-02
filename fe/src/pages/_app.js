'use client'

import { UserProvider, useUser } from '../context/UserContext';

import Login from './Login';

import EquityChart from '../app/EquityChart';
import EquitySelector from '../app/EquitySelector';
import SentimentPanel from '../app/SentimentPanel';
import Logout from './Logout';


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
      {/* <div className="space-y-6">
        <SentimentPanel />
      </div>
      <div><Logout /></div> */}
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
