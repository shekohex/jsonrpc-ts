import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RpcClientOptions, RpcRequest, RpcResponse } from './interfaces';
import { RpcError } from './rpc-error';

type RpcBatchRequest<TMethod, TParams> = Array<RpcRequest<TMethod, TParams>>;
type RpcBatchResponse<TResponse, TError> = Array<RpcResponse<TResponse, TError>>;
export class RpcClient<TMethods = any> {
  private readonly client: AxiosInstance = Axios;

  constructor(private readonly options: RpcClientOptions) {}
  /**
   * Make JSON RPC Batch Request
   * @throws {AxiosError | RpcError} http/rpc error
   */
  public async makeBatchRequest<K extends keyof TMethods, TResponse = any, TError = any>(
    requests: RpcBatchRequest<K, TMethods[K]>,
  ): Promise<AxiosResponse<RpcBatchResponse<TResponse, TError>>> {
    const response = await this.client.post<RpcBatchResponse<TResponse, TError>>(
      this.options.url,
      requests,
      this.options,
    );
    // TODO: Handle Batch Request errors !
    // if (response.data.error) {
    //   throw new RpcError(response.data.error);
    // }
    return response;
  }

  /**
   * Make JSON RPC Request
   * @throws {AxiosError | RpcError} http/rpc error
   */
  public async makeRequest<K extends keyof TMethods, TResponse = any, TError = any>(
    request: RpcRequest<K, TMethods[K]>,
  ): Promise<AxiosResponse<RpcResponse<TResponse, TError>>> {
    const response = await this.client.post<RpcResponse<TResponse, TError>>(
      this.options.url,
      request,
      this.options,
    );
    if (response.data.error) {
      throw new RpcError(response.data.error);
    }
    return response;
  }
}
