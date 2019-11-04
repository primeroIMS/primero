#!/bin/bash

set -euox pipefail

beanstalkd -V -p $BEANSTALKD_PORT -u beanstalk -b /var/lib/beanstalkd
