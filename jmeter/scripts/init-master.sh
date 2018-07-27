# #! /bin/bash

for i in "$@"
do
case $i in
    -w=*|--worker=*)
    WORKER="${i#*=}"
    ;;
esac
done

if [ -z ${WORKER+x} ]; then
  echo "=> Setup failed worker number required using -w= or --worker="
else

WORKER_NUMBER=$(($WORKER + 1))

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

sudo sed -i "s/^remote_hosts=127.0.0.1$/remote_hosts=127.0.0.1:24001, 127.0.0.1:24002/g" /opt/apache-jmeter-4.0/bin/jmeter.properties
sudo sed -i "s/^\#client.rmi.localport.*$/client.rmi.localport=25000/g" /opt/apache-jmeter-4.0/bin/jmeter.properties

if [[ $(grep mode=Statistical /opt/apache-jmeter-4.0/bin/jmeter.properties) != "mode=Statistical" ]]; then
echo -e "\n\nmode=Statistical" | sudo tee --append /opt/apache-jmeter-4.0/bin/jmeter.properties >/dev/null
fi

# echo "=> SSH port forwarding - worker (${WORKER_NUMBER})"
# ssh -L 2400${WORKER_NUMBER}:127.0.0.1:2400${WORKER_NUMBER} -R 25000:127.0.0.1:25000 -L 2600${WORKER_NUMBER}:127.0.0.1:2600${WORKER_NUMBER} -N -f USERNAME@SLAVE01

echo "=> Fini!"
fi


