import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import EquityChart from '../app/EquityChart'

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

describe('Equity component', () => {

    it('renders loading', async () => {
        render(<EquityChart/>);

        const chart = await screen.findByText(/loading/i);
        expect(chart).toBeInTheDocument();
    });

    it('renders chart', async () => {
        render(<EquityChart/>);

        const chart = await screen.findByText(/equity price data/i);
        expect(chart).toBeInTheDocument();
    });

    it('renders error', async () => {
        const failingFetcher = () => Promise.reject(new Error('Fetch failed'));

        render(<EquityChart fetchDataAction={failingFetcher} />);

        const chart = await screen.findByText(/error loading data from server/i);
        expect(chart).toBeInTheDocument();
    })
})