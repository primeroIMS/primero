Deploying with Chef
===================

Please read through all the following documentation before starting.

Requirements
------------
 - A deployment target machine to which you have ssh access

 - A user on that machine that has passwordless sudo access for the
   `/usr/bin/chef-solo` command so that you don't have to login as root (the
   machine doesn't need to have chef-solo actually installed yet)

 - ChefDK 0.9 and knife-solo 0.4.3 installed on your
   local machine (the machine which will launch the deploy)

 - The Primero repository checked out

 - An SSL certificate and key for the application:
   See the SSL instructions in the `doc/ssl.md` file in this repository.

 - An SSL certificate and key for CouchDB (for syncing over the internet)
   See the SSL instructions in the `doc/ssl.md` file in this repository.

 - A JSON attribute node file that corresponds to the node being deployed

Checkout Primero repository
------------
###Make sure you have git installed

####OSX
```sh
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install git
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

 - The git clone command appears on the Repo Overview page next to the download icon and 'SSH'
 - To the right of 'SSH', copy the command shown
 - Run that command on your local machine in the location where you want to create the repo

Example:  `$ git clone git@bitbucket.org:quoin/primero.git`


On your local machine, cd to the repo root directory and checkout the version tag or branch that you are going to deploy.
This is critical so the chef recipes used to deploy are appropriate for the application version you are deploying.

Example:
```sh
$ cd primero
$ git checkout v1.5.17
```


If you will also be deploying the configuration, you will need to add your public key to the configuration repo.
Further instructions below.


Passwordless Sudo Access (remote machine)
------------
You will need a user that has passwordless sudo access on the remote target machine you are deploying to.

Run the following to edit the sudoers file.
```sh
$ sudo visudo
```

Add `<User> ALL=(ALL) NOPASSWD:ALL` at the end of file, where User is the username of the user.

Save and run the following:
```sh
sudo service sudo restart
```

Install Chef (local machine)
------------
Install ChefDK (which also contains Berkshelf) and Knife Solo on your local machine. ChefDK packages a Chef-specific distribution of Ruby, so there is no need to install Ruby locally. 

####Ubuntu/Debian
```sh
$ wget https://packages.chef.io/stable/debian/6/chefdk_0.9.0-1_amd64.deb
$ sudo dpkg -i chefdk_0.9.0-1_amd64.deb
$ chef verify
$ chef gem install knife-solo --version 0.4.3
```

####OSX
Download and install [ChefDK 0.9](https://downloads.chef.io/chef-dk/mac/) (he version is VERY IMPORTANT!)

```sh
$ chef verify
$ chef gem install knife-solo --version 0.4.3
```

These gems may take a while to install. You can tack on `--verbose` to the end of the
gem install commands to see more output.

If any of the gems fail to install, for instance you receive "Unable to resolve dependencies: ridley requires retryable (~> 2.0)."
Try manually installing that gem. ex. `chef gem install retryable -v 2.0`


###Node File
After Chef is successfully installed on the local machine, you will need to create a Chef node configuration file.
A sample Primero node file (dev-node.json.sample) is in the root directory of the application.

```sh
ubuntu@ubuntu:~/work/primero$ ls -l *node*
-rw-rw-r-- 1 ubuntu ubuntu 6655 Dec  7 15:53 dev-node.json
ubuntu@ubuntu:~/work/primero$
```

This is a JSON file that defines various deployment
attributes.  You can copy the file `dev-node.json` in the root of this repo
for a reference to a more or less complete node file for Primero.  You can put
the node file anywhere you like on your local machine.
Any vlaues defined in this node file override values defined in attributes/default.rb

####Attributes
The following attributes are of special interest for configuration:

 - `primero.server_hostname` (required): The DNS hostname of the server.  The
     site should be accessed with this host name.
 - `primero.git.revision` (default: `development`): The commit
     id/tag/branch name to deploy
 - `primero.deploy_key` (required, for now): This is deployment key used by BitBucket 
     or Github to grant deployment tools readonly access to the hosted Git repo. Make sure 
     to replace the contents between "BEGIN RSA PRIVATE KEY" AND "END RSA PRIVATE KEY" with your private key.
     If added as separate lines, join the lines together with a newline character '\n'. See more details below.
 - `primero.couchdb.password` (required): The CouchDB password for the
     admin user--this will replace any existing password
 - `primero.couchdb.ssl.cert` (required): The CouchDB SSL certificate, formatted to replace all newlines with '\n'.
 - `primero.couchdb.ssl.key` (required): The CouchDB SSL secret key, formatted to replace all newlines with '\n'.
 - `primero.ssl.crt` (required): The app SSL certificate,
     formatted to replace all newlines with '\n'--the hostname in this cert
     should match the `primero.server_hostname` value.
     You can use the same cert created for couchdb (primero.couchdb.ssl.cert)
 - `primero.ssl.key` (required): The app SSL secret key,
     formatted to replace all newlines with '\n'
     You can use the same key created for couchdb (primero.couchdb.ssl.key)
 - `primero.couchdb.root_ca_cert_source` (default: `couch_ca.crt`): The source
     path of the Couch CA certificate that is used to verify other CouchDB
     instances when syncing.  This is a path is relative to the `files/default`
     directory in this repo.  You should add the CA cert there.
 - `primero.no_reseed` (required): Controls the defalt DB seed load
     If set to false & primero.seed.enabled is false, the Chef deploy will reseed the database.
     If set to true & primero.seed.enabled is false,  the Chef deploy will reseed the database only on the initial install.
     If set to true & primero.seed.enabled is true, the default DB seeds will NOT run.  It will load the config only once.
     if set to false & primero.seed.enabled is true, the default DB seeds will NOT run.  The configuration will be loaded.
 - `primero.seed.enabled`: Controls the load of the configuration
     If set to false, no configuration will be loaded.  DB Seeds will run as specified by the no_reseed attribute.
     If set to true, default DB seed will not run.  Instead, the configuration from the specified config repo will be loaded.
 - `primero.seed.git.repo`: The Configuration Repository.
     Example: "git@bitbucket.org:quoin/primero-configuration.git"
 - `primero.seed.git.revision`: The branch / tag of the config repo to pull.
 - `primero.seed.deploy_key`: The SSH deploy key for the configuration repository.
 - `primero.seed.script`: The relative path to the script in the repo that initializes the seed.
     Example: "/lebanon/seed-files/load_configuration.rb"
 - `primero.seed.bundle`:  The relative path to the config bundle JSON to load.
     This JSON bundle will only load if the seed.script attribute (above) is not set.
     Example: "/jordan/configuration-bundle.json"
 - `primero.locales.default_locale`: The default locale for the system.
     If not set, it will default to 'en' (English).
 - `primero.locales.locales`: An array of locales available in the system
     This list must be limited to a subset of the list of available locales defined in Primero::Application::LOCALES
     Setting this list of locales will restrict the list of locales available in the UI when a user is adding translated
     values, such as in form setup and user setup.
     The localizeable property logic will only create db fields for these locales.
     If not set, the default is ['en', 'fr', 'ar', 'es']

##### Primero Deploy Key
In the Bitbucket repo (under Settings->deployment keys) make sure you have a key for your deployment.
If it does not already exist, add a new key for your deployment here,
 
 - Click "Add key"
 - Add a label of your choosing
 - In the 'Key' box, paste in the contents of your public key (id_rsa.pub)
 - Click Save

If you do not currently have such a key, use ssh-keygen to generate it.
Leave the passphrase empty when creating the key.
If you already have a key that has a passphrase, use `ssh-keygen -p' to remove the passphrase.

