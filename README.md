# socket-events

[![Build Status](https://travis-ci.com/revilossor/socket-events.svg?token=VGfXzqDyZHifHh4zux4p&branch=master)](https://travis-ci.com/revilossor/socket-events.svg?token=VGfXzqDyZHifHh4zux4p&branch=master)

use the correct version of node:

```bash
nvm use
```
## Running it

you'll need docker, and docker compose.

```bash
npm start
npm stop
```

**installing dependencies**

```bash
npm i
```

**creating a package**

```bash
npx lerna create <package_name>
```

**tailing logs for a service**

```bash
npm run logs -- <service name, eg server>
```

**publishing**

```bash
NPM_CONFIG_OTP=123456 npx lerna publish
```


## Integration tests

youll need docker-compose up before running these
