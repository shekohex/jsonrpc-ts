import { RpcErrorCode } from '../rpc-error-codes.enum';

/**
 * When a rpc call encounters an error,
 * the Response Object MUST contain the error member with a value that is that object
 */
export interface RpcResponseError<TErrorData = any> {
  /**
   * A Number that indicates the error type that occurred.
   */
  code: number | RpcErrorCode;
  /**
   * A String providing a short description of the error.
   */
  message: string;
  /**
   * A Primitive or Structured value that contains additional information about the error.
   * The value of this member is defined by the Server
   * (e.g. detailed error information, nested errors etc.).
   */
  data?: TErrorData;
}
