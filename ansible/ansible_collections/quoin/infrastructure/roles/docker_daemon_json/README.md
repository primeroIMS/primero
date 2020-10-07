# qi-docker-daemon.json

This is a reusable Ansible role that configures the Docker `daemon.json` file.
By default this role will only enable the `journal` log driver.

## Usage

Include the role in your Ansible `roles_path` either by ansible-galaxy (preferred) or git subtree (not recommended) and then add it to your playbooks.

### Variables

The role can be customized with the following variable:

  qi\_docker\_daemon\_json\_content:
  : The content of the `daemon.json` file.
