import { RpcResponseError } from './rpc-response-error.interface';

/**
 * When a rpc call is made, the Server **MUST** reply with a Response
 * except for in the case of Notifications.
 * The Response is expressed as a single JSON Object
 */
export interface RpcResponse<TResult = any, TErrorData = any> {
  /**
   * A String specifying the version of the JSON-RPC protocol.
   * **MUST** be exactly "2.0".
   */
  jsonrpc: '2.0';

  /**
   * This member is **REQUIRED** on success.
   * This member **MUST NOT** exist if there was an error invoking the method.
   * The value of this member is determined by the method invoked on the Server.
   */
  result?: TResult;

  /**
   * This member is REQUIRED on error.
   * This member MUST NOT exist if there was no error triggered during invocation.
   * The value for this member MUST be an Object of Type `RpcResponseError`.
   */
  error?: RpcResponseError<TErrorData>;

  /**
   * An identifier established by the Client that **MUST** contain a `String`, `Number`,
   * or `NULL` value if included.
   * It **MUST** be the same as the value of the id member in the Request Object.
   * If there was an error
   * in detecting the `id` in the Request object (e.g. `Parse error`/`Invalid Request`)
   * it **MUST** be `Null`.
   */
  id: string | number | null;
}
