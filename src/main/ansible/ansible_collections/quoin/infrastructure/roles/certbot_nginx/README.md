# qi-certbot-nginx

This is a reusable Ansible role that installs a certbot script to automatically renew an application cert.

## Requirements

This playbook is set up assuming that you are using a docker setup with nginx as the web server. If either of these assumptions is not
true, the role will *NOT* work.

## Usage

Include the role in your Ansible `roles_path` either by git subtree (preferred) or ansible-galaxy (not recommended) and then add it to
your playbooks.

```
$ cd <Project directory>
$ git subtree add --prefix ansible/roles/qi-certbot-nginx git@bitbucket.org:quoin/qi-certbot-nginx.git master --squash`
```

### Variables

Below is a list of the ansible variables which must be defined for the role to run successfully:

1) qi_certbot_nginx_webroot - This variable denotes the webroot being used in the application for certbot challenges. Certbot will place a
folder called 'letsencrypt' in this folder with the appropriate challenge response inside. 

Example:
If you set *qi_certbot_nginx_webroot* to */var/www* (recommended), then in your nginx conf file you designate the challenge location as:

```
location /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
}
```

2) qi_certbot_nginx_hostname - This variable is just the hostname of your application.

3) project_name - This is the name of the docker project and is used to label and identify the project's docker containers.

For an added layer of stability, the certbot ssl certificate and keys are designated to always be
stored in a folder named after this variable.

Example:
If you set *project_name* to *quoinmkt*, then you should have the following lines in your conf file:

```
  ssl_certificate /etc/letsencrypt/live/quoinmkt/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/quoinmkt/privkey.pem;
```

4) qi_certbot_nginx_email - Set this to whatever email you want to be associated with this projects ssl certification.

### Docker Volumes

The certbot script is able to put the certs and challenges in the right place, only by sharing volumes with the nginx container. You will
need to add two containers to your docker-compose file, for use by the script. They also have the advantage of ensuring the certificates
stay in place even if the container fails:

The nginx container should have the following lines:

```
nginx:
  volumes:
    - qi-certbot-certs:/etc/letsencrypt
    - qi-certbot-challenges:/var/www
```

The bottom of the docker-compose file should define containers:
```
volumes:
  qi-certbot-challenges:
    external: true
  qi-certbot-certs:
    external: true
```

### Playbook Placement

The best place to palce the role is immediatley *before* the main role building and starting your docker
containers. If that is not possible, you should place this role after the qi-docker role, as this script has dependencies on qi-docker.


### Project Role Modifications

Nginx can be fragile with regard to ssl certs. If you specify an ssl_certificate and an
ssl_certificate_key in the conf file, then nginx will fail to start if it does not see the specified
files, however the site needs to be running for certbot to perform its cert challenge and add the ssl files.

At time of writing, the way Quoin deals with this problem is to have 2 conf files, one which specifies
the ssl_certificate and ssl_certificate_key and one that does not, only one of which is used.
Add logic to the nginx container's `entrypoint` to only load the ssl conf file if the path to the ssl
certificate exists.

This also requires a couple additional step be added to the ansible deployment as follows:

```
### This should already exists in project
-name: Start containers
# Ansible task to start project

### Below here is code that should be added to the project
- name: Create initial cert
  command: "/opt/docker/virtualenv/bin/python /bin/certbot.py --webroot='{{ qi_certbot_nginx_webroot }}' --email='{{ qi_certbot_nginx_email }}' --hostname='{{ qi_certbot_nginx_hostname }}' --project_name='{{ project_name }}'"

-name: Stop containers
# Ansible task to stop project

-name: Start containers to activate cert
# Ansible task to restart containers, activating the cert
```

Technically the above code is only necessary on the first deploy to a server, as the cert should
already exist on subsequent, even if it is expired. But it is simpler to just add these steps to then
normal deploy process
