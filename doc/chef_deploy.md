Deploying with Chef
===================

Please read through all the following documentation before starting.

Requirements
------------
 - A machine to which you have ssh access

 - A user on that machine that has passwordless sudo access for the
   `/usr/bin/chef-solo` command so that you don't have to login as root (the
   machine doesn't need to have chef-solo actually installed yet)

 - Ruby 2.0 or higher, Berkshelf 3.2.1 and knife-solo 0.4.2 installed on your
   local machine (the machine which will launch the deploy)

 - The Primero repository checked out

 - An SSL certificate and key for the application

 - An SSL certificate and key for CouchDB (for syncing over the internet)

 - A JSON attribute node file that corresponds to the node being deployed

Checkout Primero repository
------------
###Make sure you have git installed

####OSX
```sh
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install git
```

####Ubuntu
```sh
$ sudo apt-get install git-core
```

You should add your public key to bitbucket to pull the repo.
Refer to Bitbucket documentation:
https://confluence.atlassian.com/bitbucket/add-an-ssh-key-to-an-account-302811853.html


On your local machine, run `git clone path-to-repo.git` to pull the repo to your local machine.
NOTE: You can get the actual clone command from Bitbucket by doing the following in the repo.
- Click on the '...' at the top left.
- Under 'Actions', click 'Clone'
- To the right of 'SSH', copy the command shown
- Run that command on your local machine in the location where you want to create the repo

Example:  $ git clone git@bitbucket.org:quoin/primero.git


Passwordless Sudo Access (remote machine)
------------
You will need a user that has passwordless sudo access on the remote machine you are deploying to.

Run the following to edit the sudoers file.
```sh
$ sudo visudo
```

Add `<User> ALL=(ALL) NOPASSWD:ALL` at the end of file, where User is the username of the user.

Save and run the following:
```sh
sudo service sudo restart
```

Install Ruby (local machine)
------------
To install Berkshelf and Knife-solo on your local machine, you need a working
Ruby environment.

####Ubuntu/Debian
```sh
$ sudo apt-add-repository ppa:brightbox/ruby-ng
$ sudo apt-get update
$ sudo apt-get install ruby2.1 ruby2.1-dev
```

####OSX
First, run `ruby -v` to check if ruby is installed and greater than 2.0. If not run the following:

Install homebrew (if not already installed) and ruby
```sh
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install ruby
```

After installation is complete run `ruby -v` to check the ruby version

Berkshelf and Knife
------------

```sh
$ gem install berkshelf --version 3.2.1
$ gem install knife-solo --version 0.4.2
```

Try and run this as your normal user.  You may get an error that a directory or file isn't writeable.
If you get permission errors you will have to run the gem install command as root. ex. `sudo gem install berkshelf --version 3.2.1`

These gems can take a while to install. You can tack on `--verbose` to the end of the
gem install commands to see more output.

If any of the gems fail to install, for instance you recieve "Unable to resolve dependencies: ridley requires retryable (~> 2.0)."
Try manually installing that gem. ex. `gem install retryable -v 2.0`

Certificates
------------

###Application SSL
To get the application SSL cert, you must go through a recognized Certificate
Authority (CA) or a CA which is trusted by the browsers of the primary users
of this Primero deployment.  It is currently not possible to run Primero
except through HTTPS, nor is it advisable to run any part of Primero except
under HTTPS.

###CouchDB SSL
The CouchDB SSL cert uses a private CA whose root certificate is distributed
automatically to all of the servers to verify communication.  To generate a
new key and cert, follow the next steps.

