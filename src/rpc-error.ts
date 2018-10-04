import { RpcResponseError } from './interfaces';
import { RpcErrorCode } from './rpc-error-codes.enum';

export class RpcError<TError = any> extends Error {
  constructor(private readonly err: RpcResponseError<TError>) {
      super();
      super.message = err.message;
  }

  public getCode(): RpcErrorCode | number {
      return this.err.code;
  }
}
