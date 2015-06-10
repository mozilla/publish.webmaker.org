# publish.teach.org
The teach.org publishing service for X-Ray Goggles and Thimble

## Installation and Use

1) Clone the [publish.webmaker.org](https://github.com/mozilla/publish.webmaker.org) repository

```
$ git clone https://github.com/mozilla/publish.webmaker.org.git
```

2) Install the dependencies

```
$ npm install
```

If you also want to run the tests, install the **lab** testing utility globally

```
$ npm install -g lab
```

3) Copy the distributed environment file via command line, or manually using a code editor:

```
$ npm run env

OR, if you are on Windows

$ COPY env.dist .env
```

4) Set up your database by running migrations and seeds (currently `sqlite3` using `knex`)

```
$ npm run db
```

5) Run the server at the default log level (`'info'`):

```
$ npm start
```

The server's log level can be set in the environment or the .env file using `LOG_LEVEL=*` with one of `fatal`, `error`, `warn`, `info`, `debug`, `trace`.
If none is given `info` is used.

## Development

This project uses [`jscs`](http://jscs.info/) and [`jshint`](http://jshint.com/)
to enforce the [`mofo-style-guide`](https://github.com/MozillaFoundation/javascript-style-guide).

- To run the style checker, use `npm run jscs`.
- To run the hinter, use `npm run jshint`.
- To run both, use `npm run lint`.
