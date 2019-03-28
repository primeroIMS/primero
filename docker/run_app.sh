#!/bin/bash
docker run --add-host="couchdb:10.1.0.87" --rm --network primero_default --name testing -it application:prim-latest bash
