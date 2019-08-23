Primero
========
[![Build Status](https://api.travis-ci.org/primeroIMS/primero.svg?branch=master)](https://travis-ci.org/primeroIMS/primero)


## Development
To develop the application locally, you will need to do the following:

- Install [VirtualBox 6](https://www.virtualbox.org/wiki/Downloads)
- Install [Vagrant 2.2.3](https://www.vagrantup.com/downloads.html)
- Install [Chef DK 0.9.0](https://downloads.chef.io/chef-dk/).
**Note that currently the latest supported Chef DK version is 0.9.0**

**Note:** Primero v1.4+ (currently on the development branch) uses Ubuntu 16.04. Primero v1.3 or below uses Ubuntu 14.04. If you wish to do development on either stream, it's recommended to clone this project into separate directories to manage separate Vagrant boxes.

Once you have Vagrant installed, run the following to install the right plugins:

    $ vagrant plugin install vagrant-berkshelf --plugin-version 5.1.2
    $ vagrant plugin install vagrant-omnibus --plugin-version 1.5.0

 **Note:** If you are using OS X, make sure to run the following command due to a 1.8.x [Vagrant bug](https://github.com/mitchellh/vagrant/issues/7997)

    $ sudo rm -f /opt/vagrant/embedded/bin/curl

Duplicate the dev-node.json.sample and rename it dev-node.json. This file contains the chef configuration options.

Now you are ready to start the VM.  Make sure you don't have anything running
on ports 8000, 8443, 5984, or 3000 -- vagrant will forward to these ports from
the VM to give you access to the database, application server and rails dev
server.  Auto correction of ports is currently not enabled to avoid confusion.
To start the VM, run:

    $ vagrant up

This will take a while as it has to download and compile some stuff from
source.  While this is running you can modify your hosts file to include
our fake domain to use for development.


| WARNING: Vagrant no longer sets up a production environment. |
| --- |


Vagrant is provisioned using a development Chef file `dev-node.json.sample`. You can override it by creating your own file `dev-node.json`. See the README in the `cookbook` directory for more on configuring Primero Chef files.

## Starting development

When the Vagrant box is up and running, SSH in and go to the Primero development directory (synced from your host):

    $ vagrant ssh
    $ cd ~/primero

### Prepare the development environment:

    $ bundle install


### Install dependecies of MiniMagick used on Active Storage
    $ sudo apt-get install -y imagemagick

### Install nodejs and yarn
    $ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

    $ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

    $ sudo apt-get update && sudo apt-get install yarn
    
### Make sure you set up secrets
    $ echo "export PRIMERO_SECRET_KEY_BASE=`rails secret | tail -1`" >> ~/.bashrc
    $ echo "export DEVISE_SECRET_KEY=`rails secret | tail -1`" >> ~/.bashrc
    $ echo "export DEVISE_JWT_SECRET_KEY=`rails secret | tail -1`" >> ~/.bashrc

### Prepare the database

    $ rails db:create
    $ rails db:migrate
    $ rails db:seed
    
### Pull JS dependencies

    $ yarn install    

To bring up the development server on port 3000 and webpack:

    $ foreman start -f Procfile.dev
    
Alternatively, you may want to start Rails and Webpack separately:
   
    $ rails s

And in a separate Vagrant SSH session:

    $ ./bin/webpack-dev-server


***Note:*** The first time webpack runs, it takes a very long time to compile. 
It's better to keep Rails as a separate process if you want to restart it for some reason.

***Note:*** Use the environment variable `CACHE_CLASSES=no` to allow Rails to reload Ruby code on the fly.
Use the environment variable `LEGACY_UI=yes` to support rendering of the old v1.x UI. 
This option (along with the legacy UI) will soon disappear. 

You should now be able to access your development server in the browser on [http://primero.test:3000](http://primero.test:3000).
You can login with a preseeded admin account with credentials `primero`/`primer0!`.

Automatic development server reloads based on code changes have been disabled. This is intentional. **Do not change that!**

For more on making code contributions, have a look at the file `CONTRIBUTING.md`.

Occasionally you may have issues with the JS I18n object not properly loading the correct locales as defined in locales.yml.
Due to a caching issue, it may retain an older list of available locales.
If this happens, and you have a user set up with a locale not defined in that old stale locales list, when you create a case,
the forms will be blank.
To resolve this, run the following command from the application directory:
    $ bundle exec rake tmp:cache:clear


## Deploy keys

Since development will happen on forked repositories you will need to make sure
that your personal repository has the right deploy key set.  To do so, add the
key from the `node[:primero][:deploy_key]` attribute in the `dev-node.json`
file in this repo to your Bitbucket fork's deploy key list.  You add the key in
Bitbucket by going into the repo admin and clicking on `Deployment Keys`.  You
will have to convert the `\\n` characters in the JSON string to real newlines
first.

## Production

Primero is deployed in production using [Chef](https://www.chef.io/). Detailed Chef instructions exist in the file `cookbook/README.md`
