#! /usr/bin/env python3

from __future__ import print_function
import json
import os
import requests
import argparse
import sys

def notify_slack(build_status, build_tag, log_path, phase, send_command):
    if build_status == '1':
        status = 'SUCCEEDED'
        if send_command:
            output_file = open('output.json',)
            output = json.load(output_file)
            output_file.close()
            command_id = output['Command']['CommandId']
            print(command_id)
            text = f'Build Tag: {build_tag}\nAnsible Command Id: {command_id}'
        else:
            text = f'Build Tag: {build_tag}\nBuild Phase: {phase}\nLog Path: {log_path}'
    else:
        status = 'FAILED'
        text = f'Build Tag: {build_tag}\nBuild Phase: {phase}\nLog Path: {log_path}'

    message = {
        'text': '',
        'attachments': [
            {
                'title': f'Primero CICD Build {status}',
                'color': '#3AA3E3',
                'text': text
            }
        ]
    }

    print(message)
    url_slack_channel = os.environ['URL_SLACK_CHANNEL']

    response = requests.post(url_slack_channel, json=message)
    print('Response: ' + str(response.text))
    print('Response code: ' + str(response.status_code))
    return

def _main(argv):
    parser = argparse.ArgumentParser(
        description='Obtain build phase.',
        )
    parser.add_argument(
        '-p',
        '--phase',
        required=True,
        metavar='PHASE',
        dest='phase',
        )
    parser.add_argument(
        '--send-command',
        required=False,
        action='store_true',
        dest='send_command',
        )

    arguments = parser.parse_args(argv[1:])

    bucket_name = os.environ['BUCKET_NAME']
    logs_prefix = os.environ['LOGS_PREFIX']
    build_status = os.environ['CODEBUILD_BUILD_SUCCEEDING']
    build_tag = os.environ['TAG']
    build_log_path = os.environ['CODEBUILD_LOG_PATH']
    log_path = f'https://{bucket_name}.s3.amazonaws.com/{logs_prefix}/{build_log_path}.gz'

    print(bucket_name)
    print(logs_prefix)
    print(build_status)
    print(build_tag)
    print(build_log_path)
    print(log_path)

    if arguments.phase == 'pre_build':
        if build_status == '0':
            notify_slack(build_status, build_tag, log_path, arguments.phase, arguments.send_command)
    else:
        notify_slack(build_status, build_tag, log_path, arguments.phase, arguments.send_command)

if '__main__' == __name__:
    code = _main(sys.argv)
    if None is code:
        code = 0
    sys.exit(code)
