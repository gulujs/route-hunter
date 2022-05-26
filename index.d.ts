import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export type Req = IncomingMessage | Http2ServerRequest;
export type Res = ServerResponse | Http2ServerResponse;

export type DefaultRouteHandler<TRequest, TResponse> = (req: TRequest, res: TResponse) => any;
export interface RouteHunterOptions<TRequest, TResponse> {
  /**
   * Default is `false`
   */
  ignoreTrailingSlash?: boolean;
  defaultRoute?: DefaultRouteHandler<TRequest, TResponse>;
  onBadUrl?: DefaultRouteHandler<TRequest, TResponse>;
  /**
   * Default is `true`
   */
  caseSensitive?: boolean;
  /**
   * Default is 100
   */
  maxParamLength?: number;
  /**
   * Default is `false`
   */
  backtrack?: boolean;
  /**
   * Default is `'[a-zA-Z_]\\w*'`
   */
  paramNamePattern?: string;
}

export type RouteParams = Record<string, string>;
export type RouteHandler<TRequest, TResponse> = (req: TRequest, res: TResponse, params: RouteParams, store: any) => any;
export interface FindResult<T, TRequest, TResponse> {
  handler: RouteHandler<TRequest, TResponse>;
  params: RouteParams;
  store: T;
}
export declare class RouteHunter<TRequest = Req, TResponse = Res> {
  ignoreTrailingSlash: boolean;
  maxParamLength: number;
  caseSensitive: boolean;
  defaultRoute: DefaultRouteHandler<TRequest, TResponse> | null;
  onBadUrl: DefaultRouteHandler<TRequest, TResponse> | null;

  constructor(options?: RouteHunterOptions<TRequest, TResponse>);
  on(method: string, path: string, handler: RouteHandler<TRequest, TResponse>, store: any): void;
  lookup<T = unknown>(req: TRequest, res: TResponse): T;
  find<T = unknown>(method: string, path: string): FindResult<T, TRequest, TResponse> | null;
  reset(): void;
  prettyPrint(): string;
}
