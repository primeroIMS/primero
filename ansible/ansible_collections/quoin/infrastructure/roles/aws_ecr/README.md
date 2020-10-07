# qi-aws-ecr

This is a reusable Ansible role that obtains an authentication token for AWS ECR.

## Usage

Include the role in your Ansible `roles_path` either by ansible-galaxy (preferred) or git subtree (not recommended) and then add it to your playbooks.

### Variables

The role can be customized with the following variable:

  aws\_ecr\_region
  : The name of the AWS region. The role will use your default AWS region if this variable is unspecified.
