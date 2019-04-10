#!/bin/bash

printf "Checking for certificate renewal"
certbot renew --post-hook 
