---
layout: docs
title:    Deploy to Linode using Chef and Lets Encrypt
permalink: /docs/linode/
---

Deploy to Linode using Chef and Lets Encrypt
============================================

First is a quick overview of the steps required to set up Primero on a linode server using Chef. It is structured into tasks to be completed on the Linode virtiual machine and then tasks to be completed on a local machine (like a laptop) 

Each section will be explained in detail.

Overview of Linode Tasks (from now on this will be referred to as the `target` machine)
---------------------------------------------------------------------------------------

 - Log in to Linode and set up a small virtual machine running Ubuntu 14.04 LTS. 
 - Create a user on the target machine with passwordless sudo access
 - Set up DNS so that a domain name resolves to the target machine
 - Install a digital certificate based on the domain name using the certbot application created by Lets Encrypt


Overview of Local Tasks (from now on this will be referred to as the `deployment` machine)
------------------------------------------------------------------------------------------

 - Install Chef and Knife
 - Clone the Primero repository and make sure your public SSH key has been added to the repository
 - Create a configuration file for Chef and run the config file using chef


Tasks on the `target` machine
=============================

## Log in to Linode and set up a linode running Ubuntu 14.04 LTS. 

- Create a linode using the web interface <img src="{{site.baseurl}}/docs/img/linode/2048.png"> and deploy the Ubuntu 14.04LTS image to it <img src="{{site.baseurl}}/docs/img/linode/1404.png"> 
_ Note that the version of Ubuntu is important_

After that completes note the SSH access details (like `ssh root@xxx.xxx.xxx.xxx` ) on the Remote Access tab in the Linode interface.

## Create a user on the target machine with passwordless sudo access

- Using a Terminal log in using the SSH details noted above. Create a new user and then switch to that user

```
root@machine:~# adduser <user>
root@machine:~# usermod -aG sudo <user>
root@machine:~# su <user>
```
Give this new user passwordless access to sudo

```
sudo visudo
```

by adding this line at the bottom of the file which opens

```
<user> ALL=(ALL) NOPASSWD:ALL
```

and then restart sudo 

```
sudo service sudo restart
```

## Set up DNS so that a domain name resolves to the target machine

- Add a Domain Zone using the DNS manager tab <img src="{{site.baseurl}}/docs/img/linode/dns.png"> and let Linode insert some records for you. Make sure that the domain then uses Linode nameserver. Here is an example setting this using GoDaddy <img src="{{site.baseurl}}/docs/img/linode/godaddy.png">

## Install a digital certificate based on the domain name using the certbot application created by Lets Encrypt

 - Download and run the application to automatically create a free https certificate. Primero uses nginx so choose this on the <a href="https://certbot.eff.org/">certbot site </a><img src="{{site.baseurl}}/docs/img/linode/certbot.png">
The instructions can be seen in the screenshot above but basically they are


```
 <user>@machine:~$ wget https://dl.eff.org/certbot-auto
 <user>@machine:~$ chmod a+x certbot-auto
 <user>@machine:~$ ./certbot-auto certonly
```

This script will allow you to interactively set options like company name and email used on the certificate. The most important one to remember is the email used as this will be used in the chef configuration file later on.


Tasks on the `deployment` machine
=============================

## Install Chef and Knife

Open a terminal and do

```sh
$ wget https://packages.chef.io/stable/debian/6/chefdk_0.9.0-1_amd64.deb
$ sudo dpkg -i chefdk_0.9.0-1_amd64.deb
$ chef verify
$ chef gem install knife-solo --version 0.4.3
```

_Note that the version number of chef is important_


## Clone the Primero repository and make sure your public SSH key has been added to the repository

Copy your public ssh key using `$ pbcopy < ~/.ssh/id_rsa.pub` and paste it into the ssh keys on github. Then clone the repository
using `$ git clone https://github.com/primeroIMS/primero.git`


## Create a configuration file for Chef and run the config file using chef

In the cookbook folder of the checkout there is a file called `dev_node.json` which is an example configuration file for chef. Paste appropriate certificates and keys for couchdb and the deploy key


```
{
  "couch_db": {
    "config": {
      "httpd": {
        "bind_address": "0.0.0.0"
      }
    }
  },
  "primero": {
    "environment": "dev",
    "rails_env": "production",
    "server_hostname": "nibbed.io",
    "no_reseed": false,
    "git": {
      "repo": "",
      "revision": "development"
    },
    "letsencrypt": {
      "email": "your@email.com",
      "couchdb": true
    },
    "couchdb": {
      "password": "",
      "ssl": {
        "cert": "",
      "key": ""
      }
    },
    "deploy_key": "",
    "ssl": {
      "crt": "",
      "key": ""
    }
  },
  "unattended-upgrades": {
    "send_email": true,
    "email_address": "primero_support@your.org",
    "auto_reboot": true
  },
  "run_list": [ 
    "recipe[primero::default]",
    "recipe[primero::letsencrypt]", 
    "recipe[chef-unattended-upgrades::default]" 
  ]
}
```

then run the deployment command

```
ssh user@xx.xx.xx.x 'which chef-solo' || knife solo prepare --bootstrap-version=11.10.4 user@xx.xx.xx.xx

knife solo cook user@xx.xx.xx.xx ../dev-node.json
```

