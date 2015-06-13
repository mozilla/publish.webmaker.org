# publish.webmaker.org [![Code Climate](https://codeclimate.com/github/mozilla/publish.webmaker.org/badges/gpa.svg)](https://codeclimate.com/github/mozilla/publish.webmaker.org) [![David-DM](https://david-dm.org/mozilla/publish.webmaker.org.svg)](https://david-dm.org/mozilla/publish.webmaker.org)
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

4) Create your postgres database, then run migrations and seeds.

```
$ npm run db:new

if you'd like to reset your database at anytime, you can use:

$npm run db:reset
```

Both of these commands require that you have [PostGres](http://www.postgresql.org/download/) installed, as well as [Knex](http://knexjs.org/) installed globally. To do that you can:

```
$ npm install knex -g
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

## Documentation

This project uses [`lout`](https://github.com/hapijs/lout) to automatically generate API documention. To view the docs, start the server and visit
[`http://localhost:2015/docs`](http://localhost:2015/docs).
