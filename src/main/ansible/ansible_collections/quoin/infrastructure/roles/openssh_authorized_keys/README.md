# qi-openssh-authorized\_keys

This is a reusable Ansible role that manages the SSH `authorized_keys` file.
The role dictates the entire contents of the `authorized_keys` file.
Only the keys for the users specified by the `qi_openssh_authorized_keys_users` will be included.
All other keys are removed.

_Warning_: While this role makes an heroic attempt at protecting you from mistakes it is still possible to lock yourself out of a system.
Consider opening SSH sessions to the inventory machines before you run this role.

## Usage

Include the role in your Ansible `roles_path` either by ansible-galaxy (preferred) or git subtree (not recommended) and then add it to your playbooks.

Add to your project a folder that contains SSH public keys.
The files in the folder must have the following structure:

            <folder>/<name>/id_<format>.pub

The default value for `<folder>` is `{{ playbook_dir }}/../ssh`.
This is parallel to the Ansible playbook folder.
It can be changed by a configuration variable.

`<format>` is one of:

  * dsa
  * ecdsa
  * ed25519
  * rsa

Of those you should only ever use `ed25519` (preferred, but not all systems have an OpenSSH new enough to use this format) or `rsa` (use only for legacy systems.)

An example folder structure might look like this:

            ansible/...
            ssh/
            ssh/alice/id_ed25519.pub
            ssh/alice/id_rsa.pub
            ssh/bob/id_ed25519.pub
            ssh/bob/id_rsa.pub


Add inventory variables (either `group_vars` or `host_vars`) to set the list of users and the key format.

            ---
            qi_openssh_authorized_keys_format: 'ed25519'
            qi_openssh_authorized_keys_users:
            - 'alice'
            - 'bob'

The role should be included in all playbooks (including a bootstrap playbook.)
By convention there should also be a playbook named `authorized_keys.yml` that includes only this role.
This playbook will be used to change access to the project's inventory without making any other changes.

            ---
            - hosts: all
              roles:
              - 'qi-openssh-authorized_keys'

Run the `authorized_keys` playbook to grant or revoke access.

            (virtualenv) $ ansible-playbook authorized_keys.yml

Given the example configuration above the role would set the `authorized_keys` file to contain *only* Alice's and Bob's ed25519 SSH public keys.
Any other entries would be purged.

### Variables

The role can be customized by several variables:

  qi\_openssh\_authorized\_keys\_format
  : The SSH public key format.
    This must be one of `dsa`, `ecdsa`, `ed25519`, or `rsa`.

  qi\_openssh\_authorized\_keys\_users
  : The list of users whose keys will be installed.

  qi\_openssh\_authorized\_keys\_user
  : The remote user for whom the `authorized_keys` file will be changed.
    If this is not the current Ansible user (the default) then the role will need to be executed with `become: yes`.
    (Default: `{{ ansible_user_id }}`)

  qi\_openssh\_authorized\_keys\_folder
  : The project folder which contains the SSH public keys.
    (Default: `{{ playbook_dir }}/../ssh`)

### Safety Checks

The role attempts to prevent a complete lockout from your system.

* It checks that at least one user has been listed in `qi_openssh_authorized_keys_users`.

* It checks that the `qi_openssh_authorized_keys_format` is valid (one of `dsa`, `ecdsa`, `ed25519`, or `rsa`.)

* It checks that the OpenSSH daemon supports the specified key format.
  This check is based simply on considering the version installed against the OpenSSH release notes.
  It doesn't consider any custom build changes introduced by distribution packaging nor local configuration changes (i.e. disabling a particular algorithm in `sshd_config`.)
