# Change Log
All notable changes to Primero will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## [Unreleased]

### Added
- Primero fully utilizes Puma to serve the application. To migrate do the following:
  - Stop Passenger `sudo systemctl stop passenger`
  - Remove Passenger service
    ```
      sudo rm /etc/systemd/system/passenger.service
      sudo systemctl daemon-reload
      sudo systemctl reset-failed
    ```

### Removed
- Usage of Passenger for application and couch-watcher

