import 'whatwg-fetch';

export default async function equityData(port: number, exchange: string, equity: string): Promise<AxisData[]> {
    const isFake = process.env.NEXT_PUBLIC_USE_FAKE_DATA === 'true';
    if (isFake) {
        return fetchAndTransform(port, exchange, equity, fakeServerData);
    }
    else {
        return await fetchAndTransform(port, exchange, equity);
    }
}


async function fetchAndTransform(port: number, exchange: string, equity: string, fake?: () => Promise<DataPoint[]>): Promise<AxisData[]> {
  const dataPoints: DataPoint[] = fake ? await fake() : await data(port, exchange, equity);
  return dataPoints.map(p => transform(p));
}

async function data(port: number, exchange: string, equity: string): Promise<DataPoint[]> {
  const response: Response = await fetch(`http://localhost:${port}/api/equity/${exchange}/${equity}`);
  if (!response.ok) {
    throw new Error('not ok status code in response: ' + response.status);
  }
  const dataPoints: Promise<DataPoint[]> = response.json();
  return dataPoints;
}

type AxisData = {
  x: Date,
  y: number[],
}

function transform({date, price}: DataPoint): AxisData {
    return {
        x: new Date(date),
        y: [price.open, price.high, price.low, price.close]
    };
}

type Price = {
  open: number,
  high: number,
  low: number,
  close: number,
}

type DataPoint = {
  date: string,
  price: Price,
}

