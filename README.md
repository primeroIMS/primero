<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Primero
========
[![Build Status](https://github.com/primeroIMS/primero/actions/workflows/app.yml/badge.svg)](https://github.com/primeroIMS/primero/actions)


> [!WARNING]
> **Primero v2.5 adds support for PostgreSQL 14!**
> Support for PostgreSQL 10 is retained and remains the default when running using Ansible/Docker Compose. Please use this opportunity to upgrade! PostgreSQL 14 will be the default starting with Primero v2.6, and support for PostgreSQL 10 will be eventually dropped. See [here](doc/postgres_upgrade.md) for a recommended upgrade process.

## Development

A guide to getting started with Primero development is available [here](doc/getting_started.md).



## Notes

- It is known that a few npm packages will throw a `requires a peer of` warning. Examples: Mui-datatables is behind on updating dependecies. Jsdom requires canvas, but we are mocking canvas. Canvas also requires extra packages on alpine, which is the reason for mocking canvas.

## Contributing
- If contributing to the UI, make sure to read over the [UI/UX Development](doc/ui_ux.md) documents.
- If you are contributing via the DAO, make sure to read the relevant documents [here](doc/dao/Index.md).

## Production

Primero is deployed in production using Docker. Detailed Docker instructions exist in the file [docker/README.md](docker/README.md)
