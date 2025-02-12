<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->
[![DPG Badge](https://img.shields.io/badge/Verified-DPG-3333AB?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMSAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjIwMDggMjEuMzY3OEwxMC4xNzM2IDE4LjAxMjRMMTEuNTIxOSAxNi40MDAzTDEzLjk5MjggMTguNDU5TDE5LjYyNjkgMTIuMjExMUwyMS4xOTA5IDEzLjYxNkwxNC4yMDA4IDIxLjM2NzhaTTI0LjYyNDEgOS4zNTEyN0wyNC44MDcxIDMuMDcyOTdMMTguODgxIDUuMTg2NjJMMTUuMzMxNCAtMi4zMzA4MmUtMDVMMTEuNzgyMSA1LjE4NjYyTDUuODU2MDEgMy4wNzI5N0w2LjAzOTA2IDkuMzUxMjdMMCAxMS4xMTc3TDMuODQ1MjEgMTYuMDg5NUwwIDIxLjA2MTJMNi4wMzkwNiAyMi44Mjc3TDUuODU2MDEgMjkuMTA2TDExLjc4MjEgMjYuOTkyM0wxNS4zMzE0IDMyLjE3OUwxOC44ODEgMjYuOTkyM0wyNC44MDcxIDI5LjEwNkwyNC42MjQxIDIyLjgyNzdMMzAuNjYzMSAyMS4wNjEyTDI2LjgxNzYgMTYuMDg5NUwzMC42NjMxIDExLjExNzdMMjQuNjI0MSA5LjM1MTI3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)](https://digitalpublicgoods.net/r/dpg-slug)
Primero
========
[![Build Status](https://github.com/primeroIMS/primero/actions/workflows/app.yml/badge.svg?branch=main)](https://github.com/primeroIMS/primero/actions)


> [!WARNING]
> **Primero v2.10 adds support for PostgreSQL 15!**
> Support for PostgreSQL 14 is retained and remains the default when running using Ansible/Docker Compose. Please use this opportunity to upgrade! PostgreSQL 15 will be the default starting with Primero v2.11. support for PostgreSQL 10, 11 has been dropped and 14 will all eventually dropped. See [here](doc/postgres_upgrade.md) for a recommended upgrade process.

## Development

A guide to getting started with Primero development is available [here](doc/getting_started_development.md).

## Notes

- It is known that a few npm packages will throw a `requires a peer of` warning. Examples: Mui-datatables is behind on updating dependecies. Jsdom requires canvas, but we are mocking canvas. Canvas also requires extra packages on alpine, which is the reason for mocking canvas.

## Contributing
- If contributing to the UI, make sure to read over the [UI/UX Development](doc/ui_ux.md) documents.
- If you are contributing via the DAO, make sure to read the relevant documents [here](doc/dao/README.md).

## Production

Primero is deployed in production using Ansible. Detailed Ansible instructions exist in the file [ansible/README.md](ansible/README.md)
