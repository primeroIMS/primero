#!/usr/bin/env bash

REVISION=${1}
VERSION=${2:-master}

echo ${REVISION} | awk -v version=${VERSION} '{
  if ($0 ~ /^refs\/tags/)
    print substr($0, 11);
  else {
    split($0,a,"/");
    print a[length(a)]"-"substr(version,1,9);
  }
}'
