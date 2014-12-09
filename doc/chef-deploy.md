Deploying with Chef
===================

Requirements
------------
 - A machine with ssh access

 - A user on that machine that has passwordless sudo access for the
   `/usr/bin/chef-solo` command so that you don't have to login as root

 - Berkshelf 3.2.1 and knife-solo 0.4.2 installed on your local machine (the
   machine which will control the deploy)

 - The Primero repository checked out

 - A JSON attribute node file that corresponds to the node being deployed

To install Berkshelf and Knife-Solo, you need a working Ruby environment.  Then
you can run:

```
$ gem install berkshelf --version 3.2.1
$ gem install knife-solo --version 0.4.2
```

Try and run this as your normal user.  If you get permission errors you will
have to run the gem install command as root.

Once you have those installed, you can run the following two commands from the
`cookbook` folder of the repo:

```
$ ssh USER@APP_HOST 'which chef-solo' || knife solo prepare --bootstrap-version=11.10.4 ubuntu@APP_HOST
$ knife solo cook USER@APP_HOST NODE_FILE
```

Replacing USER with the remote user, APP_HOST with the remote machine host, and
NODE_FILE with the Chef node json file to use for this deploy.  It will take a
few minutes to run to completion.
