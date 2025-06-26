import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import EquityChart from '../app/EquityChart'

import {Pact} from '@pact-foundation/pact';
import path from 'path';

// region for tests to run with apexcharts
global.ResizeObserver = class {
    observe() {
    }

    unobserve() {
    }

    disconnect() {
    }
};

// getBBox mock
if (!SVGElement.prototype.getBBox) {
    SVGElement.prototype.getBBox = () => ({
        width: 100,
        height: 20,
        x: 0,
        y: 0,
    });
}
// endregion


const provider = new Pact({
    consumer: 'frontend-app',
    provider: 'spring-api',
    port: 0,
    log: path.resolve('..', 'logs', 'pact.log'),
    dir: path.resolve('..','pacts'),
    logLevel: 'INFO',
});

describe('Equity component', () => {

    let port;

    beforeAll(async () => {
        port = (await provider.setup()).port

        
    });
    afterAll(async() => {
      provider.finalize();
    });

    it('renders loading', async () => {
        render(<EquityChart/>);

        const chart = await screen.findByText(/loading/i);
        expect(chart).toBeInTheDocument();
    });

    it('renders chart', async () => {
      await provider.addInteraction({
        state: 'equity exists',
        uponReceiving: 'a request for LON.TSCO',
        withRequest: {
          method: 'GET',
          path: '/api/equity/LON/TSCO',
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [
            {
              date: "2023, 11, 1",
              price: { open: 51.98, high: 56.30, low: 51.59, close: 53.84 }
            },
            {
              date: "2023, 11, 2",
              price: { open: 53.66, high: 54.99, low: 51.35, close: 52.95 },
            },
            {
              date: "2023, 11, 3",
              price: { open: 52.76, high: 57.35, low: 52.15, close: 55.42 },
            },
            {
              date: "2023, 11, 4",
              price: { open: 55.27, high: 59.1, low: 53.91, close: 56.97 },
            },
          ],
        },
      });

        render(<EquityChart port={port}/>);

        const chart = await screen.findByText(/equity price data/i);
        expect(chart).toBeInTheDocument();
        await provider.verify();
    });

    it('renders error', async () => {
        const failingFetcher = () => Promise.reject(new Error('Fetch failed'));

        render(<EquityChart fetchDataAction={failingFetcher} />);

        const chart = await screen.findByText(/error loading data from server/i);
        expect(chart).toBeInTheDocument();
    });

    it('equity not found', async () => {
        await provider.addInteraction({
        state: 'equity does not exist',
        uponReceiving: 'a request for not found',
        withRequest: {
          method: 'GET',
          path: '/api/equity/NOT/FOUND',
        },
        willRespondWith: {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: "not existing equity NOT.FOUND"
          },
        },
      });

        render(<EquityChart exchangeCode={"NOT"} equityCode={"FOUND"} port={port} />);

        const chart = await screen.findByText(/error loading data from server/i);
        expect(chart).toBeInTheDocument();
        await provider.verify();
    });
})