Next, add the private key as the value of the primero.deploy_key field in the dev-node.json file.
Copy the contents of the private key (id_rsa).

-- REPEAT this process for the Configuration Repository if you will be deploying a configuration --


#### SSL 

To get the `primero.couchdb.ssl.cert`:

List the contents of /etc/pki/CA/index.txt

```
 ubuntu@ubuntu:/etc/pki/CA$ cat index.txt
 V  251205162522Z   1000  unknown /CN=primero.test_deploy
```

Use the value of the 3rd column (in example above, 1000) and find the corresponding .pem file in `/etc/pki/CA/newcerts`


```
 ubuntu@ubuntu:/etc/pki/CA$ ls -l newcerts
 total 8
 -rw-r--r-- 1 root root 5036 Dec  8 11:25 1000.pem
```

  - Cat out the contents of that file.
  - Copy the contents from "BEGIN CERTIFICATE" AND "END CERTIFICATE"
  - Paste this as the value of the cert field in the json file.
  - It probably will be added as multiple lines.  Join the lines together with newline characters '\n'
For more on the SSL keys, please see the file 


#### Let's Encrypt Attributes
Primero offers an opportunity to enable Let's Encrypt SSL certificates. You must include `recipe[primero::letsencrypt]` in your `run_list`. The following attributes should be set:

 - `primero.letsencrypt.email` (required): The primary support contact. This email will be notified when
     certificates are expired or renewed.
 - `primero.letsencrypt.couchdb`: Boolean. Indicate whether the Let's Encrypt certificate should
    also be used for CouchDB replication encryption.

You can include both self-signed certificates and the Let's Encrypt recipe in the node file. 
In that case, Let's Encrypt will take precedence over the self-signed certificates.


#### Unattended system upgrades
You can enable Ubuntu automatic security upgrades by adding `recipe[chef-unattended-upgrades::default]` to
the rerun_list. This cookbook is external to Primero and is optional, but comes bundled with the deploy. 
The following attributes need to be set:

 - `unattended-upgrades.send_email`: Boolean. Send email when the unattended upgrade runs 
    with valid upgrades or fails.
 - `unattended-upgrades.email_address`: The primary support contact.
 - `unattended-upgrades.auto_reboot`: Boolean. Indicate whether a system should be rebooted 
     after upgrades requiring a reboot are applied. This should be set based on the support SLA.
     The upgrade email will indicate whether a system reboot is required.


