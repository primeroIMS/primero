#! /usr/bin/env bash

set -ex

SOLR_SRC_DIR="/opt/solr"
SOLR_DIR="/var/solr"
SOLR_CORE="test"
SOLR_USER="solr"

cp config/bitbucket/sunspot.yml config/

if [ -d "$SOLR_SRC_DIR" ]; then
  echo "Solr already installed!"
else
  wget -c https://primero-cicd.s3.amazonaws.com/dependencies/solr-8.9.0.tgz && tar xvf solr-8.9.0.tgz -C /opt
  ln -s /opt/solr-8.9.0 /opt/solr
  rm solr-8.9.0.tgz
fi

if java -version > /dev/null 2>&1; then
  echo "Java already installed!"
else
  apt update
  apt install -y --no-install-recommends lsof default-jre default-jdk
  ln -s /opt/solr/bin/solr /usr/bin/solr
fi

export SOLR_HEAP_MEMORY=512m
export SOLR_HOSTNAME=localhost
export SOLR_LOGS_DIR=/var/solr/logs
export SOLR_LOG_LEVEL=ERROR
export SOLR_PORT=8983

if id "$SOLR_USER" >/dev/null 2>&1; then
  echo "'$SOLR_USER' already exists"
else
  groupadd -r --gid 8983 $SOLR_USER
  useradd -r --uid 8983 --gid 8983 $SOLR_USER
fi

mkdir -p "$SOLR_DIR/data" "$SOLR_DIR/logs"
chmod 0770 "$SOLR_DIR/data" "$SOLR_DIR/logs"

cp -a "$SOLR_SRC_DIR/server/solr/solr.xml" "$SOLR_DIR/data/solr.xml"
cp -a "$SOLR_SRC_DIR/server/solr/zoo.cfg" "$SOLR_DIR/data/zoo.cfg"
cp -a "$SOLR_SRC_DIR/server/resources/log4j2.xml" "$SOLR_DIR/log4j2.xml"
cp -a "solr/solr.xml" "$SOLR_SRC_DIR/"

cp -r solr/configsets/primero "$SOLR_DIR/data/$SOLR_CORE"
cp config/bitbucket/core.properties "$SOLR_DIR/data/$SOLR_CORE/"

chown -R "$SOLR_USER:$SOLR_USER" $SOLR_DIR
chmod -R 777 "$SOLR_SRC_DIR/bin"

cp docker/solr/root/opt/solr/bin/solr.in.sh.template /opt/solr/bin/solr.in.sh

if solr status 2>/dev/null; then
  echo "Solr already running!"
else
  su solr -c "solr start -s $SOLR_DIR/data"
fi


