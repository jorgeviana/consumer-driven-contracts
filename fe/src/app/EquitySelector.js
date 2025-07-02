'use client'

import { useEffect, useState } from 'react';
import EquityChart from '../app/EquityChart';
import SentimentPanel from '../app/SentimentPanel';
import Logout from '../pages/Logout';

export default function EquitySelector({ fetchDataAction, port, exchangeCode, equityCode }) {

  const [exchange, setExchange] = useState("");
  const [equity, setEquity] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(exchange + "." + equity);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={exchange} onChange={(e) => setExchange(e.target.value)} />
        <input type="text" value={equity} onChange={(e) => setEquity(e.target.value)} />
        <button className="px-4 py-2 rounded border cursor-pointer" type="submit">Submit</button>
      </form>

      {submitted !== null && (<>
        <EquityChart exchangeCode={submitted.split(".")[0]} equityCode={submitted.split(".")[1]} />
        <div className="space-y-6">
          <SentimentPanel exchangeCode={submitted.split(".")[0]} equityCode={submitted.split(".")[1]} />
        </div>
      </>)}

      <div><Logout /></div>
    </>
  );
}
