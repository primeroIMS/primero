#! /usr/bin/env python3

# Copyright (c) 2017 Ansible Project
# GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

from ansible.module_utils.aws.core import AnsibleAWSModule
from ansible.module_utils.ec2 import camel_dict_to_snake_dict

try:
    from botocore.exceptions import ClientError, ParamValidationError
except ImportError:
    pass  # handled by AnsibleAWSModule

TEST_TAG = {'Key': 'Test', 'Value': 'qi_iam_user_test'}


def create_or_update_users(connection, module):

    # Create lists for returned data
    users_meta_data = []
    users_changed_data = []
    users = module.params.get('users')

    # Loop through the users in the list supplied to this module and update or create them as necessary
    for user in users:
        (changed, meta) = create_or_update_user(connection, user, module)
        name = user.get('name')
        user_data = f'{name} Data: {meta}'
        user_changed = f'{name} Created/Update Changed: {changed}'
        users_meta_data.append(user_data)
        users_changed_data.append(user_changed)
        (user_removed_changed, user_added_changed) = set_user_groups(connection, module, user)
        users_changed_data.append(user_removed_changed)
        users_changed_data.append(user_added_changed)

    return(users_changed_data, users_meta_data)


def create_or_update_user(connection, new_user, module):

    params = dict()
    params['UserName'] = new_user.get('name')
    params['Path'] = new_user.get('path')
    new_tags_format = []
    tags = new_user.get('tags')
    for key in tags.keys():
        value = tags.get(key)
        new_tag = {'Key': key, 'Value': value}
        new_tags_format.append(new_tag)
    params['Tags'] = new_tags_format
    changed = False

    # Get user
    user = get_user(connection, module, params['UserName'])

    # If user is None, create it
    if user is None:
        # Check mode means we would create the user
        if module.check_mode:
            changed = True
            iam_user = 'check_mode'
            return (changed, iam_user)
        try:
            user = connection.create_user(**params)
            changed = True
        except ClientError as e:
            module.fail_json_aws(e, msg='Unable to create user')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg='Unable to create user')
        iam_user = camel_dict_to_snake_dict(user)
        return (changed, iam_user)

    # If user exists and needs updating of tags, then update it
    else:
        # Check mode means we would update the user
        if module.check_mode:
            changed = True
            iam_user = 'check_mode'
            return (changed, iam_user)
        try:
            new_tags_param = dict()
            new_tags_param['UserName'] = new_user.get('name')
            if 'Tags' in user.get('User'):
                old_tags_param = dict()
                old_tags_param['UserName'] = new_user.get('name')
                old_user_tags_keys = []
                for tag in user.get('User').get('Tags'):
                    old_user_tags_keys.append(tag.get('Key'))
                old_tags_param['TagKeys'] = old_user_tags_keys
                connection.untag_user(**old_tags_param)
            new_tags_param['Tags'] = new_tags_format
            connection.tag_user(**new_tags_param)
            changed = True
        except ClientError as e:
            module.fail_json_aws(e, msg='Unable to change user tag')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg='Unable to change user tags')

    # If user exists and needs updating of the path, then update it
    if user.get('User').get('Path') != new_user.get('path'):
        # Check mode means we would update the user
        if module.check_mode:
            changed = True
            iam_user = 'check_mode'
            return (changed, iam_user)
        try:
            path_param = dict()
            path_param['UserName'] = new_user.get('name')
            path_param['NewPath'] = new_user.get('path')
            connection.update_user(**path_param)
            changed = True
        except ClientError as e:
            module.fail_json_aws(e, msg='Unable to update user')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg='Unable to update user')

    # Get the user again
    user = get_user(connection, module, params['UserName'])
    iam_user = camel_dict_to_snake_dict(user)

    return (changed, iam_user)


def compare_users(connection, module):

    changed = False

    # Get the users supplied to this module and the current list of users in AWS
    new_users = module.params.get('users')
    old_users = get_users(connection)
    # Convert to sets for easy comparison
    new_users_names = set()
    old_users_names = set()
    for user in new_users:
        name = user.get('name')
        new_users_names.add(name)
    for user in old_users.get('Users'):
        name = user.get('UserName')
        old_users_names.add(name)

    # Get the users to delete by find the difference between the current users in AWS and the users supplied to this module
    users_to_delete = old_users_names.difference(new_users_names)

    # Check if the users to delete is zero, if not zero then delete the users
    if len(users_to_delete) != 0:
        (changed, meta) = delete_users(connection, module, users_to_delete)
    else:
        meta = 'no users deleted'

    return (changed, meta)


def delete_users(connection, module, users_to_delete):

    # Create lists for returned data
    users_meta_data = []
    users_changed_data = []

    # Loop through the users to delete and delete the user
    for user in users_to_delete:
        print(user)
        (changed, meta) = destroy_user(connection, module, user)
        user_changed = f'{user} Deleted: {changed}'
        users_meta_data.append(meta)
        users_changed_data.append(user_changed)

    return (users_changed_data, users_meta_data)


