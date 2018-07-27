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

echo "=> Installing java jdk"
sudo apt-get update
sudo apt-get install -y openjdk-8-jre-headless

echo "=> Installing jmeter"
if [ -e /tmp/apache-jmeter-4.0.tgz ]
then
    echo "=> Already have jmeter binary in /tmp :)"
else
    wget http://mirrors.sonic.net/apache//jmeter/binaries/apache-jmeter-4.0.tgz -P /tmp
fi

cd /opt; sudo tar -xf /tmp/apache-jmeter-4.0.tgz

cd /opt/apache-jmeter-4.0/bin && /opt/apache-jmeter-4.0/bin/create-rmi-keystore.sh < jmeter-prompts.txt

echo "=> Creating/updating jmeter systemd config"
sudo bash -c  'cat > /lib/systemd/system/jmeter.service <<EOL
[Unit]
Description=Jmeter Service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=ubuntu
ExecStart=/opt/apache-jmeter-4.0/bin/jmeter-server -Djava.rmi.server.hostname=127.0.0.1 > /dev/null 2>&1

[Install]
WantedBy=multi-user.target
EOL'

sudo sed -i "s/^\#server_port.*$/server_port=2400$WORKER_NUMBER/g" /opt/apache-jmeter-4.0/bin/jmeter.properties
sudo sed -i "s/^\#server.rmi.localport.*$/server.rmi.localport=2600$WORKER_NUMBER/g" /opt/apache-jmeter-4.0/bin/jmeter.properties

if [[ $(grep server.rmi.localhostname=127.0.0.1 /opt/apache-jmeter-4.0/bin/jmeter.properties) != "server.rmi.localhostname=127.0.0.1" ]]; then
echo -e "\n\nserver.rmi.localhostname=127.0.0.1" | sudo tee --append /opt/apache-jmeter-4.0/bin/jmeter.properties >/dev/null
fi

echo "=> Starting jmeter"
sudo systemctl enable jmeter
sudo systemctl start jmeter

echo "=> Fini!"
fi


