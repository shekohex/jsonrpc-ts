# JSONRPC Typescript

[![Build Status](https://travis-ci.org/shekohex/jsonrpc-ts.svg?branch=master)](https://travis-ci.org/shekohex/jsonrpc-ts) [![Greenkeeper badge](https://badges.greenkeeper.io/shekohex/jsonrpc-ts.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/shekohex/jsonrpc-ts/badge.svg?branch=master)](https://coveralls.io/github/shekohex/jsonrpc-ts?branch=master)
[![npm version](https://badge.fury.io/js/jsonrpc-ts.svg)](https://badge.fury.io/js/jsonrpc-ts)

Strongly 💪 Typed JSON RPC 2.0 Client for Nodejs

Fully tested to comply with the [official JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

## Quick Overview

By Declaring events using a simple interface mapping methods names to their parameters to get Strongly Typed, Fast and Modern Rpc client for your service.

## Install

```
npm i jsonrpc-ts
```

## Usage

First you need to define your Methods, that could be achieved by creating an interface of methods name and there parameters.

```ts
// we have a service that can do math,
// and it has this methods
interface MathService {
  // a method called sum that accepts 2 args of type number
  sum: [number, number];
  // methods can have named paramerter too.
  sub: { left: number; right: number };
  // or if you need return type, you can have that too :)
  sumWithReturnType: ({ x, y }: { x: number; y: number }) => number;
}
```

then import `RpcClient` and start making requests

```ts
import { RpcClient } from 'jsonrpc-ts';

const rpcClient = new RpcClient<MathService>({ url: '...' });
// now you have a strongly typed methods.
// try to change [3, 2] to ['3', '2'] and the typescript compiler will catch you !
const response = await rpcClient.makeRequest({
  method: 'sum',
  params: [3, 2],
  id: 1,
  jsonrpc: '2.0',
});
// response.data.result === 5

// response2.data.result has type of number :)
const response2 = await rpcClient.makeRequest({
  method: 'sumWithReturnType',
  params: { x: 3, y: 2 },
  id: 2,
  jsonrpc: '2.0',
});
// response2.data.result === 5
```
