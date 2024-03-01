#!/bin/ash

LOG_FILE="/solr/logs/solr.log"
Error="Index dir '/var/solr/data/primero/data/index/' of core 'primero' is already locked"

# Function to check if the key sentence exists in the last 10 lines of the log file
check_log() {
    tail -n 30 "$LOG_FILE" | grep -q "$Error"
}

# Main loop to continuously monitor the log file
while true; do
    if check_log; then
        echo "Error found! Restarting main container..."
        # Replace the following line with code to trigger container restart using AWS CLI or SDK
        aws ecs update-service --cluster POTMDev --service Solr --force-new-deployment
        break
    fi
    sleep 300  # Adjust the interval as needed
done
