# qi-aws-iam-users
  
This is a reusable Ansible role that creates Users for an AWS account.

## Usage

Include the role in your Ansible `roles_path` either by ansible-galaxy (preferred) or git subtree (not recommended) and then add it to your playbooks.

### Variables

The role can be customized with the following variable:

  qi\_aws\_iam\_users
  : The list of Users for the AWS account.  The Users should be listed per the example below.  The role will not create any Users if this variable is unspecified.

Example:
  
    qi_aws_iam_users:
    - name: 'username'
      path: '/'
      tags:
        'Key': 'Value'
      groups:
      - 'Users'
      - 'Administrators'
