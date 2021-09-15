#! /usr/bin/env python3

from __future__ import print_function
import json
import os
import requests
import argparse
import sys

def notify_slack(ansible_status, build_tag, url_slack_channel):
    if ansible_status == '0':
        status = 'SUCCEEDED'
    else:
        status = 'FAILED'
    
    print(status)

    variable = build_tag.split(' ')[0]
    tag = variable.split('=')[1]
    environment = tag.split('-')[0]
    
    print(tag)

    print(environment)

    server_name = f'primero-integration-{environment}.cloud.quoininc.com'

    print(server_name)

    text = f'Build Tag: {tag}\nIntegration Server URL: {server_name}'

    message = {
        'text': '',
        'attachments': [
            {
                'title': f'Primero CICD Ansible {status}',
                'color': '#3AA3E3',
                'text': text
            }
        ]
    }

    response = requests.post(url_slack_channel, json=message)
    print('Response: ' + str(response.text))
    print('Response code: ' + str(response.status_code))
    return

def _main(argv):
    parser = argparse.ArgumentParser(
        description='Obtain ansible exit code status.',
        )
    parser.add_argument(
        '-s',
        '--status',
        required=True,
        metavar='STATUS',
        dest='status',
        )
    parser.add_argument(
        '-t',
        '--tag',
        required=True,
        metavar='TAG',
        dest='tag',
        )
    parser.add_argument(
        '-n',
        '--notify',
        required=True,
        metavar='NOTIFY',
        dest='notify',
        )

    arguments = parser.parse_args(argv[1:])

    print(arguments.status)
    print(arguments.tag)
    print(arguments.notify)

    notify_slack(arguments.status, arguments.tag, arguments.notify)

if '__main__' == __name__:
    code = _main(sys.argv)
    if None is code:
        code = 0
    sys.exit(code)
