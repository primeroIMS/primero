# #! /bin/bash

for i in "$@"
do
case $i in
    -w=*|--workers=*)
    WORKERS="${i#*=}"
    ;;
esac
done

PROPERTIES_FILES=/opt/apache-jmeter-4.0/bin/jmeter.properties

if [ -z ${WORKER+x} ]; then
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

sudo sed -i "s/^\#server.rmi.ssl.disable.*$/server.rmi.ssl.disable=true/g" $PROPERTIES_FILES
sudo sed -i "s/^\remote_hosts=127.0.0.1.*$/remote_hosts=$WORKERS/g" $PROPERTIES_FILES

if [[ $(grep mode=Statistical /opt/apache-jmeter-4.0/bin/jmeter.properties) != "mode=Statistical" ]]; then
    echo -e "\n\nmode=Statistical" | sudo tee --append $PROPERTIES_FILES >/dev/null
fi

echo "=> Fini!"
