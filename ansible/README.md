# Primero Ansible

[TOC]

## TLDR
---
### Requirements
 - Python 3: MacOs requires python 3.9
 - Pip
 - Virtualenv
---
1.  Activate the python venv in order to run ansible.

            $ cd ansible
            $ bin/activate

2.  Edit the Ansible inventory file and primero variables.  Refer to the [Deploy](#markdown-header-deploy) section for more info.  Create a copy of the template file and modify to get started quickly.

            (venv) $ cp inventory/inventory.yml.temnplate inventory/inventory.yml
            (venv) $ vim inventory/inventory.yml


    The inventory file should include the Primero server you want to deploy to. You can refer to this [sample](inventory/inventory.yml.template) for further documentation.


3.  Create the `secrets.yml`.  Refer to the [Deploy](#markdown-header-deploy) section for more info.

            $ cd ansible
            $ vim secrets.yml

    The `secrets.yml` file will contain secrets necessary to run Primero. To generate a secure random secret you can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`. If you are deploying Primero  or a custom Primero configuration from a private Git repository, you will need to include the private SSH deployment key. If you are using a public Primero configuration,you may leave the variable `ssh_private_key` out of the secrets.yml file.

            ---
            primero_secret_key_base: 'generated_secret'
            primero_message_secret: 'generated_secret'
            postgres_password: 'generated_secret'
            devise_secret_key: 'generated_secret'
            devise_jwt_secret_key: 'generated_secret'
            ssh_private_key: |
            -----BEGIN RSA PRIVATE KEY-----
            klkdl;fk;lskdflkds;kf;kdsl;afkldsakf;kasd;f
            afdnfdsnfjkndsfdsjkfjkdsjkfjdskljflajdfjdsl
            -----END RSA PRIVATE KEY-----

4.  Run the bootstrap playbook in order to install the basic system requirements. This can be run once.

           (venv) $ ansible-playbook bootstrap.yml

5.  Install Docker using the `install-docker.yml` playbook. This can be run once.

           (venv) $ ansible-playbook install-docker.yml

6.  Stage secrets and instance specific environment variables. This can be run once, or whenever you are rotating secrets or changing other environment variables.

           (venv) $ ansible-playbook application-primero.yml --tags "local-env" -e @secrets.yml

7.  Deploy the Primero application.  There are many options here.  You can build, configure, and start the containers. This is done using Ansible tags. If you run this playbook with no `--tags` then none these options will run by default.

    For building locally use tag `build`. This is optional, and should not be used on Production environments. If you do not have locally built images, they will be pulled from Dockerhub.

          (venv) $ ansible-playbook application-primero.yml --tags "build"

    Configure Primero and apply the database schema using tag `configure`.

          (venv) $ ansible-playbook application-primero.yml --tags "configure"

    To (re)start the Primero service use tag `start`.

          (venv) $ ansible-playbook application-primero.yml --tags "start"

    You can also provide a combination. For example, to build, configure, deploy, and run the latest code:

          (venv) $ ansible-playbook application-primero.yml --tags build,configure,start

8.  Don't forget that you now have a `secrets.yml` file! Make sure that it's safely stored. Secret management is out of scope for the core Primero application devops.

9.  If using Certbot run the `certbot.yml` playbook.  Sometimes Certbot won't work right away when the application is first deployed. If Certbot does fail, wait a couple minutes and then just run the `certbot.yml` playbook again.

           (venv) $ ansible-playbook certbot.yml

## Devops details

### Bash `activate` Script

As a convenience for Bash users, there is an `activate` script which will setup the virtualenv, activate it in a subshell, add the `bin` directory to the `PATH`, and set the `ANSIBLE_CONFIG` environment variable.

                $ cd ansible
                $ bin/activate

You can deactivate this subshell virtualenv by exiting the shell.

                (venv) $ exit


### Servers

The server infrastructure is managed by Ansible. The general form of an Ansible command is as follows:

            (virtualenv) $ cd ansible
            (virtualenv) $ ansible-playbook -i <inventory> <playbook> [-l <server>]

Each `ansible-playbook` command will require an inventory and a playbook.
The inventory is the set of hosts managed by Ansible.
The playbook is the "script" that is run against the hosts in the inventory.

When new machines are added to the inventory they must first be provisioned with the "boostrap" playbook.
Refer to the [Bootstrap](#markdown-header-bootstrap) section for more details.

Unless the `-l <server>` parameter is used, the playbook will be applied to all servers in the inventory.

### Playbooks

bootstrap.yml
: This playbook is used to install the basic system requirements on servers in the inventory.
  See the [Bootstrap](#markdown-header-bootstrap) section for more details.

install-docker.yml
: This playbook will install new users to map to docker containers, install docker, create a users.env file, and
  synchronize the primero app files to the host machine

application-primero.yml
: Deploy and run (and optionally, first build) the Primero Docker containers.

certbot.yml
: Configure Certbot to run on the Primero site.

### Inventory

In order to deploy primero using Ansible you will first need to create an ansible `inventory.yml` file located at `ansible/inventory/inventory.yml`.
Below is example of what the file should look like. There is also a sample template file provided in the repo, `ansible/inventory/inventory.yml.template`.

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
                  use_lets_encrypt: 'true'
                  nginx_ssl_cert_path: '/etc/letsencrypt/live/primero/fullchain.pem'
                  nginx_ssl_key_path: '/etc/letsencrypt/live/primero/privkey.pem'
                  # If you want to seed from a private configuration repo
                  primero_configuration_repo: 'git@bitbucket.org:quoin/primero-x-configuration.git'
                  primero_configuration_repo_branch: 'master'
                  primero_configuration_path: 'directory/of/config/loader/script.rb'


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

### Secrets

Solving secret management is left up to the implementing team.

One naive way, is to create an environment file per server and keep it separate from your inventory file. DO NOT CHECK THIS FILE INTO SOURCE CONTROL! The developer can make a file called `secrets.yml` in the `ansible` directory.

                $ cd ansible
                $ vim secrets.yml

The `secrets.yml` file will contain secrets for Primero.  The following variables are required in the is file.  The secrets in this file require a secure random number. To generate, can use the command

```
LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"
```

You also have the option of creating a variable for a private ssh key in order to clone configuration files from a private repo.  If you will not be including the private ssh
key just leave the variable `ssh_private_key` out of the secrets.yml file.
                ---
                primero_secret_key_base: 'generated_secret'
                primero_message_secret: 'generated_secret'
                postgres_password: 'generated_secret'
                devise_secret_key: 'generated_secret'
                devise_jwt_secret_key: 'generated_secret'
                secret_environment_variables:
                  SMTP_USER: 'secret'
                  SMTP_PASSWORD: 'secret'
                ssh_private_key: |
                -----BEGIN RSA PRIVATE KEY-----
                klkdl;fk;lskdflkds;kf;kdsl;afkldsakf;kasd;f
                afdnfdsnfjkndsfdsjkfjkdsjkfjdskljflajdfjdsl
                -----END RSA PRIVATE KEY-----
                nginx_ssl_key: |
                -----BEGIN PRIVATE KEY-----
                klkdl;fk;lskdflkds;kf;kdsl;afkldsakf;kasd;f
                afdnfdsnfjkndsfdsjkfjkdsjkfjdskljflajdfjdsl
                -----END PRIVATE KEY-----
                nginx_ssl_cert: |
                -----BEGIN CERTIFICATE-----
                klkdl;fk;lskdflkds;kf;kdsl;afkldsakf;kasd;f
                afdnfdsnfjkndsfdsjkfjkdsjkfjdskljflajdfjdsl
                -----END CERTIFICATE-----

The variables in the `inventory.yml` along with the `secrets.yml` will also be used to make the `local.env` file for the dokcer-compose files.

The optional dictionary `secret_environment_variables` can contain key/value pairs of secret environment variables. It can be used in conjuunction with the optional `environment_variables` dictionary in the inventory file, and will override those values. A good use of this dictionary is to specify SMTP settings.

## Config promotion

In order to enable configuration promotion between two servers handled by ansible, you have to set some environment variables on the **demo** server, the one responsible to handle and sed the configuration to the production server.

```shell
  PRIMERO_SANDBOX_UI: 'true'
  PRIMERO_PROMOTE_CONFIG_PROD_TLS: 'true'
  PRIMERO_PROMOTE_CONFIG_PROD_PORT: '443'
  PRIMERO_PROMOTE_CONFIG_PROD_HOST: 'example.production.org'
  PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH: 'configuration_promotion:strongPassword1!'
```

1. `PRIMERO_SANDBOX_UI` Show the UI in Sandbox mode, this enable the config promotion option.

2. `PRIMERO_PROMOTE_CONFIG_PROD_TLS` and `PRIMERO_PROMOTE_CONFIG_PROD_PORT` variables required to stablish the connection between the current implementation
and the production site

3. `PRIMERO_PROMOTE_CONFIG_PROD_HOST` Target implementation, where the configuration will be applied

4. `PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH` This is a combination(separated by `:`) between a user production and its password. The exact environment variable, the user and the password needs to exist on the **production** implementation.
   To generate a strong password using:

   ```shell
    LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"
    ```

## Deploy external certs

To use an external cert on a primero deploy you need to add on the `secret.yml` file the follow entries:

1. `nginx_ssl_key`
2. `nginx_ssl_cert`

Also set on your inventory file the follow entries:

```shell
      use_lets_encrypt: 'false'
      use_external_certs: 'true'
      nginx_ssl_cert_path: '/external-certs/primero.crt'
      nginx_ssl_key_path: '/external-certs/primero.key'
```

Then recreate the local env file:

```shell
(venv) $ ansible-playbook application-primero.yml --tags "local-env" -e @secrets.yml
```

Copy the certs to the host using:

```shell
(venv) $ ansible-playbook external-certs.yml -e @secrets.yml
```

Finally restart the docker containers:

```shell
(venv) $ ansible-playbook application-primero.yml --tags start
```

## Replacing external certs

If nginx is already using external certs, to update the certs follow the next steps:

1. Copy over target server in the `/srv/primero/external-certs/` folder, the new key and cert.
2. Replace the existing key an cert with the new files.
3. Restart nginx docker container:

```shell
sudo docker restart primero_nginx_1
```
## Change letsencrypt domain

If you change your hostname and you want to update your letsencrypt certificate, you need to:

1. Update your `primero_host` on the inventory file.
2. Update your environment variables running

```
(venv) $ ansible-playbook application-primero.yml --tags "local-env" -e @secrets.yml
```

3. Run the certbot playbook

```
(venv) $ ansible-playbook certbot.yml
```

4. Restart all the containers
```
  ​(venv) $ ansible-playbook application-primero.yml --tags "start"
```