Attributes are set in the JSON node configuration file.  For example, if you
want to set the hostname to _example.com_, just put the following in your node
file:

```javascript
{
  "primero": {
    ... other attributes ...
    "server_hostname": "example.com",
    ... other attributes ...
  },
  "run_list": [ "recipe[primero::default]" ]
}
```

####Runlist
Your run_list should be set as follows...

For a standard deploy:                      `[ "recipe[primero::default]" ]`

For a standard deploy with configuration:   `[ "recipe[primero::default]", "recipe[primero::configuration]" ]`

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
    "seed": {
      "enabled": false,
      "git": {
        "repo": "git@bitbucket.org:quoin/primero-configuration.git",
        "revision": "master"
      },
      "script": "/lebanon/seed-files/load_configuration.rb",
      "bundle": "/jordan/configuration-bundle.json",
      "deploy_key": ""
    },
    "letsencrypt": {
      "email": "primero_support@your.org",
      "couchdb": true
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
    },
    "locales": {
      "default_locale": "en",
      "locales": ["en", "fr", "ar"]
    }
  },
  "unattended-upgrades": {
    "send_email": true,
    "email_address": "primero_support@your.org",
    "auto_reboot": true
  },
  "run_list": [ 
    "recipe[primero::default]",
    "recipe[primero::configuration]",
    "recipe[primero::letsencrypt]", 
    "recipe[chef-unattended-upgrades::default]" 
  ]
}
```

Deployment
----------
First, verify you have checked out the correct tag version or branch that you are deploying.
It should match the version you have specified in the node file.

```sh
$ git status
```

Once you have the requirements installed, you can run the following two commands from the
`cookbook` folder of the repo (cookbook directory must be able to be read by other users):

```sh
$ ssh USER@APP_HOST 'which chef-solo' || knife solo prepare --bootstrap-version=11.10.4 USER@APP_HOST
$ knife solo cook USER@APP_HOST NODE_FILE
```

Replacing USER with the remote user, APP_HOST with the remote machine host, and
NODE_FILE with the Chef node json file to use for this deploy.  It will take a
few minutes to run to completion. Bundle install and seeding are two steps that will take some time to complete.

EXAMPLE:
`ubuntu@ubuntu:~/work/primero/cookbook$ knife solo cook ubuntu@primero.test_deploy ../dev-node.json`

If an error occurs, make note of the error.  It may suggest a command to run manually on the remote server,
such as manually installing a missing gem.  If a particular gem fails, trying to install it manually on the remote server may give more information as to what is causing the error.
After this, re-run the deployment.

Ports and Firewalls
-------------------
The main Primero application is just like any other HTTPS enabled web
application and runs on ports **80** and **443** for HTTP and HTTPS, respectively.  The
application server forces the use client to the HTTPS port immediately upon the
first request, so port **80** should be accessible to reduce confusion of the users
who manually type the URL into the browser.

If you want to be able to sync the CouchDB data between servers, you need to
open port **6984** on the target server of the replication configuration.  The
server that is initiating the sync does not require the CouchDB port to be
open.

For debugging and test purposes, you may also wish to expose the CouchDB HTTPS
port (**6984**) and/or the Solr Admin port (**8983**).  The Solr admin should never be
exposed to the entire internet under any circumstances, as it contains
sensitive data.  If you must expose it in your firewall, restrict the source IP
to one that you control.


###Hosted Instances
On hosted instance of Primero, there could be a wide variety of potential
firewall solutions available.  If it is hosted on a cloud environment like AWS
or Azure, those services provide firewall configuration in the management
consoles.

In the absence of any simple cloud firewall configuration, you could configure
[UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) on the same machine as the
application.  This will configure the machine's packet filtering system for you
and is fairly easy to use.

In order to allow remote access for support and deployments, SSH should be securely
configured and exposed (port **22** is the default). It is strongly recommended
to not allow password access for SSH, and to limit the permitted access servers.

###Roving Instances
The roving field instances of Primero have similar firewall/port requires to
the above, except that you will be using the Windows firewall combined with
Virtualbox's port forwarding settings.  When you first installed Primero on
Windows, it should have prompted you to approve a Windows Firewall rule to
expose port **11443** (or something similar).  If you approved this, Primero
is accessible on at least your local network through that port.

There are other ports that forwarded from the VM, but they are only bound to
localhost on the Windows host, so they will not be accessible on the local
network no matter what the Windows firewall settings.

If you are syncing between a roving Primero instance and a central Primero
instance, the central Primero instance's database must be exposed (port
**6984**).  Then, you can set up the sync config on the roving instance, pointing
to the central server as the target.