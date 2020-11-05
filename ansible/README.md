# Primero Ansible

[TOC]

## TLDR

1.  Activate the python venv in order to run ansible.

            $ cd ansible
            $ bin/activate

2.  Edit the Ansible inventory file and primero variables.  Refer to the [Deploy](#markdown-header-deploy) section for more info.

            (venv) $ vim inventory/inventory.yml


    The inventory file should include the primero server you want to deploy to, for example:

            ---
                all:

                  hosts:
                    primero.example.com:
                      ansible_user: 'ubuntu'
                      primero_host: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_host }}'
                      certbot_email: 'primero-example@example.com'
                      primero_repo_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_host }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                      nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'
                      primero_nginx_server_name: '{{ primero_host }}'
                      primero_configuration_repo: 'git@bitbucket.org:quoin/primero-x-configuration.git'
                      primero_configuration_repo_branch: 'master'
                      configuration_path: ''

3.  Create the `secrets.yml`.  Refer to the [Deploy](#markdown-header-deploy) section for more info.

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
the `local.env` file will not be created.  If you are creating the `local.env` you must have created the `secrets.yml` file.  In order to get the playbook
to detect the variables in the `secrets.yml` file you must supply it via the command line when running the ansible-playbook with `-e` or `--extra-vars` flag, and
the file name.  So, add `-e @secrets.yml` or `--extra-vars @secrets.yml` to the ansible-playbook command.

    For building use tag `build`.

          (venv) $ ansible-playbook application-primero.yml --tags "build"

    For configuring use tag `configure`.

          (venv) $ ansible-playbook application-primero.yml --tags "local-env,configure" -e @secrets.yml

    For starting use tag `start`.

          (venv) $ ansible-playbook application-primero.yml --tags "local-env,start" -e @secrets.yml

    You can also to a combo of the three or run all three for example:

          (venv) $ ansible-playbook application-primero.yml --tags all

8.  If a `secrets.yml` file was created, after you are done deploying primero then delete this file.

9.  If using certbot run the `certbot.yml` playbook.  Sometimes certbot won't work right away when the application is first deploy.  If certbot does fail, wait a couple
minutes and then just run the `certbot.yml` playbook again.

           (venv) $ ansible-playbook certbot.yml

### Bash `activate` Script

As a convenience for Bash users, there is an `activate` script which will setup the virtualenv, activate it in a subshell, add the `bin` directory to the `PATH`, and set the `ANSIBLE_CONFIG` environment variable.

                $ cd ansible
                $ bin/activate

You can deactivate this subshell virtualenv by exiting the shell.

                (venv) $ exit


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
                      primero_host: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_host }}'
                      certbot_email: 'primero-example@example.com'
                      primero_repo_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_host }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                      nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'
                      primero_nginx_server_name: '{{ primero_host }}'
                      primero_configuration_repo: 'git@bitbucket.org:quoin/primero-x-configuration.git'
                      primero_configuration_repo_branch: 'master'
                      configuration_path: ''

All these variables are required with the exception of `certbot_domain` and `certbot_email`.  These certbot variables are required only when using certbot.
The `build_docker_tag` and `build_docker_container_registry` can be left as `''`, which default to latest.  If you require a specific `build_docker_tag` and/or `build_docker_container_registry`,
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

### Deploy

In order to deploy primero using anibsle you will first need to create an ansible `inventory.yml` file located at `ansible/inventory/inventory.yml`.
Below is example of what the file should look like, and there is also a templat file provided in the repo, `ansible/inventory/inventory.yml.template`.

                ---
                all:

                  hosts:
                    primero.example.com:
                      ansible_user: 'ubuntu'
                      primero_host: 'primero.example.com'
                      certbot_domain:
                      - '{{ primero_host }}'
                      certbot_email: 'primero-example@example.com'
                      primero_repo_branch: 'master'
                      build_docker_tag: ''
                      build_docker_container_registry: ''
                      primero_tag: 'latest'
                      lets_encrypt_domain: '{{ primero_host }}'
                      lets_encrypt_email: '{{ certbot_email }}'
                      use_lets_encrypt: 'false'
                      nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                      nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'
                      primero_nginx_server_name: '{{ primero_host }}'
                      primero_configuration_repo: 'git@bitbucket.org:quoin/primero-x-configuration.git'
                      primero_configuration_repo_branch: 'master'
                      configuration_path: ''

All these variables are required with the exception of `certbot_domain` and `certbot_email`.  These certbot variables are required only when using certbot.
Along with these variables the `nginx_ssl_cert_path` and `nginx_ssl_key_path` variables must be set to:

                nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'

Theses varibales sre defaulted to be set to the letsencrypt certs path.  If you to set them to the self-signed certs path they must be set to:

                nginx_ssl_cert_path: '/certs/cert.pem'
                nginx_ssl_key_path: '/certs/key.pem'

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

Deploy the primero app and run certbot by following the [TLDR](#markdown-header-tldr) section of this README.

