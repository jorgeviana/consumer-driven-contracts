import {Pact} from '@pact-foundation/pact';
import path from 'path';
import 'whatwg-fetch';

const provider = new Pact({
    consumer: 'frontend-app',
    provider: 'spring-api',
    port: 0,
    log: path.resolve('..', 'logs', 'pact.log'),
    dir: path.resolve('..','pacts'),
    logLevel: 'INFO',
});

describe('Pact test', () => {

    let port;

    beforeAll(async () => {
        port = (await provider.setup()).port
    });
    afterAll(() => provider.finalize());

    it('returns a user', async () => {
        await provider.addInteraction({
            state: 'user exists',
            uponReceiving: 'a request for user 1',
            withRequest: {
                method: 'GET',
                path: '/api/users/1',
            },
            willRespondWith: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: { id: 1, name: 'Alice' },
            },
        });

        const res = await fetch(`http://localhost:${port}/api/users/1`);
        const json = await res.json();

        expect(json).toEqual({ id: 1, name: 'Alice' });

        await provider.verify();
    });
});