def destroy_user(connection, module, user):

    params = dict()
    params['UserName'] = user
    changed = False
    iam_user = ''

    # Get the user to delete
    user_to_delete = get_user(connection, module, params['UserName'])

    # Try deleting the user if that user exists
    if user_to_delete:

        # Check mode means we would remove this user
        if module.check_mode:
            changed = True
            iam_user = 'check_mode'
            return (changed, iam_user)

        # Remove any attached policies otherwise deletion fails
        try:
            for policy in get_attached_policy_list(connection, module, params['UserName']):
                connection.detach_user_policy(UserName=params['UserName'], PolicyArn=policy['PolicyArn'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to detach policy {policy['PolicyArn']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to detach policy {policy['PolicyArn']} from user {user}")

        # Remove any Login Profiles from the user before deleting
        try:
            connection.delete_login_profile(UserName=user)
        except ClientError as e:
            module.fail_json_aws(e, msg=f'Unable to delete login profile from user {user}')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f'Unable to delete login profile from user {user}')

        # Remove any Access Keys from the user before deleting
        try:
            for key in get_access_keys(connection, module, user):
                connection.delete_access_key(UserName=user, AccessKeyId=key['AccessKeyId'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete access key {key['AccessKeyId']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete access key {key['AccessKeyId']} from user {user}")

        # Remove any signing certificates from the user before deleting
        try:
            for cert in get_signing_certificates(connection, module, user):
                connection.delete_signing_certificate(UserName=user, CertificateId=cert['CertificateId'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete signing certificate {cert['CertificateId']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete signing certificate {cert['CertificateId']} from user {user}")

        # Remove any ssh public keys from the user before deleting
        try:
            for key in get_ssh_keys(connection, module, user):
                connection.delete_ssh_public_key(UserName=user, SSHPublicKeyId=key['SSHPublicKeyId'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete ssh public key {key['SSHPublicKeyId']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete ssh public key {key['SSHPublicKeyId']} from user {user}")

        # Remove any service specific credentials from the user before deleting
        try:
            for cred in get_service_specific_credentials(connection, module, user):
                connection.delete_service_specific_credential(UserName=user, ServiceSpecificCredentialId=cred['ServiceSpecificCredentialId'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete service specific credential {cred['ServiceSpecificCredentialId']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete service specific credential {cred['ServiceSpecificCredentialId']} from user {user}")

        # Remove any mfa devices from the user before deleting
        try:
            for mfa in get_mfa_devices(connection, module, user):
                connection.delete_virtual_mfa_device(SerialNumber=mfa['SerialNumber'])
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete mfa device {mfa['SerialNumber']} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete mfa device {mfa['SerialNumber']} from user {user}")

        # Remove any inline user policies from the user before deleting
        try:
            for policy in get_user_policies(connection, module, user):
                connection.delete_user_policy(UserName=user, PolicyName=policy)
        except ClientError as e:
            module.fail_json_aws(e, msg=f"Unable to delete inline user policy {policy} from user {user}")
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f"Unable to delete inline user policy {policy} from user {user}")

        # Remove the user from groups they belong to
        response = get_groups_for_user(connection, module, user)
        if response is None:
            pass
        else:
            # Loop through the current groups this user belongs to and remove them from the group
            for group in response.get('Groups'):
                groupname = group['GroupName']
                changed = remove_user_from_group(connection, module, user, groupname)

        # Try deleting the user
        try:
            connection.delete_user(**params)
            iam_user = f'user {user} has been deleted'
            changed = True
        except ClientError as e:
            module.fail_json_aws(e, msg=f'Unable to delete user {user}')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f'Unable to delete user {user}')

    elif module.check_mode:
        iam_user = 'check_mode'
        return (changed, iam_user)

    else:
        iam_user = f'failed to delete User: {user}'

    return (changed, iam_user)


def get_users(connection):

    try:
        return connection.list_users()
    except ClientError as e:
        module.fail_json_aws(e, msg='Unable to list users')
    except ParamValidationError as e:
        module.fail_json_aws(e, msg='Unable to list users')


def get_user(connection, module, name):

    params = dict()
    params['UserName'] = name

    try:
        return connection.get_user(**params)
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(e, msg=f'Unable to get user {name}')


def compare_current_user(sts_connection, module):

    # Get the current user running this ansible module to ensure they don't delete themselves form AWS
    current_user = get_current_user(sts_connection)
    usernames_list = []
    users = module.params.get('users')

    for user in users:
        name = user.get('name')
        usernames_list.append(name)

    # Check if the current user is not in the list of users for this module, and if it isn't fail the module to prevent deletion.
    if current_user not in usernames_list:
        module.fail_json(msg=f'Unable to delete the current user making this call: {current_user}')


def get_current_user(sts_connection):

    # Get the current user running this module
    user = sts_connection.get_caller_identity()
    arn = user.get('Arn')
    print(user)
    scheme, partition, service, region, account_id, rest = arn.split(':', 6)
    resource_type, resource = rest.split('/', 2)

    return resource


def set_user_groups(connection, module, user):
    """
    find users current groups and users update groups, 
    compute the difference between the two sets of groups
    and do add and remove action according to the difference
    """
    
    # Create lists for returned data
    user_removed_changed = []
    user_added_changed = []
    name = user.get('name')
    response = get_groups_for_user(connection, module, name)
    
    added = set()
    removed = set()
    updated_groups = set()
    
    # get the current groups for user
    cg = response.get('Groups') 
    # get the updated groups for user
    ug = user.get('groups') 

    current_groups = set([ g['GroupName'] for g in cg ])

    if ug is None:
        removed = current_groups
    else:
        updated_groups = set(ug)
        removed = current_groups - updated_groups
        added = updated_groups - current_groups

    if current_groups != updated_groups:
        for group in added:
            changed = add_user_to_group(connection, module, name, group)
            group_changed = f'{name} Added To {group} Changed: {changed}'
            user_added_changed.append(group_changed)   
        for group in removed:
            groupname = group 
            changed = remove_user_from_group(connection, module, name, groupname)
            group_changed = f'{name} Removal From {groupname} Changed: {changed}'
            user_removed_changed.append(group_changed)

    return (user_removed_changed, user_added_changed) 


def get_group(connection, module, groupname):

    params = dict()
    params['GroupName'] = groupname

    try:
        return connection.get_group(**params)
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(e, msg=f'Unable to get group {groupname}')


def get_groups_for_user(connection, module, name):

    if module.check_mode:
        return None

    params = dict()
    params['UserName'] = name

    # Get the list of groups this user belongs to
    try:
        return connection.list_groups_for_user(**params)
    except ClientError as e:
        module.fail_json_aws(e, msg='Unable to list groups')
    except ParamValidationError as e:
        module.fail_json_aws(e, msg='Unable to list groups')


def remove_user_from_group(connection, module, username, groupname):

    params = dict()
    params['GroupName'] = groupname
    params['UserName'] = username
    changed = False

    # Check mode means we would remove the user from the group
    if module.check_mode:
        changed = True
        return changed

    # Try to remove the user from the group
    try:
        connection.remove_user_from_group(**params)
        changed = True
    except ClientError as e:
        module.fail_json_aws(e, msg=f'Unable to delete user {username} from group {groupname}')
    except ParamValidationError as e:
        module.fail_json_aws(e, msg=f'Unable to delete user {username} from group {groupname}')

    return changed


def add_user_to_group(connection, module, username, groupname):

    changed = False

    # Get group
    group = get_group(connection, module, groupname)

    # Check if the group returned exists, if it does add the user to this group
    if group is None:
        module.fail_json_aws(None, msg=f'Group: {groupname} does not exist')
    else:
        if module.check_mode:
            changed = True
            return changed
        try:
            params = dict()
            params['GroupName'] = groupname
            params['UserName'] = username
            connection.add_user_to_group(**params)
            changed = True
        except ClientError as e:
            module.fail_json_aws(e, msg=f'Unable to add user {username} to group {groupname}')
        except ParamValidationError as e:
            module.fail_json_aws(e, msg=f'Unable to add user {username} to group {groupname}')

    return changed


def get_attached_policy_list(connection, module, name):

    try:
        return connection.list_attached_user_policies(UserName=name)['AttachedPolicies']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get policies for user {name}')

def get_access_keys(connection, module, name):

    try:
        return connection.list_access_keys(UserName=name)['AccessKeyMetadata']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get access keys for user {name}')

def get_signing_certificates(connection, module, name):

    try:
        return connection.list_signing_certificates(UserName=name)['Certificates']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get signing certificates for user {name}')

def get_ssh_keys(connection, module, name):

    try:
        return connection.list_ssh_public_keys(UserName=name)['SSHPublicKeys']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get ssh public keys for user {name}')

def get_service_specific_credentials(connection, module, name):

    try:
        return connection.list_service_specific_credentials(UserName=name)['ServiceSpecificCredentials']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get service specific credentials for user {name}')

def get_mfa_devices(connection, module, name):

    try:
        return connection.list_mfa_devices(UserName=name)['MFADevices']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get mfa devices for user {name}')

def get_user_policies(connection, module, name):

    try:
        return connection.list_user_policies(UserName=name)['PolicyNames']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchEntity':
            return None
        else:
            module.fail_json_aws(msg=f'Unable to get inline user policies for user {name}')

def main():

    argument_spec = dict(
        users=dict(type='list', default=None, required=True)
    )

    module = AnsibleAWSModule(
        argument_spec=argument_spec,
        supports_check_mode=True
    )

    iam_connection = module.client('iam')
    sts_connection = module.client('sts')

#    compare_current_user(sts_connection, module)
    (users_changed_data, meta_create_update) = create_or_update_users(iam_connection, module)
    (users_deleted_data, meta_delete) = compare_users(iam_connection, module)

    module.exit_json(create_update_changed=users_changed_data, delete_changed=users_deleted_data, iam_users_create_update_data=meta_create_update, iam_users_delete_data=meta_delete)


if '__main__' == __name__:
    main()
