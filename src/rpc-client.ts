import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RpcClientOptions, RpcRequest, RpcResponse } from './interfaces';

export class RpcClient<TMethods = any> {
  private readonly client: AxiosInstance = Axios;
  constructor(private readonly options: RpcClientOptions) {}
  /**
   * Macke JSON RPC Request
   * @param method the method to be called
   * @param params the method params
   * @param id and optinal json rpc request id
   */
  public async makeRequest<TResponse = any, TError = any>(
    method: keyof TMethods,
    params: TMethods[keyof TMethods],
    id: string | number | null = null,
  ): Promise<AxiosResponse<RpcResponse<TResponse, TError>>> {
    const request: RpcRequest<keyof TMethods, TMethods[keyof TMethods]> = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };
    const response = await this.client.post<RpcResponse<TResponse, TError>>(
      this.options.url,
      request,
      this.options,
    );
    // TODO: Handle RPC Errors
    return response;
  }
}
