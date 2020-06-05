#!/bin/bash

set -euox pipefail

if [ $1 == "beanstalkd-start" ]; then
  beanstalkd -V -p $BEANSTALKD_PORT -b /var/lib/beanstalkd
else
  exec "$@"
fi
