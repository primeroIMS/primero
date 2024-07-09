#! /usr/bin/env bash
# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

set -e

cat `find config/locales -type f -iname en.yml` | awk  'BEGIN {FS="%{"} /%{/ { for(i=2; i<=NF; i++) {split($i,a,"}"); print(a[1])}}' | sort -u > en_keys.txt

cat `find config/locales -type f` | awk  'BEGIN {FS="%{"} /%{/ { for(i=2; i<=NF; i++) {split($i,a,"}"); print(a[1])}}' | sort -u > all_keys.txt

comm -23 all_keys.txt en_keys.txt > bad_interpolations.txt

num_bad_interpolations=$(cat bad_interpolations.txt | wc -l)

rm all_keys.txt en_keys.txt

if [ "$num_bad_interpolations" -gt 0 ]; then
    echo "ERR: There are $num_bad_interpolations bad interpolations in transifex translations files:"
    cat bad_interpolations.txt
    rm bad_interpolations.txt
    exit 1
fi

rm bad_interpolations.txt
