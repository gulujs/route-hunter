import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export type Req = IncomingMessage | Http2ServerRequest;
export type Res = ServerResponse | Http2ServerResponse;

export interface RouteHunterOptions {
    /**
     * Default is `false`
     */
    ignoreTrailingSlash: boolean;
    defaultRoute: (req: Req, res: Res) => any;
    onBadUrl: (req: Req, res: Res) => any;
    /**
     * Default is `true`
     */
    caseSensitive: boolean;
    /**
     * Default is 100
     */
    maxParamLength: number;
    /**
     * Default is `false`
     */
    backtrack: boolean;
    /**
     * Default is `'[a-zA-Z_]\\w*'`
     */
    paramNamePattern: string;
}

export type RouteParams = { [key: string]: string };
export type RouteHandler = (req: Req, res: Res, params: RouteParams, store: any) => any;
export interface FindResult {
    handler: RouteHandler;
    params: RouteParams;
    store: any;
}

export class RouteHunter {
    constructor(options?: RouteHunterOptions);
    on(method: string, path: string, handler: RouteHandler, store: any): void;
    lookup(req: Req, res: Res): any;
    find(method: string, path: string): FindResult | null;
    prettyPrint(): string;
}
