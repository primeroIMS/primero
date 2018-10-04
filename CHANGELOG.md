# Change Log
All notable changes to Primero will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## [Unreleased]

### Added
- Primero fully utilizes Puma to serve the application.
- Migrated all Primero services to Systemd
- Upgraded to CouchDB 2.2

Before running Chef to upgrade to v1.7+, copy over the script tools/prepare-primero-v1.7.sh and ru:n
```
    sudo ./prepare-primero-v1.7.sh
```

### Removed
- Usage of Passenger for application and couch-watcher
- Usage of Supervisor for Primero services

