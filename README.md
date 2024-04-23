<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Primero
========
[![Build Status](https://github.com/primeroIMS/primero/actions/workflows/app.yml/badge.svg?branch=main)](https://github.com/primeroIMS/primero/actions)


> [!WARNING]
> **Primero v2.10 adds support for PostgreSQL 15!**
> Support for PostgreSQL 14 is retained and remains the default when running using Ansible/Docker Compose. Please use this opportunity to upgrade! PostgreSQL 15 will be the default starting with Primero v2.11, and support for PostgreSQL 10 and 14 will be eventually dropped. See [here](doc/postgres_upgrade.md) for a recommended upgrade process.

## Development

A guide to getting started with Primero development is available [here](doc/getting_started_development.md).

## Notes

- It is known that a few npm packages will throw a `requires a peer of` warning. Examples: Mui-datatables is behind on updating dependecies. Jsdom requires canvas, but we are mocking canvas. Canvas also requires extra packages on alpine, which is the reason for mocking canvas.

## Contributing
- If contributing to the UI, make sure to read over the [UI/UX Development](doc/ui_ux.md) documents.
- If you are contributing via the DAO, make sure to read the relevant documents [here](doc/dao/README.md).

## Production

Primero is deployed in production using Docker. Detailed Docker instructions exist in the file [docker/README.md](docker/README.md)
