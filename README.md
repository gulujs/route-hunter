# @lunjs/route-hunter

## Installation

```
npm install @lunjs/route-hunter
```

## Usage

```js
import * as http from 'http';
import { RouteHunger } from '@lunjs/route-hunter';

const router = new RouteHunter();
router.on('GET', '/', (req, res, params) => {
  res.end('{"message": "Hello world!"}');
});

const server = http.createServer((req, res) => {
  router.lookup(req, res);
});

server.listen(3000, err => {
  if (err) {
    throw err;
  }
  console.log('Server listening on: http://localhost:3000');
});
```

## Inspired by

- [echo router](https://github.com/labstack/echo)
- [trek-router](https://github.com/trekjs/router)
- [find-my-way](https://github.com/delvedor/find-my-way)

## License

- [MIT](LICENSE)
