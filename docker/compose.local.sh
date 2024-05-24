#! /bin/sh
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

set -euox
exec "./compose.sh" -f "docker-compose.db.yml" -f "docker-compose.local.yml" "${@}"
