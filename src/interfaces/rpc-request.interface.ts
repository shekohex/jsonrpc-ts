/**
 * A rpc call is represented by sending a Request object to a Server.
 */
export interface RpcRequest<TMethod, TParam = any> {
  /**
   * A String specifying the version of the JSON-RPC protocol. **MUST** be exactly "2.0".
   */
  jsonrpc: '2.0';

  /**
   * A String containing the name of the method to be invoked.
   */
  method: TMethod;

  /**
   * A Structured value that holds the parameter values
   * to be used during the invocation of the method.
   */
  params?: TParam | Array<TParam>;

  /**
   * An identifier established by the Client that **MUST** contain a `String`, `Number`,
   * or `NULL` value if included.
   * If it is not included it is assumed to be a notification.
   * The value **SHOULD** normally not be Null and Numbers **SHOULD NOT** contain fractional parts
   */
  id?: string | number | null;
}
