Primero
========

## Development
To develop the application locally, you will need to install [Vagrant
1.6.1](http://www.vagrantup.com/download-archive/v1.6.1.html) manually and a
few Vagrant plugins to use Chef Solo.  Newer versions of Vagrant may work, but
they are unsupported at this time.  If you are using a Quoin standard machine,
then you need to apply [Pavel's patch to Ruby's ssh
library](https://bitbucket.org/quoin/quoin-toolbox) (look under the *Baseline
Tools* section) on your host machine so that your SSH cert keys don't make
vagrant bomb out.  Once you have Vagrant installed, run the following to
install the right plugins:

    $ vagrant plugin install vagrant-berkshelf --plugin-version 3.0.1
    $ vagrant plugin install vagrant-omnibus --plugin-version 1.4.1

You will also need to download and install the [Chef DK for your
platform](https://downloads.getchef.com/chef-dk/).

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

    127.0.0.1   primero.dev

You will need to access the site on this domain in your browser as the dummy
SSL cert is set with this domain.

Once you have the VM fully provisioned, you can access the site at
`http://primero.dev:8000` (or possibly a different port if Vagrant had a port
collision when trying to assign port 8000 -- check the Vagrant output upon the
`up` command).  It should automatically redirect you to the HTTPS protocol and
port 8443.  You can login with a preseeded admin account with credentials
`primero`/`primero`.


### Deploy keys

Since development will happen on forked repositories you will need to make sure
that your personal repository has the right deploy key set.  To do so, add the
key from the `node[:primero][:deploy_key]` attribute in the `dev-node.json`
file in this repo to your Bitbucket fork's deploy key list.  You add the key in
Bitbucket by going into the repo admin and clicking on `Deployment Keys`.  You
might have to convert the `\\n` characters in the JSON string to real newlines
first.

### Branching Strategy
TODO by Pavel

