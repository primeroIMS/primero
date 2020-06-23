#!/bin/bash

set -euxo pipefail

if [ $1 == "beanstalkd-start" ]; then
  beanstalkd -V -p $BEANSTALKD_PORT -b /var/lib/beanstalkd
else
  exec "$@"
fi
