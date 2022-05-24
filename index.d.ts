import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export type Req = IncomingMessage | Http2ServerRequest;
export type Res = ServerResponse | Http2ServerResponse;

export type DefaultRouteHandler<TRequest, TResponse> = (req: TRequest, res: TResponse) => unknown;
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
export type RouteHandler<TRequest, TResponse> = (req: TRequest, res: TResponse, params: RouteParams, store: unknown) => unknown;
export interface FindResult<TRequest, TResponse> {
  handler: RouteHandler<TRequest, TResponse>;
  params: RouteParams;
  store: unknown;
}
export declare class RouteHunter<TRequest = Req, TResponse = Res> {
  ignoreTrailingSlash: boolean;
  maxParamLength: number;
  defaultRoute: DefaultRouteHandler<TRequest, TResponse> | null;
  onBadUrl: DefaultRouteHandler<TRequest, TResponse> | null;

  constructor(options?: RouteHunterOptions<TRequest, TResponse>);
  on(method: string, path: string, handler: RouteHandler<TRequest, TResponse>, store: unknown): void;
  lookup<T = unknown>(req: TRequest, res: TResponse): T;
  find(method: string, path: string): FindResult<TRequest, TResponse> | null;
  prettyPrint(): string;
}
