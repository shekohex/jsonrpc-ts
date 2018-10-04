import { AxiosRequestConfig } from 'axios';

export interface RpcClientOptions extends AxiosRequestConfig {
  /**
   * `url` is the server URL that will be used for the request
   */
  url: string;
  /**
   * `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
   * This will set an `Authorization` header, overwriting any existing
   * `Authorization` custom headers you have set using `headers`.
   */
  auth?: {
    username: string;
    password: string;
  };
  /**
   * Extend the headers sent by the client
   */
  headers?: any;
  /**
   * `timeout` specifies the number of milliseconds before the request times out,
   * Automatically causes the request to abort
   */
  timeout?: number;
  /**
   * `responseEncoding` indicates encoding to use for decoding responses.
   */
  responseEncoding?: string | 'utf8';
}
