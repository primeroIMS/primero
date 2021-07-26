#! /usr/bin/env python3

from __future__ import print_function
import json
import os
import requests
import argparse
import sys

def notify_slack(build_status, build_tag, log_path, phase):
    if build_status == 1:
        status = 'SUCCEEDED'
    else:
        status = 'FAILED'
    
    text = f'Build Tag: {build_tag}\nBuild Phase: {phase}\nBuild Status: {status}\nLog Path: {log_path}'

    message = {
        'text': '',
        'attachments': [
            {
                'title': 'Primero CICD Build Status',
                'color': '#3AA3E3',
                'text': text
            }
        ]
    }

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

    notify_slack(build_status, build_tag, log_path, arguments.phase)

if '__main__' == __name__:
    code = _main(sys.argv)
    if None is code:
        code = 0
    sys.exit(code)
