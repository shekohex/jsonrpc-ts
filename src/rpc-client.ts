import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RpcClientOptions, RpcRequest, RpcResponse } from './interfaces';
import { RpcError } from './rpc-error';

type RpcBatchRequest<TMethod, TParams> = Array<RpcRequest<TMethod, TParams>>;
type RpcBatchResponse<TResponse, TError> = Array<RpcResponse<TResponse, TError>>;
type ReturnTypeOfMethod<T> = T extends (...args: Array<any>) => any ? ReturnType<T> : any;
type ReturnTypeOfMethodIfExists<T, S> = S extends keyof T ? ReturnTypeOfMethod<T[S]> : any;
type MethodParams<T> = T extends (...args: infer P) => any ? P[0] : T;
type MethodParamsIfExists<T, S> = S extends keyof T ? MethodParams<T[S]> : S;
export class RpcClient<TMethods = any> {
  private readonly client: AxiosInstance = Axios;

  constructor(private readonly options: RpcClientOptions) {}
  /**
   * Make JSON RPC Batch Request of the same method
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
  public async makeRequest<K extends keyof TMethods, TError = any>(
    request: RpcRequest<K, MethodParamsIfExists<TMethods, K>>,
  ): Promise<AxiosResponse<RpcResponse<ReturnTypeOfMethodIfExists<TMethods, K>, TError>>> {
    const response = await this.client.post<
      RpcResponse<ReturnTypeOfMethodIfExists<TMethods, K>, TError>
    >(this.options.url, request, this.options);
    if (response.data.error) {
      throw new RpcError(response.data.error);
    }
    return response;
  }
}
