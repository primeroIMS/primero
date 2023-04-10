#!/bin/bash
    
version=$(</srv/primero/docker-app-version.txt)

if [[ $version ]]; then
  sudo docker container ls -a -f status=exited | grep -vE "$version" | awk 'NR>1 {print $1}' | xargs sudo docker rm; 
  sudo docker rmi '$(sudo docker images -f dangling=true -q)' > /dev/null 2>&1
fi