####Initial Setup
(All from [this
site](https://jamielinux.com/articles/2013/08/act-as-your-own-certificate-authority/).)

To setup a new root Certificate Authority to sign CouchDB certs, you need to configure your machine as your own certificate authority (CA).
Create the next directories and files to save the certificates and keys. You may need to do it as root.

```sh
$ mkdir -p /etc/pki/CA
$ cd /etc/pki/CA
$ mkdir certs crl newcerts private
$ chmod 700 private
$ touch index.txt
$ echo 1000 > serial
```

Also it is necessary to create a root key and a root certificate, that identify the certificate authority. To generate the root key with the proper encryption:

```sh
$ sudo openssl genrsa -aes256 -out /etc/pki/CA/private/couch_ca.pem 4096

Enter pass phrase for ca.key.pem: secretpassword
Verifying - Enter pass phrase for ca_key.pem: secretpassword

$ sudo chmod 600 /etc/pki/CA/private/couch_ca.pem
```

Open the file /ect/ssl/openssl.cnf. Change the field dir = /etc/pki/CA on [ CA_default ]. Also make sure the following fields look like this:
```sh
[ usr_cert ]
# These extensions are added when 'ca' signs a request.
basicConstraints=CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
nsComment = "OpenSSL Generated Certificate"
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

[ v3_ca ]
# Extensions for a typical CA
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
basicConstraints = CA:true
keyUsage = cRLSign, keyCertSign
```

To generate the root certificate:
```sh
$ sudo openssl req -new -x509 -days 3650 -key /etc/pki/CA/private/couch_ca.pem \
    -sha256 -extensions v3_ca -out /etc/pki/CA/certs/couch_ca.cert
$ sudo chmod 600 /etc/pki/CA/certs/couch_ca.cert
```

You should set up your own `config.cnf` file based on
your organization's policy and contact information.  See the openssl docs for
more info on how to configure things.

######Example config.cnf

```sh
[req]
default_bits            = 4096
distinguished_name      = req_distinguished_name
encrypt_key             = no
prompt                  = yes
string_mask             = nombstr

[ ca ]
default_ca = couch_ca

[ couch_ca ]
dir = /etc/pki/CA
new_certs_dir = $dir/newcerts/
database = $dir/index.txt
certificate = $dir/certs/couch_ca.cert
private_key = $dir/private/couch_ca.pem
default_days = 3650
default_md   = md5
policy       = policy_match
serial       = $dir/serial
preserve = yes

[ policy_match ]
commonName = supplied

[ req_distinguished_name ]
countryName                 = Country Name
stateOrProvinceName         = State Name
localityName                = City Name
0.organizationName          = Company/Organization
emailAddress                = Email Address
commonName                  = Couch DB Host

countryName_default         = US
stateOrProvinceName_default = Massachusetts
localityName_default        = Boston
0.organizationName_default  = Quoin, Inc.
emailAddress_default        = unknown@quoininc.com
```

####Creating and Signing New Certs
Once you have a CA set up, you can make new keys and certs for individual
CouchDB instances. Go to the root directory of your CA.

To create a new key:
```
openssl genrsa -out <HOST_NAME>.key 2048
```

To create a Certificate Signing Request with a key:
```
openssl req -new -key <HOST_NAME>.key -out <HOST_NAME>.csr -config config.cnf
```

To sign the CSR and make a Cert using the root CA key:
```
openssl ca -in <HOST_NAME>.csr -config config.cnf
```

All clients using HTTPS must have trust the root cert in the file
`couch_ca.crt`.

You must configure the node file (see below) to provision this new CA
certificate onto the deployed server so that it can verify remote connections
upon replication.  You can either overwrite the file
`cookbook/files/couch_ca.crt` with your own root cert or you can move the cert
into another file in that directory and set the
`primero.couchdb.root_ca_cert_source` attribute in the node file to point to
that new file.  See below for more information on this attribute.

###Node File
Next you will need a node file: a JSON file that defines various deployment
attributes.  You can copy the file `dev-node.json` in the root of this repo
for a reference to a more or less complete node file for Primero.  You can put
the node file anywhere you like on your local machine.

####Attributes
The following attributes are of special interest for configuration:

 - `primero.server_hostname` (required): The DNS hostname of the server.  The
     site should be accessed with this host name.
 - `primero.git.revision` (default: `master`): The commit
     id/tag/branch name to deploy
 - `primero.deploy_key` (required): An ssh private key that is configured in
     the Quoin bitbucket repo (under deployment keys) to allow read-only access
     to the code. The key needs to be passwordless. If your current key has a password,
     run `ssh-keygen -p` and follow the prompts to remove the key. When ask to input
     a new passphrase and verify the passphrase just hit enter.
 - `primero.couchdb.password` (required): The CouchDB password for the
     admin user--this will replace any existing password
 - `primero.couchdb.ssl.cert` (required): The CouchDB SSL certificate,
     formatted to replace all newlines with '\n'
 - `primero.couchdb.ssl.key` (required): The CouchDB SSL secret key,
     formatted to replace all newlines with '\n'
 - `primero.ssl.cert` (required): The app SSL certificate,
     formatted to replace all newlines with '\n'--the hostname in this cert
     should match the `primero.server_hostname` value.
 - `primero.ssl.key` (required): The app SSL secret key,
     formatted to replace all newlines with '\n'
 - `primero.couchdb.root_ca_cert_source` (default: `couch_ca.crt`): The source
     path of the Couch CA certificate that is used to verify other CouchDB
     instances when syncing.  This is a path is relative to the `files/default`
     directory in this repo.  You should add the CA cert there.
 - `primero.no_reseed` (required): If set to false, the chef deploy will reseed the database.
    If you imported a configuration bundle you should set this to true. Reseeding carries the risk of overwriting the imported configuration bundle.

You set them by specifying them in JSON in the node file.  For example, if you
want to set the hostname to _example.com_, just put the following in your node
file:

```javascript
{
  "primero": {
    ... other attibutes ...
    "server_hostname": "example.com",
    ... other attibutes ...
  },
  "run_list": [ "recipe[primero::default]" ]
}
```

####Runlist
You should set your runlist to `[ "recipe[primero::default]" ]` for any
standard deploy.

####Example node file
```javascript
{
  "couch_db": {
    "config": {
      "httpd": {
        "bind_address": "0.0.0.0"
      }
    }
  },
  "primero": {
    "environment": "integration",
    "rails_env": "production",
    "server_hostname": "example.com",
    "no_reseed": false,
    "git": {
      "repo": "git@bitbucket.org:user/primero.git",
      "revision": "master"
    },
    "couchdb": {
      "password": "couchpassword",
      "ssl": {
        "cert": "-----BEGIN CERTIFICATE-----\n ..."
      }
    },
    "deploy_key": "-----BEGIN RSA PRIVATE KEY-----\n ...",
    "ssl": {
      "crt": "-----BEGIN CERTIFICATE-----\n ...",
      "key": "-----BEGIN RSA PRIVATE KEY-----\n ..."
    }
  },
  "run_list": [ "recipe[primero::default]" ]
}
```

Deployment
----------
Once you have the requirements installed, you can run the following two commands from the
`cookbook` folder of the repo (cookbook directory must be able to be read by other users):

```sh
$ ssh USER@APP_HOST 'which chef-solo' || knife solo prepare --bootstrap-version=11.10.4 USER@APP_HOST
$ knife solo cook USER@APP_HOST NODE_FILE
```

Replacing USER with the remote user, APP_HOST with the remote machine host, and
NODE_FILE with the Chef node json file to use for this deploy.  It will take a
few minutes to run to completion. Bundle install and seeding are two steps that will take some time to complete.

Ports and Firewalls
-------------------
The main Primero application is just like any other HTTPS enabled web
application and runs on ports 80 and 443 for HTTP and HTTPS, respectively.  The
application server forces the use client to the HTTPS port immediately upon the
first request, so port 80 should be accessible to reduce confusion of the users
who manually type the URL into the browser.

If you want to be able to sync the CouchDB data between servers, you need to
open port 6984 on the target server of the replication configuration.  The
server that is initiating the sync does not require the CouchDB port to be
open.

For debugging and test purposes, you may also wish to expose the CouchDB HTTPS
port (6984) and/or the Solr Admin port (8983).  The Solr admin should never be
exposed to the entire internet under any circumstances, as it contains
sensitive data.  If you must expose it in your firewall, restrict the source IP
to one that you control.

###Roving Instances
The roving field instances of Primero have similar firewall/port requires to
the above, except that you will be using the Windows firewall combined with
Virtualbox's port forwarding settings.  When you first installed Primero on
Windows, it should have prompted you to approve a Windows Firewall rule to
expose port 11443 (or something similar).  If you approved this, Primero
is accessible on at least your local network through that port.

There are other ports that forwarded from the VM, but they are only bound to
localhost on the Windows host, so they will not be accessible on the local
network no matter what the Windows firewall settings.

If you are syncing between a roving Primero instance and a central Primero
instance, the central Primero instance's database must be exposed (port
6984).  Then, you can set up the sync config on the roving instance, pointing
to the central server as the target.

###Hosted Instances
On hosted instance of Primero, there could be a wide variety of potential
firewall solutions available.  If it is hosted on a cloud environment like AWS
or Azure, those services provide firewall configuration in the management
consoles.

In the absence of any simple cloud firewall configuration, you could configure
[UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) on the same machine as the
application.  This will configure the machine's packet filtering system for you
and is fairly easy to use.
