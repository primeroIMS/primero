#!/usr/bin/env bash

REVISION=${1}
LATEST=${2:-master}

echo ${REVISION} | awk -v latest=${LATEST} '{
  if ($0 ~ /^refs\/tags/)
    print substr($0, 11);
  else if ($0 ~ latest"$")
    print "latest";
  else {
    split($0,a,"/");
    print a[length(a)];
  }
}'