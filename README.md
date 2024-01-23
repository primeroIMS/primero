<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Primero
========
[![Build Status](https://api.travis-ci.org/primeroIMS/primero.svg?branch=master)](https://travis-ci.org/primeroIMS/primero/branches)


> :warning: **Primero v2.5 adds support for PostgreSQL 14!** Support for PostgreSQL 10 is retained and remains the default when running using Ansible/Docker Compose. Please use this opportunity to upgrade! PostgreSQL 14 will be the default starting with Primero v2.6, and support for PostgreSQL 10 will be eventually dropped. See [here](doc/postgres_upgrade.md) for a recommended upgrade process.

## Development

To develop the application locally, we recommend that you install [Docker](https://docs.docker.com/install/)
and [Docker Compose](https://docs.docker.com/compose/install/). This is needed to start your pre-configured
PostgreSQL and Solr images, if you don't want to install and configure these dependencies by hand.

All command below assume that you are starting in the Primero root directory.

### Build and Start Postgres and Solr

    $ cd docker
    $ cp local.env.sample.development local.env
    $ ./build.sh postgres
    $ ./build.sh solr
    $ ./compose.local.sh up -d postgres
    $ ./compose.local.sh run solr make-primero-core.sh primero-test
    $ ./compose.local.sh up -d solr

Note that on Linux, where Docker runs as root by default,
you will need to run the build and the compose scripts as `sudo`.

### Install rbenv and Ruby

1. Install rbenv

    MacOS via Homebrew

        $ brew install rbenv ruby-build

    Debian, Ubuntu, etc

        $ sudo apt install rbenv

2. Setup rbenv in your shell

        $ rbenv init

3. Close your terminal and reopen

4.  Verify rbenv

        $ curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-doctor | bash

    ```
    Checking for `rbenv' in PATH: /usr/local/bin/rbenv
    Checking for rbenv shims in PATH: OK
    Checking `rbenv install' support: /usr/local/bin/rbenv-install (ruby-build 20170523)
    Counting installed Ruby versions: none
    There aren't any Ruby versions installed under `~/.rbenv/versions'.
    You can install Ruby versions like so: rbenv install 3.2.2
    Checking RubyGems settings: OK
    Auditing installed plugins: OK
    ```

5. Install ruby version

        $ rbenv install 3.2.2

### Install Node and NPM via NVM

Install NVM

    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

The script below should add the following to either `~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`


    $ export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

Install the version of node needed.

    $ nvm install 18.13.0

Set the node version by running

    $ nvm use v18.13.0

### Install binary dependencies

On MacOS:

    $ # If xcode-select is not installed yet, install it.
    $ xcode-select --install
    $ brew install libpq imagemagick postgresql libsodium p7zip

On Ubuntu:

    $ sudo apt-get install -y libpq imagemagick libsodium-dev p7zip

On Fedora:

    $ sudo dnf install postgresql-devel ImageMagick libsodium-devel p7zip

### Starting development

Install  gems, packages:

    $ bundle install
    $ npm ci

Prepare development configuration. Review the created configurations files and alter as needed:

```bash
    $ cp config/database.yml.development config/database.yml
    $ cp config/locales.yml.development config/locales.yml
    $ cp config/mailers.yml.development config/mailers.yml
    $ cp config/sunspot.yml.development config/sunspot.yml
```

Set development environment variables:
```bash
    $ echo "export PRIMERO_SECRET_KEY_BASE=PRIMERO_SECRET_KEY_BASE" >> ~/.bashrc
    $ echo "export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY" >> ~/.bashrc
    $ echo "export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY" >> ~/.bashrc
```

If you use a different shell, add these environment variables to the rc file for that shell.

You may be pedantic about the secrets in development, and set them to something truly secret.
Optionally use the command below to generate a random secret:

    $ rails secret

Set this enviroment variable with a 32 bytes secret value:

    $ echo "export PRIMERO_MESSAGE_SECRET=PRIMERO_MESSAGE_SECRET" >> ~/.bashrc

Make sure that the secrets we set earlier are in your environment (replace .basharc with the rc file for your shell if you use a shell other than bash):

    $ source ~/.bashrc

Prepare the database

    $ rails db:create
    $ rails db:migrate
    $ rails db:seed

Generate the i18n translation files

    $ bin/rails primero:i18n_js

You may start the development Rails server on port 3000:

    $ rails s

And in a separate terminal window, the development Rails Webpacker server:

    $ npm run dev

Alternatively, to bring everything up together you can use:

    $ foreman start -f Procfile.dev

***Note:*** The first time webpack runs, it takes a very long time to compile.
It's better to keep Rails as a separate process if you want to restart it for some reason.


You should now be able to access your development server in the browser on [http://localhost:3000](http://localhost:3000).
You can login with a preseeded admin account with credentials `primero`/`primer0!`.

For more on making code contributions, have a look at the file [CONTRIBUTING.md](CONTRIBUTING.md).

### Using WebPush
To send push messages to web browsers you can enable webpush. For this, is required set some environment variables: `PRIMERO_WEBPUSH`, `PRIMERO_WEBPUSH_VAPID_PRIVATE` and `PRIMERO_WEBPUSH_VAPID_PUBLIC`.
PRIMERO_WEBPUSH must be placed in `inventory` file, the other two must be in `secret.yml` file.

To generate a valid VAPID key, you can execute the follow script and use for each variable

```bash
  openssl ecparam -genkey -name prime256v1 -out private_key.pem
  # generating public_vapid_key
  openssl ec -in private_key.pem -pubout -outform DER|tail -c 65|base64|tr -d '\n'|tr -d '=' |tr '/+' '_-'
  # generating private_vapid_key
  openssl ec -in private_key.pem -outform DER|tail -c +8|head -c 32|base64|tr -d '\n'|tr -d '=' |tr '/+' '_-'
  rm private_key.pem
```
## Notes

- It is known that a few npm packages will throw a `requires a peer of` warning. Examples: Mui-datatables is behind on updating dependecies. Jsdom requires canvas, but we are mocking canvas. Canvas also requires extra packages on alpine, which is the reason for mocking canvas.

## Contributing
- If contributing to the UI, make sure to read over the [UI/UX Development](doc/ui_ux.md) documents.
- If you are contributing via the DAO, make sure to read the relevant documents [here](doc/dao/Index.md).

## Production

Primero is deployed in production using Docker. Detailed Docker instructions exist in the file [docker/README.md](docker/README.md)
