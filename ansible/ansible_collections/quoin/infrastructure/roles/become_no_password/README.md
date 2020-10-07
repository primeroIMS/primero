# qi-become-no-password

This is a reusable Ansible role that allows Ansible to `become` root without having to enter a password.
It supports the Debian family (Debian, Raspbian, and Ubuntu), the RedHat family (CentOS, Fedora, and RedHat), and OpenBSD (version 6.0 and later.)

This role is not required for cloud-based images (e.g. AWS AMIs) since they generally have `sudo` configured so that it doesn't require a password.

## Usage

Include the role in your Ansible `roles_path` either by ansible galaxy (preferred) or git subtree (not recommended) and then add it to your playbooks.

This role is most useful as part of a bootstrap playbook.

            ---
            - hosts: 'all'
              gather_facts: no
              environment:
                PATH: '/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin'
              vars:
                ansible_become_method: 'su'
              roles:
              - 'qi-install-python2'

            - hosts: 'all'
              environment:
                PATH: '/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin'
              vars:
                ansible_become_method: 'su'
              roles:
              - 'qi-install-sudo'
              - 'qi-become-no-password'
              - 'qi-openssh-authorized_keys'
              - 'qi-openssh-passwordauthentication-no'

Run the bootstrap playbook with the `-k` and `-K` arguments and enter the root password.

            (virtualenv) $ ansible-playbook -k -K bootstrap.yml
