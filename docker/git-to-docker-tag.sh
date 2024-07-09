#!/usr/bin/env bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

REVISION=${1}
VERSION=${2:-main}

echo "${REVISION}" | awk -v version="${VERSION}" '{
  if ($0 ~ /^refs\/tags/)
    print substr($0, 11);
  else {
    split($0,a,"/");
    print a[length(a)]"-"substr(version,1,9);
  }
}'
