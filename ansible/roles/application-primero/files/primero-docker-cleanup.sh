#!/bin/bash
    
version=$(</srv/primero/docker-app-version.txt)

if [[ $version ]]; then
  sudo docker container ls -a -f status=exited | grep -vE "$version" | awk 'NR>1 {print $1}' | xargs sudo docker rm; 
  sudo docker images -a | grep -vE "$version" | grep "<none>" | awk '{print $3}' | xargs sudo docker rmi
fi
