# Primero Ansible

[TOC]

## TLDR

Deploy the primero app and run certbot by following the [Deploy](#markdown-header-deploy) section of this README.

### Bash `activate` Script

As a convenience for Bash users, there is an `activate` script which will setup the virtualenv, activate it in a subshell, add the `bin` directory to the `PATH`, and set the `ANSIBLE_CONFIG` environment variable.

                $ bin/activate

You can deactivate this subshell virtualenv by exiting the shell.

                (venv) $ exit


### pip `requirements.txt`

The `setup` script (or the `activate` script) will use `pip` to install Python modules into the virtualenv.
The modules that `pip` installs are listed in the `requirements.txt` file.
For example:

                ansible==2.10.0
                boto3==1.15.7
                boto==2.49.0

#### Update or Install a New Python Requirement

If you add a new requirement or update an existing requirement, deactivate the virtualenv (if it is activated) and run the `setup` script (or the `activate` script) again.
For example:

                (venv) $ vi requirements.txt
                (venv) $ deactivate
                $ bin/setup
                $ . virtualenv/bin/activate

#### Remove a Python Requirement

If you remove an existing requirement, deactivate the virtualenv (if it is actviated), remove the entire virtualenv directory, and run the `setup` script (or the `activate` script) again.
For example:

                (venv) $ vi requirements.txt
                (venv) $ deactivate
                $ rm -fr virtualenv
                $ bin/setup
                $ . virtualenv/bin/activate

### ansible-galaxy `requirements.yml`

The `setup` script (or the `activate` script) will use `ansible-galaxy` to install Ansible roles into the `src/main/ansible/roles` directory and
Ansible collections into the `src/main/ansible/ansible_collections`.
The roles and collections that `ansible-galaxy` installs are listed in the `src/main/ansible/requirements.yml` file.
For example:

                ---
                collections:
                - name: 'git@bitbucket.org:quoin/ansible-infrastructure.git#quoin/infrastructure'
                  version: 'master'
                
                roles:
                - name: 'qi-install-docker'
                  src: 'git+ssh://git@bitbucket.org/quoin/qi-install-docker.git'

#### Update or Install a New Ansible Role

If you add a new role/collection or update an existing role/collection, deactivate the virtualenv (if it is activated) and run the `setup` script (or the `activate` script) again.
For example:

                (virtualenv) $ vi src/main/ansible/requirements.yml
                (virtualenv) $ deactivate
                $ bin/setup
                $ . virtualenv/bin/activate

#### Remove an Ansible Role

If you remove an existing role, you can simple remove the role's directory from the `src/main/ansible/roles` directory.
For example

                (virtualenv) $ vi src/main/ansible/requirements.yml
                (virtualenv) $ rm -fr src/main/ansible/roles/<rolename>

## Servers

The server infrastructure is managed by Ansible.
The general form of an Ansible command is as follows:

            (virtualenv) $ cd ansible
            (virtualenv) $ awsu -p <primero-profile> -- ansible-playbook -i <inventory> <playbook>

Each `ansible-playbook` command will require an inventory and a playbook.
The inventory is the set of hosts managed by Ansible.
The playbook is the "script" that is run against the hosts in the inventory.

When new machines are added to the inventory they must first be provisioned with the "boostrap" playbook.
Refer to the [Bootstrap](#markdown-header-bootstrap) section for more details.

### Playbooks

bootstrap.yml
: This playbook is used to install the basic system requirements onto the inventory.
  See the [Bootstrap](#markdown-header-bootstrap) section for more details.

install-docker.yml
: This playbook will install new users to map to docker containers, install docker, create a users.env file, and
  synchronize the primero app files to the host machine

application-primero.yml
: Deploy the Primero software and run certbot.

certbot.yml
: Run certbot on the Primero site.

### Inventory

There are two types of inventory: static and dynamic.
A static inventory is a simple file that enumerates the host names (or IP addresses) of servers.
A dynamic inventory is a script that produces a JSON inventory.
An example of dynamic inventory is the Ansible [ec2.py](https://github.com/ansible/ansible/blob/devel/contrib/inventory/ec2.py) dynamic inventory script for AWS.

The Ansible commands in this document require an inventory argument (`-i`.)
The inventory argument can either refer to:

  * a static inventory file
  * a dynamic inventory script
  * a directory containing an arbitrary mixture of static inventory files and dynamic inventory scripts

This project contains two inventory directories, one for the production servers, and a second one for the test servers.
Pass either `inventory/prod/` or `inventory/test/` to Ansible using the `-i` flag.
Take care to not pass `inventory/` as this will deploy the software to both environments (which is probably not what you want.)

inventory/prod/
: The production inventory.

inventory/test/
: The test inventory.

### Bootstrap

The bootstrap process installs the basic system requirements onto the inventory.
It only needs to be run once against any piece of inventory (although it is safe, but unnecessary, to run again.)

1.  Run the Ansible "bootstrap" playbook.

    If the inventory is configured to use SSH keys for authentication you do not need to specify any special arguments to the `ansible-playbook` command.
    This is the default for cloud images.

            (virtualenv) $ cd ansible
            (virtualenv) $ ansible-playbook -i <inventory> bootstrap.yml

    If the inventory is configured to use password use password authentication you must pass the `-k` and `-K` arguments to the `ansible-playbook` command so that Ansible will prompt for passwords.
    (Disable password authentication in favor of SSH keys as soon as possible.)

            (virtualenv) $ cd ansible
            (virtualenv) $ ansible-playbook -i <inventory> bootstrap.yml -k -K

    You may also wish to limit the inventory against which the playbook runs by using `ansible-playbook`'s `-l` argument.

    The bootstrap playbook disables SSH host key checking due to an unresolved bug in Ansible ([#25068](https://github.com/ansible/ansible/issues/25068)).

## Deploy

1.  Activate the python venv in order to run ansible.

            $ cd ../
            $ bin/activate

2.  Edit the Ansible inventory file and primero variables.

            (venv) $ cd ansible
            (venv) $ vim inventory/inventory.yml

    
   The inventory file should include the primero server you want to deploy to, for example:

            ---
            all:

              hosts:
                primero-example.cloud.quoininc.com:

              children:

                primero:
                  hosts:
                    primero-example.cloud.quoininc.com:
            
   Next edit the variable `primero_nginx_server_name` in the `group_vars/primero/vars.yml` file, for example:

            (venv) $ vim group_vars/primero/vars.yml

            ---
            primero_nginx_server_name: 'primero-example.cloud.quoininc.com'

3.  Edit the local.env to include the primero server you are deploying to.  Follow docker README.md for specific meaning
of these environment variables, but specifically for this README edit the `LETS_ENCRYPT_DOMAIN`, `NGINX_CERTIFICATE_NAME`,
and `PRIMERO_HOST` variables.

            (venv) $ cd ../docker
            (venv) $ vim local.env

   The variables should look as follows:

            LETS_ENCRYPT_DOMAIN=primero-example.cloud.quoininc.com
            NGINX_CERTIFICATE_NAME=primero-example.cloud.quoininc.com
            PRIMERO_HOST=primero-example.cloud.quoininc.com

4.  Run the bootstrap playbook in order to install the basic system requirements.

           (venv) $ cd ../ansible
           (venv) $ ansible-playbook bootstrap.yml

5.  Deploy the primero application.

           (venv) $ ansible-playbook application-primero.yml

6.  Sometimes certbot won't work right away when the application is first deploy.  If certbot does fail, wait a couple
minutes and then just run certbot by running the certbot.yml playbook.

           (venv) $ ansible-playbook certbot.yml
