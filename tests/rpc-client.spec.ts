import * as RpcServer from 'http-jsonrpc-server';
import { RpcClientOptions, RpcResponse } from '../src/interfaces';
import { RpcClient } from '../src/rpc-client';
import { RpcError } from '../src/rpc-error';
import { RpcErrorCode } from '../src/rpc-error-codes.enum';

describe('RpcClient', async () => {
  // A scheme describe our rpc.
  interface MyRpcMethods {
    // sum is a rpc method that accepts 2 args both of type number.
    sum: [number, number];
    sumNamedParams: { x: number; y: number };
    noMethod: unknown;
    invalidParms: string;
    serverError: undefined;
  }
  let rpcClient: RpcClient<MyRpcMethods>;
  let rpcServer: any;

  beforeAll(async () => {
    const sum = ([x, y]: [number, number]) => x + y;
    const sumNamedParams = ({ x, y }: { x: number; y: number }) => x + y;
    const invalidParms = s => s.length;
    const serverError = () => {
      throw new Error('Server Error');
    };

    rpcServer = new RpcServer({ methods: { sum, sumNamedParams, invalidParms, serverError } });
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
    const {
      data: { result },
    } = await rpcClient.makeRequest({
      method: 'sum',
      params: [3, 2],
      id: 123,
      jsonrpc: '2.0',
    });
    expect(result).toEqual(5);
  });

  it('should make request with named params', async () => {
    const {
      data: { result },
    } = await rpcClient.makeRequest({
      method: 'sumNamedParams',
      params: { x: 1, y: 4 },
      id: 123,
      jsonrpc: '2.0',
    });
    expect(result).toEqual(5);
  });

  it('should make request', async () => {
    const {
      data: { result },
    } = await rpcClient.makeRequest({
      method: 'sum',
      params: [3, 2],
      id: 123,
      jsonrpc: '2.0',
    });
    expect(result).toEqual(5);
  });

  it('should throw error `method not found`', async () => {
    const call = rpcClient.makeRequest({ method: 'noMethod', id: 1, jsonrpc: '2.0' });
    await expect(call).rejects.toThrow();
    await expect(call).rejects.toBeInstanceOf(RpcError);
    await expect(call).rejects.toHaveProperty('err', { code: RpcErrorCode.METHOD_NOT_FOUND });
  });

  // I'm not sure of this test, althogth it passes !
  it('should throw error `invalid params`', async () => {
    const call = rpcClient.makeRequest({
      method: 'invalidParms',
      params: 1 as any,
      id: 12,
      jsonrpc: '2.0',
    });
    await expect(call).rejects.toThrow();
    await expect(call).rejects.toBeInstanceOf(RpcError);
    await expect(call).rejects.toHaveProperty('err', { code: RpcErrorCode.INVALID_PARAMS });
  });

  it('should throw error `server error` with message', async () => {
    const call = rpcClient.makeRequest({
      method: 'serverError',
      id: 1232,
      jsonrpc: '2.0',
    });
    await expect(call).rejects.toThrow();
    await expect(call).rejects.toBeInstanceOf(RpcError);
    await expect(call).rejects.toHaveProperty('err', {
      code: RpcErrorCode.SERVER_ERROR,
      message: 'Server Error',
    });
    try {
      await call;
    } catch (error) {
      expect(error.getCode()).toEqual(RpcErrorCode.SERVER_ERROR);
    }
  });

  it('should make batch requests', async () => {
    const { data } = await rpcClient.makeBatchRequest([
      {
        method: 'sum',
        params: [3, 1],
        id: 123,
        jsonrpc: '2.0',
      },
      {
        method: 'sum',
        params: [3, 2],
        id: 124,
        jsonrpc: '2.0',
      },
    ]);
    const [res1, res2] = data;
    expect(res1.result).toEqual(4);
    expect(res2.result).toEqual(5);
  });
});
