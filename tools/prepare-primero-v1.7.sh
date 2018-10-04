#! /usr/bin/env bash

echo "This script will prepare your system for changes associated with Primero v1.7."
echo "You can run Chef with new v1.7.x tags after this script completes."
echo ""
echo "Please back up your CouchDB data (usually located under /var/lib/couchdb) before you run this script!!!!"
echo ""
echo "When prompted pick the default options"

disable_supervisor_passenger(){
    echo "Stopping all Primero Supervisor services"
    supervisorctl stop all

    echo "Halting and uninstalling Supervisord"
    systemctl stop supervisor
    systemctl disable supervisor
    apt-get remove supervisor

    echo "Disabling Passenger"
    systemctl stop passenger
    systemctl disable supervisor
    rm /etc/systemd/system/passenger.service

    systemctl daemon-reload
    systemctl reset-failed

    #Move old logfiles
    mv /srv/primero/logs/couch_watcher/output.log /srv/primero/logs/couch_watcher/output.log.old
    chown primero:primero /srv/primero/logs/couch_watcher/output.log.old

    mv /srv/primero/application/tmp/couch_watcher_history.json /srv/primero/application/tmp/couch_watcher_history.json.old
    chown primero:primero /srv/primero/application/tmp/couch_watcher_history.json.old
}

install_couch_2_2(){
    echo "Installing CouchDB 2.2"
    echo "deb https://apache.bintray.com/couchdb-deb xenial main" > /etc/apt/sources.list.d/apache-couch.list
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 379CE192D401AB61
    apt-get update
    apt-get install couchdb
}

migrate_couch_data(){
    echo "Migrating Couchdb data. This will take a long time!"
    /opt/couchdb/bin/couchup list
    /opt/couchdb/bin/couchup replicate -a
    /opt/couchdb/bin/couchup rebuild -a
    /opt/couchdb/bin/couchup delete -a
    /opt/couchdb/bin/couchup list
}

read -r -p "Would you like to proceed? [y/N] " response
response=${response,,}
if [[ "$response" =~ ^(yes|y)$ ]] ; then
    disable_supervisor_passenger
    install_couch_2_2
    migrate_couch_data

    echo ""
    echo "System is ready for a v1.7 Chef deploy!"
fi

