# Primero Ansible

[TOC]

## TLDR

In order to deploy primero using anibsle you will first need to create an ansible `inventory.yml` file located at `ansible/inventory/inventory.yml`.
Below is example of what the file should look like, and there is also a templat file provided in the repo, `ansible/inventory/inventory.yml.template`.

                ---
                all:

                  hosts:
                    primero.example.com:
                      ansible_user: 'ubuntu'
                      primero_nginx_server_name: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_nginx_server_name }}'
                      certbot_email: 'primero-example@example.com'
                      cert_name: 'primero'
                      primero_github_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_nginx_server_name }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_certificate_name: '{{ cert_name }}'
                      nginx_ssl_cert_path: '/certs/cert.pem'
                      nginx_ssl_key_path: '/certs/key.pem'
                      primero_host: '{{ primero_nginx_server_name }}'

All these variables are required with the exception of `certbot_domain` and `certbot_email`.  These certbot variables are required only when using certbot.
Along with these variables the `nginx_ssl_cert_path` and `nginx_ssl_key_path` variables must be set to:

                nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'

Theses varibales sre defaulted to be set to the self-signed certs path.

The `build_docker_tag` and `build_docker_container_registry` can be left as `''`, which default to latest.  If you require a specific `build_docker_tag` and/or `build_docker_container_registry`,
then enter those values for these variables.

The developer must also make a file called `secrets.yml` in the `ansible` directory.

                $ cd ansible
                $ vim secrets.yml

The `secrets.yml` file will contain secrets for primero.  The following variables are required in the is file.  The secrets in this file require a
secure random number. To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

                ---
                primero_secret_key_base: 'generated_secret'
                primero_message_secret: 'generated_secret'
                postgres_password: 'generated_secret'
                devise_secret_key: 'generated_secret'
                devise_jwt_secret_key: 'generated_secret'

The variables in the `inventory.yml` along with the `secrets.yml` will also be used to make the `local.env` file for the dokcer-compose files.  
 
Deploy the primero app and run certbot by following the [Deploy](#markdown-header-deploy) section of this README.

### Bash `activate` Script

As a convenience for Bash users, there is an `activate` script which will setup the virtualenv, activate it in a subshell, add the `bin` directory to the `PATH`, and set the `ANSIBLE_CONFIG` environment variable.

                $ cd ansible
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

                (venv) cd ansible
                (venv) $ vi requirements.txt
                (venv) $ deactivate
                $ bin/setup
                $ . venv/bin/activate

#### Remove a Python Requirement

If you remove an existing requirement, deactivate the virtualenv (if it is actviated), remove the entire virtualenv directory, and run the `setup` script (or the `activate` script) again.
For example:

                (venv) cd ansible
                (venv) $ vi requirements.txt
                (venv) $ deactivate
                $ rm -fr virtualenv
                $ bin/setup
                $ . venv/bin/activate

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

                (venv) cd ansible
                (venv) $ vi requirements.yml
                (venv) $ deactivate
                $ bin/setup
                $ . venv/bin/activate

#### Remove an Ansible Role

If you remove an existing role, you can simple remove the role's directory from the `src/main/ansible/roles` directory.
For example

                (venv) cd ansible
                (venv) $ vi requirements.yml
                (venv) $ rm -fr roles/<rolename>

## Servers

The server infrastructure is managed by Ansible.
The general form of an Ansible command is as follows:

            (virtualenv) $ cd ansible
            (virtualenv) $ ansible-playbook -i <inventory> <playbook>

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

clone-primero-repo.yml
: This playbook will clone the primero github repo to the remote server.

application-primero.yml
: Deploy the Primero software.

certbot.yml
: Run certbot on the Primero site.

### Inventory

In order to deploy primero using anibsle you will first need to create an ansible `inventory.yml` file located at `ansible/inventory/inventory.yml`.
Below is example of what the file should look like, and there is also a templat file provided in the repo, `ansible/inventory/inventory.yml.template`.

            ---
                all:

                  hosts:
                    primero.example.com:
                      ansible_user: 'ubuntu'
                      primero_nginx_server_name: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_nginx_server_name }}'
                      certbot_email: 'primero-example@example.com'
                      cert_name: 'primero'
                      primero_github_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_nginx_server_name }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_certificate_name: '{{ cert_name }}'
                      nginx_ssl_cert_path: '/certs/cert.pem'
                      nginx_ssl_key_path: '/certs/key.pem'
                      primero_host: '{{ primero_nginx_server_name }}'

All these variables are required with the exception of `certbot_domain` and `certbot_email`.  These certbot variables are required only when using certbot.
The `docker_tag` and `docker_container_registry` can be left as `''`, which default to latest.  If you require a specific `docker_tag` and/or `docker_container_registry`,
then enter those values for these variables.

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

            $ cd ansible
            $ bin/activate

2.  Edit the Ansible inventory file and primero variables.  Refer to the [TLDR](#markdown-header-tldr) section for more info.

            (venv) $ vim inventory/inventory.yml

    
    The inventory file should include the primero server you want to deploy to, for example:

            ---
                all:

                  hosts:
                    primero.example.com:
                      ansible_user: 'ubuntu'
                      primero_nginx_server_name: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_nginx_server_name }}'
                      certbot_email: 'primero-example@example.com'
                      cert_name: 'primero'
                      primero_github_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_nginx_server_name }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_certificate_name: '{{ cert_name }}'
                      nginx_ssl_cert_path: '/certs/cert.pem'
                      nginx_ssl_key_path: '/certs/key.pem'
                      primero_host: '{{ primero_nginx_server_name }}'

3.  Create the `secrets.yml`.  Refer to the [TLDR](#markdown-header-tldr) section for more info.
           
            $ cd ansible
            $ vim secrets.yml

    The `secrets.yml` file will contain secrets for primero.  The following variables are required in the is file.  The secrets in this file require a
    secure random number. To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

            ---
            primero_secret_key_base: 'generated_secret'
            primero_message_secret: 'generated_secret'
            postgres_password: 'generated_secret'
            devise_secret_key: 'generated_secret'
            devise_jwt_secret_key: 'generated_secret'  

4.  Run the bootstrap playbook in order to install the basic system requirements.

           (venv) $ ansible-playbook bootstrap.yml

5.  Install Docker using the `install-docker.yml` playbook

           (venv) $ ansible-playbook install-docker.yml

6.  Clone the github primero repo to the remote server by running the `clone-primero-repo.yml` playbook.

           (venv) $ ansible-playbook clone-primero-repo.yml

7.  Deploy the primero application.  There are many options here.  You can build, configure, and start the containers.  You can also choose to just
run one of these or a combo of the three.  This is done using ansible tags.  If you run this playbook with no `--tags` then none these options real
run by default.  In order to run these options you must specify the tag associated with the option.  There is also an option, which should be used the
first time you create primeo, to crete the `local.env` file.  You must use the tag `local-env` to create this file, if this tag is not supplied then 
the `local.env` file will not be created.

    For building use tag `build`.
          
          (venv) $ ansible-playbook application-primero.yml --tags "build"

    For configuring use tag `configure`.

          (venv) $ ansible-playbook application-primero.yml --tags "configure"
        
    For starting use tag `start`.

          (venv) $ ansible-playbook application-primero.yml --tags "start"

    You can also to a combo of the three or run all three for example:

          (venv) $ ansible-playbook application-primero.yml --tags all

7.  If using certbot run the `certbot.yml` playbook.  Sometimes certbot won't work right away when the application is first deploy.  If certbot does fail, wait a couple
minutes and then just run the `certbot.yml` playbook again.

           (venv) $ ansible-playbook certbot.yml
