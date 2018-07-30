# #! /bin/bash

for i in "$@"
do
case $i in
    -w=*|--workers=*)
    WORKERS="${i#*=}"
    ;;
esac
done

PROPERTIES_FILE=/opt/apache-jmeter-4.0/bin/jmeter.properties

if [ -z ${WORKERS+x} ]; then
  WORKERS=127.0.0.1
fi

if [[ $(java -version 2>&1 | grep "openjdk version \"1.8" | wc -l) ]]; then
    echo "=> Java JDK already installed";
else
    echo "=> Installing java jdk"
    sudo apt-get update
    sudo apt-get install -y openjdk-8-jre-headless
fi

echo "=> Installing jmeter"
if [ -e /tmp/apache-jmeter-4.0.tgz ]
then
    echo "=> Already have jmeter binary in /tmp :)"
else
    wget http://mirrors.sonic.net/apache//jmeter/binaries/apache-jmeter-4.0.tgz -P /tmp
fi

cd /opt; sudo tar -xf /tmp/apache-jmeter-4.0.tgz

sudo sed -i "s/^\#server.rmi.ssl.disable.*$/server.rmi.ssl.disable=true/g" $PROPERTIES_FILE
sudo sed -i "s/^remote_hosts=.*$/remote_hosts=${WORKERS}/" $PROPERTIES_FILE

if [[ $(grep mode=Statistical $PROPERTIES_FILE) != "mode=Statistical" ]]; then
    echo -e "\n\nmode=Statistical" | sudo tee --append $PROPERTIES_FILE >/dev/null
fi

echo "=> Fini!"
