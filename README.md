Primero
========
[![Build Status](https://api.travis-ci.org/primeroIMS/primero.svg?branch=master)](https://travis-ci.org/primeroIMS/primero)


## Development
To develop the application locally, you will need to do the following:

- Install [VirtualBox 5.2.4](https://www.virtualbox.org/wiki/Downloads)
- Install [Vagrant 2.0.1](https://www.vagrantup.com/downloads.html)
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
our fake domain to use for development.  Add the following to your `/etc/hosts`
file (may be a slightly different file on OSX):

    127.0.0.1   primero.test

You will need to access the site on this domain in your browser as the dummy
SSL cert is set with this domain.

Once you have the VM fully provisioned, you can access the site at
[http://primero.test:8000](http://primero.test:8000) (or possibly a different port if Vagrant had a port
collision when trying to assign port 8000 -- check the Vagrant output upon the
`up` command).  It should automatically redirect you to the HTTPS protocol and
port 8443.  You can login with a preseeded admin account with credentials
`primero`/`qu01n23!`.

Vagrant is provisioned using a development Chef file `dev-node.json.sample`. You can override it by creating your own file `dev-node.json`. See the README in the `cookbook` directory for more on configuring Primero Chef files.

## Starting development

When the Vagrant box is up and running, SSH in and go to the Primero development directory (synced from your host):

    $ vagrant ssh
    $ cd ~/primero

Add the mailer.yml file from the config directory

Prepare the development environment:

    $ bundle install
    $ bundle exec rake db:migrate:design
    $ bundle exec rake db:seed #This will take a while

To bring up the development server on port 3000:

    $ bundle exec rails s

You should now be able to access your development server in the browser on [http://primero.test:3000](http://primero.test:3000)

Automatic development server reloads based on code changes have been disabled. This is intentional. **Do not change that!**

For more on making code contributions, have a look at the file `CONTRIBUTING.md`.


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