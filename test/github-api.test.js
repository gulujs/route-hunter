const { RouteHunter } = require('..');
const helper = require('./helper');

describe('GitHub Api', () => {
  it('Find all apis', () => {
    const apis = helper.getGithubApis();

    const rh = new RouteHunter();
    for (const api of apis) {
      rh.on(api.method, api.handlerPath, api.handler, { handlerPath: api.handlerPath });
    }

    for (const api of apis) {
      const handle = rh.find(api.method, api.reqPath);
      expect(handle).toBeTruthy();
      expect(handle.store).toEqual({ handlerPath: api.handlerPath });
      for (const pname of api.pnames) {
        expect(handle.params[pname]).toBe(helper.githubApiParamFiller[pname]);
      }
    }
  });
});