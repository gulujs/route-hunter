const assert = require('assert');
const helper = require('./test/helper');
const { RouteHunter } = require('./');
const FindMyWay = require('find-my-way');

const apis = helper.getGithubApis();

const rh = new RouteHunter();
for (const api of apis) {
  rh.on(api.method, api.handlerPath, api.handler);
}

const fmw = new FindMyWay();
for (const api of apis) {
  fmw.on(api.method, api.handlerPath, api.handler);
}

const LOOP_COUNT = 1000;

console.time('route-hunter');
for (let i = 0; i < LOOP_COUNT; i++) {
  for (const api of apis) {
    const handle = rh.find(api.method, api.reqPath);
    assert.ok(handle);
  }
}
console.timeEnd('route-hunter');

console.time('find-my-way');
for (let i = 0; i < LOOP_COUNT; i++) {
  for (const api of apis) {
    const handle = fmw.find(api.method, api.reqPath);
    assert.ok(handle);
  }
}
console.timeEnd('find-my-way');
