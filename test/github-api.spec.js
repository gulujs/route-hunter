import { expect } from 'chai';
import { RouteHunter } from '../index.js';
import * as helper from './helper.js';

describe('GitHub Api', () => {
  it('Find all apis', () => {
    const apis = helper.getGithubApis();

    const rh = new RouteHunter();
    for (const api of apis) {
      rh.on(api.method, api.handlerPath, api.handler, { handlerPath: api.handlerPath });
    }

    for (const api of apis) {
      const handle = rh.find(api.method, api.reqPath);
      expect(handle).to.be.ok;
      expect(handle.store).to.deep.equal({ handlerPath: api.handlerPath });
      for (const pname of api.pnames) {
        expect(handle.params[pname]).to.equal(helper.githubApiParamFiller[pname]);
      }
    }
  });
});
