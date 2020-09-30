#! /usr/bin/env python


import docker
import os
import shutil
import sys
import tempfile
import argparse


def _main(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('--webroot')
    parser.add_argument('--email')
    parser.add_argument('--hostname')
    parser.add_argument('--project_name')
    args = parser.parse_args()
    client = docker.from_env()
    host_dir = tempfile.mkdtemp()
    try:
        container_dir = '/tmp/post-hook-dir'
        container_renewed_file = os.path.join(container_dir, 'renewed')
        post_hook_command = 'touch ' + container_renewed_file
        command = [
            '-t', 'certonly',
                '-n',
                '--webroot',
                '-w', args.webroot,
                '--rsa-key-size', '4096',
                '--deploy-hook', post_hook_command,
                '--agree-tos',
                '--email', args.email,
                '--cert-name', args.project_name,
                '-d', args.hostname,
            ]
        volumes = {
            'qi-certbot-certs': {'bind': '/etc/letsencrypt'},
            'qi-certbot-challenges': {'bind': args.webroot},
            host_dir: {'bind': container_dir},
        }
        certbot_logs = client.containers.run(
            image='certbot/certbot:v0.21.1',
            command=command,
            remove=True,
            stdout=True,
            stderr=True,
            volumes=volumes,
            )
        print(certbot_logs)
        host_renewed_file = os.path.join(host_dir, 'renewed')
        renewed = os.path.exists(host_renewed_file)
    finally:
        shutil.rmtree(host_dir)
    if renewed:
        try:
            nginx = client.containers.get(''.join([args.project_name, '_nginx_1']))
        except docker.errors.NotFound:
            pass
        else:
            if 'running' == nginx.status:
                nginx_logs = nginx.exec_run(['nginx', '-s', 'reload'])
                print(nginx_logs)
    return 0


if '__main__' == __name__:
    code = _main(sys.argv)
    if None is code:
        code = 0
    sys.exit(code)