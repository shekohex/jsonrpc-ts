import * as RpcServer from 'http-jsonrpc-server';
import { RpcClientOptions } from '../src/interfaces';
import { RpcClient } from '../src/rpc-client';

describe('RpcClient', async () => {
  // A scheme describe our rpc.
  interface MyRpcMethods {
    // sum is a rpc method that accepts 2 args both of type number.
    sum: [number, number];
  }
  let rpcClient: RpcClient<MyRpcMethods>;
  let rpcServer: any;
  beforeAll(async () => {
    const sum = ([x, y]: Array<number>) => x + y;
    rpcServer = new RpcServer({
      methods: {
        sum,
      },
    });
    await rpcServer.listen(9090, 'localhost');
  });

  beforeEach(async () => {
    const opts: RpcClientOptions = {
      url: 'http://localhost:9090/',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
    };
    rpcClient = new RpcClient<MyRpcMethods>(opts);
  });

  afterAll(async () => {
    // Close the server.
    await rpcServer.close();
  });

  it('should make request', async () => {
    const res = await rpcClient.makeRequest<number>('sum', [3, 2], 123);
    expect(res.data.result).toEqual(5);
  });
});
