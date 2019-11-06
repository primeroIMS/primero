Primero
========
[![Build Status](https://api.travis-ci.org/primeroIMS/primero.svg?branch=development_v2)](https://travis-ci.org/primeroIMS/primero/branches)


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

### Install RVM and Ruby

    $ #Install RVM
    $ gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
    $ \curl -sSL https://get.rvm.io | bash
    $ echo "source ~/.rvm/scripts/rvm" >> ~/.bashrc
    $ source  ~/.rvm/scripts/rvm
    $
    $ #Install Ruby
    $ rvm install `cat .ruby-version`

### Install Node and NPM

On MacOS, with [Homebrew](https://brew.sh):

    $ #Install Node
    $ brew install node

On Ubuntu:

    $ #Install Node 12.x
    $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

On Fedora:
    $ #Install Node 12.x
    $ sudo dnf install -y gcc-c++ make
    $ curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
    $ sudo dnf install nodejs

### Install binary dependencies

On MacOS:

    $ #If xcode-select is not installed yet, install it.
    $ xcode-select --install
    $ brew install libpq imagemagick postgresql

On Ubuntu:

    $ sudo apt-get install -y libpq imagemagick

On Fedora:
    $ sudo dnf install postgresql-devel ImageMagick

### Starting development

Install  gems, packages:

    $ bundle install
    $ npm install

Prepare development configuration. Review the created configurations files and alter as needed:

    $ cp config/database.yml.development config/database.yml
    $ cp config/locales.yml.development config/locales.yml
    $ cp config/mailers.yml.development config/mailers.yml
    $ cp config/sunspot.yml.development config/sunspot.yml

Set development environment variables:

    $ echo "export PRIMERO_SECRET_KEY_BASE=PRIMERO_SECRET_KEY_BASE" >> ~/.bashrc
    $ echo "export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY" >> ~/.bashrc
    $ echo "export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY" >> ~/.bashrc

If you use a different shell, add these environment variables to the rc file for that shell.

You may be pedantic about the secrets in development, and set them to something truly secret.
Optionally use the command below to generate a random secret:

    $ rails secret

Make sure that the secrets we set earlier are in your environment (replace .basharc with the rc file for your shell if you use a shell other than bash):

    $ source ~/.bashrc

Prepare the database

    $ rails db:create
    $ rails db:migrate
    $ rails db:seed

Generate the i18n translation files

    $ bin/rails i18n:js:export

You may start the development Rails server on port 3000:

    $ rails s

And in a separate terminal window, the development Rails Webpacker server:

    $ npm run serve

Alternatively, to bring everything up together you can use:

    $ foreman start -f Procfile.dev

***Note:*** The first time webpack runs, it takes a very long time to compile.
It's better to keep Rails as a separate process if you want to restart it for some reason.


You should now be able to access your development server in the browser on [http://localhost:3000](http://localhost:3000).
You can login with a preseeded admin account with credentials `primero`/`primer0!`.

For more on making code contributions, have a look at the file [CONTRIBUTING.md](CONTRIBUTING.md).

## Notes

- It is known that a few npm packages will throw a `requires a peer of` warning. Examples: Mui-datatables is behind on updating dependecies. Jsdom requires canvas, but we are mocking canvas. Canvas also requires extra packages on alpine, which is the reason for mocking canvas.

## Production

Primero is deployed in production using Docker. Detailed Docker instructions exist in the file [docker/README.md](docker/README.md)
