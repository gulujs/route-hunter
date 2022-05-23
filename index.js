import { PathnameStore } from '@gulujs/pathname-store';
import { decodeURIComponent } from '@gulujs/decode-uri-component';

export class RouteHunter {
  constructor(options = {}) {
    options = options || {};
    this.ignoreTrailingSlash = options.ignoreTrailingSlash || false;

    this.defaultRoute = null;
    if (options.defaultRoute) {
      if (typeof options.defaultRoute !== 'function') {
        throw new Error('The `options.defaultRoute` must be a function');
      }
      this.defaultRoute = options.defaultRoute;
    }

    this.onBadUrl = null;
    if (options.onBadUrl) {
      if (typeof options.onBadUrl !== 'function') {
        throw new Error('The `options.onBadUrl` must be a function');
      }
      this.onBadUrl = options.onBadUrl;
    }

    this.maxParamLength = options.maxParamLength || 100;

    this.ps = new PathnameStore({
      caseSensitive: options.caseSensitive,
      backtrack: options.backtrack,
      paramNamePattern: options.paramNamePattern,
      boxing
    });
  }

  on(method, path, handler, store) {
    const s = { method, handler, store };
    this.ps.add(path, s);

    const matchAllRE = new RegExp(`\\*(?:${this.ps.paramNamePattern})?$`);
    if (this.ignoreTrailingSlash && path !== '/' && !matchAllRE.test(path)) {
      if (path.endsWith('/')) {
        this.ps.add(path.slice(0, -1), s);
      } else {
        this.ps.add(`${path}/`, s);
      }
    }
  }

  lookup(req, res) {
    let url = req.url;
    const i = url.indexOf('?');
    if (i >= 0) {
      url = url.substring(0, i);
    }

    const handle = this.find(req.method, url);
    if (handle === null) {
      return this._execDefaultRouteHandler(req, res);
    }
    return handle.handler(req, res, handle.params, handle.store);
  }

  find(method, path) {
    const r = this.ps.find(path);
    if (!r.found || r.box[method] === undefined) {
      return null;
    }

    const { handler, pnames, store } = r.box[method];
    const params = {};

    for (let i = 0, l = pnames.length; i < l; i++) {
      if (r.pvalues[i].length > this.maxParamLength) {
        return this._createOnBadUrlHandle(r.pvalues[i]);
      }

      const decoded = decodeURIComponent(r.pvalues[i]);
      if (decoded === null) {
        return this._createOnBadUrlHandle(r.pvalues[i]);
      }

      params[pnames[i]] = decoded;
    }

    return {
      handler,
      params,
      store
    };
  }

  prettyPrint() {
    return this.ps.prettyPrint({
      label(node) {
        let name = node.prefix;
        if (node.box) {
          const methods = Object.keys(node.box);
          if (methods.length) {
            name += ` (${methods.join()})`;
          }
        }
        return name;
      }
    });
  }

  _execDefaultRouteHandler(req, res) {
    if (this.defaultRoute !== null) {
      return this.defaultRoute(req, res);
    } else {
      res.statusCode = 404;
      res.end();
    }
  }

  _createOnBadUrlHandle(pvalue) {
    if (this.onBadUrl === null) {
      return null;
    }

    return {
      handler: (req, res) => this.onBadUrl(req, res, pvalue),
      params: {},
      store: null
    };
  }
}

function boxing(box, store, pnames) {
  if (!box) {
    box = {};
  }

  box[store.method] = {
    pnames,
    handler: store.handler,
    store: store.store
  };

  return box;
}
