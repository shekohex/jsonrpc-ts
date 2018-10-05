import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RpcClientOptions, RpcRequest, RpcResponse } from './interfaces';
import { RpcError } from './rpc-error';

type RpcBatchRequest<TMethod, TParams> = Array<RpcRequest<TMethod, TParams>>;

export class RpcClient<TMethods = any> {
  private readonly client: AxiosInstance = Axios;

  constructor(private readonly options: RpcClientOptions) {}
  /**
   * Macke JSON RPC Request
   * @param method the method to be called
   * @param params the method params
   * @param id and optinal json rpc request id
   * @throws {AxiosError | RpcError} http/rpc error
   */
  public async makeRequest<TResponse, TError, K extends keyof TMethods = any>(
    request: RpcRequest<K, TMethods[K]> | RpcBatchRequest<K, TMethods[K]>,
  ): Promise<AxiosResponse<RpcResponse<TResponse, TError>>> {
    try {
      const response = await this.client.post<RpcResponse<TResponse, TError>>(
        this.options.url,
        request,
        this.options,
      );

      if (response.data.error) {
        throw new RpcError(response.data.error);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