function delay(ms: number): Promise<NodeJS.Timeout> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fakeServerData(): Promise<DataPoint[]> {
  await delay(900);
  return [
    {
      "date": "2025, 6, 10",
      "price": {
        "open": 386.4,
        "high": 387.299,
        "low": 382.9,
        "close": 385.5
      }
    },
    {
      "date": "2025, 6, 9",
      "price": {
        "open": 391.9,
        "high": 392.1,
        "low": 383.25,
        "close": 384.6
      }
    },
    {
      "date": "2025, 6, 6",
      "price": {
        "open": 387.8,
        "high": 392.4,
        "low": 385.9,
        "close": 390.6
      }
    },
    {
      "date": "2025, 6, 5",
      "price": {
        "open": 388.5,
        "high": 389.7,
        "low": 385.0,
        "close": 387.3
      }
    },
    {
      "date": "2025, 6, 4",
      "price": {
        "open": 390.5,
        "high": 391.7,
        "low": 387.698,
        "close": 388.6
      }
    },
    {
      "date": "2025, 6, 3",
      "price": {
        "open": 397.9,
        "high": 398.3,
        "low": 390.0,
        "close": 390.0
      }
    },
    {
      "date": "2025, 6, 2",
      "price": {
        "open": 388.4,
        "high": 391.8,
        "low": 387.4,
        "close": 390.6
      }
    },
    {
      "date": "2025, 5, 30",
      "price": {
        "open": 384.7,
        "high": 391.2,
        "low": 383.7,
        "close": 388.0
      }
    },
    {
      "date": "2025, 5, 29",
      "price": {
        "open": 385.6,
        "high": 385.9,
        "low": 376.9,
        "close": 382.5
      }
    },
    {
      "date": "2025, 5, 28",
      "price": {
        "open": 388.0,
        "high": 389.7,
        "low": 385.4,
        "close": 385.4
      }
    },
    {
      "date": "2025, 5, 27",
      "price": {
        "open": 382.6,
        "high": 387.549,
        "low": 381.6,
        "close": 386.8
      }
    },
    {
      "date": "2025, 5, 23",
      "price": {
        "open": 381.1,
        "high": 384.8,
        "low": 379.9,
        "close": 381.7
      }
    },
    {
      "date": "2025, 5, 22",
      "price": {
        "open": 379.2,
        "high": 383.4,
        "low": 378.4,
        "close": 381.5
      }
    },
    {
      "date": "2025, 5, 21",
      "price": {
        "open": 377.2,
        "high": 380.6,
        "low": 376.0982,
        "close": 380.6
      }
    },
    {
      "date": "2025, 5, 20",
      "price": {
        "open": 372.5,
        "high": 378.8,
        "low": 370.1,
        "close": 377.9
      }
    },
    {
      "date": "2025, 5, 19",
      "price": {
        "open": 365.3,
        "high": 371.1,
        "low": 365.0978,
        "close": 371.1
      }
    },
    {
      "date": "2025, 5, 16",
      "price": {
        "open": 366.1,
        "high": 369.6,
        "low": 362.9,
        "close": 362.9
      }
    },
    {
      "date": "2025, 5, 15",
      "price": {
        "open": 360.0,
        "high": 364.6,
        "low": 357.56,
        "close": 363.7
      }
    },
    {
      "date": "2025, 5, 14",
      "price": {
        "open": 364.2,
        "high": 370.2,
        "low": 362.6,
        "close": 368.1
      }
    },
    {
      "date": "2025, 5, 13",
      "price": {
        "open": 367.3,
        "high": 370.9,
        "low": 365.7,
        "close": 366.5
      }
    },
    {
      "date": "2025, 5, 12",
      "price": {
        "open": 379.0,
        "high": 379.9,
        "low": 366.1,
        "close": 368.7
      }
    },
    {
      "date": "2025, 5, 9",
      "price": {
        "open": 379.1,
        "high": 380.1,
        "low": 375.298,
        "close": 377.7
      }
    },
    {
      "date": "2025, 5, 8",
      "price": {
        "open": 380.6,
        "high": 382.8,
        "low": 375.8,
        "close": 377.2
      }
    },
    {
      "date": "2025, 5, 7",
      "price": {
        "open": 377.5,
        "high": 379.2,
        "low": 374.6,
        "close": 379.2
      }
    },
    {
      "date": "2025, 5, 6",
      "price": {
        "open": 374.2,
        "high": 380.1,
        "low": 373.8,
        "close": 376.8
      }
    },
    {
      "date": "2025, 5, 2",
      "price": {
        "open": 372.8,
        "high": 377.5,
        "low": 371.0,
        "close": 371.0
      }
    },
    {
      "date": "2025, 5, 1",
      "price": {
        "open": 371.9,
        "high": 373.1,
        "low": 368.5,
        "close": 372.5
      }
    },
    {
      "date": "2025, 4, 30",
      "price": {
        "open": 366.1,
        "high": 371.6,
        "low": 365.5,
        "close": 370.7
      }
    },
    {
      "date": "2025, 4, 29",
      "price": {
        "open": 358.3,
        "high": 366.0,
        "low": 356.4,
        "close": 364.9
      }
    },
    {
      "date": "2025, 4, 28",
      "price": {
        "open": 359.5,
        "high": 360.6,
        "low": 355.7,
        "close": 357.3
      }
    },
    {
      "date": "2025, 4, 25",
      "price": {
        "open": 358.3,
        "high": 364.1,
        "low": 357.9,
        "close": 357.9
      }
    },
    {
      "date": "2025, 4, 24",
      "price": {
        "open": 360.9,
        "high": 363.5,
        "low": 358.4,
        "close": 360.3
      }
    },
    {
      "date": "2025, 4, 23",
      "price": {
        "open": 357.6,
        "high": 359.8,
        "low": 353.2,
        "close": 357.7
      }
    },
    {
      "date": "2025, 4, 22",
      "price": {
        "open": 356.6,
        "high": 365.0,
        "low": 356.5,
        "close": 359.9
      }
    },
    {
      "date": "2025, 4, 17",
      "price": {
        "open": 343.6,
        "high": 355.3,
        "low": 343.6,
        "close": 354.6
      }
    },
    {
      "date": "2025, 4, 16",
      "price": {
        "open": 346.0,
        "high": 350.05,
        "low": 344.9,
        "close": 345.6
      }
    },
    {
      "date": "2025, 4, 15",
      "price": {
        "open": 337.8,
        "high": 345.9,
        "low": 337.225,
        "close": 345.5
      }
    },
    {
      "date": "2025, 4, 14",
      "price": {
        "open": 332.0,
        "high": 337.7,
        "low": 330.0,
        "close": 336.4
      }
    },
    {
      "date": "2025, 4, 11",
      "price": {
        "open": 317.4,
        "high": 328.1,
        "low": 314.9,
        "close": 327.7
      }
    },
    {
      "date": "2025, 4, 10",
      "price": {
        "open": 320.0,
        "high": 326.504,
        "low": 310.3,
        "close": 314.6
      }
    },
    {
      "date": "2025, 4, 9",
      "price": {
        "open": 334.9,
        "high": 336.837,
        "low": 328.7,
        "close": 335.2
      }
    }
  ];
}
