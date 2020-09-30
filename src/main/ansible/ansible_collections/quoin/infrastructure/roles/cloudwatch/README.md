# qi-cloudwatch

This is a reusable Ansible role that installs and sets up cloudwatch alarms for server status, disk usage and docker container status.

## Requirements

This playbook is set up assuming that you intend to monitor both disk usage and docker contianer status. If you are not doing either of
these things, the playbook will not run.

## Usage

Include the role in your Ansible `roles_path` either by git subtree (preferred) or ansible-galaxy (not recommended) and then add it to
your playbooks.

```
$ cd <Project directory>
$ git subtree add --prefix ansible/roles/qi-cloudwatch git@bitbucket.org:quoin/qi-cloudwatch.git master --squash`
```

### Variables

Below is a list of the ansible variables which must be defined for the role to run successfully:

1) project_name - This is the name of the docker project and is used to label and identify the project's docker containers.

2) qi_cloudwatch_environment_tag - This variable is one of the EC2 server tags that marks the project's servers as either for testing or
for production. Check the AWS console, but at time of writing, test servers use the value 'test' and production servers use 'production'.

3) qi_cloudwatch_project_tag - This variable is one of the EC2 server tags that marks the project's servers. As of the time of writing it
is standard Quoin procedure to tag a project's servers with "tag:{{Project Name}}: true". The variable should be the project name used in
the tag, and the first letter should be capitalized (e.g. 'Marketing', 'Redmine' etc..)

4) qi_cloudwatch_containers - This variable should be a list of the containers listed in the project's docker-compose.yml. It is used to
monitor that all of the docker containers are running as part of the cloudwatch metrics script. Regardless of the number of containers,
this should be stored as a YAML list:

```
qi_cloudwatch_containers:
- 'app'
- 'nginx'
```

5) qi_cloudwatch_mount_paths - This variable should be a list of the mount paths which are part of this project's deployment. It is used to
monitor the disk utilization of all of the mount paths as part of the cloudwatch metrics script. Regardless of the number of containers,
this should be stored as a YAML list:

```
qi_cloudwatch_containers:
- '/'
- '/ebs'
```

6) qi_cloudwatch_instance_type - This variable identifies the instance type of the EC2 instance(e.g. 't2.small', 'm4.large' etc...)

7) qi_cloudwatch_namespace - This variable identifies the namespace of the EC2 instance (e.g. 'QI/System' etc...), it connects cloudwatch
alarm with the metric sent to AWS.

### Playbook Integration

You should run this role *twice*, once locally at the top of your playbook using the following command:

```
- hosts: all
  connection: local
  gather_facts: no
  vars:
    ansible_python_interpreter: 'python'
  roles:
    - qi-cloudwatch
```

And once at the end of your list of remote hosts 
```
- hosts: all
  become: yes
  roles:
  - qi-docker
  - qi-python-virtualenv
  - myprojecy
  - qi-cloudwatch
```

Notice that you must also run the *qi-docker* and *qi-python-virtualenv* roles for the metrics to work properly.