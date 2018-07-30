# #! /bin/bash

PROPERTIES_FILES=/opt/apache-jmeter-4.0/bin/jmeter.properties

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
User=root
ExecStart=sudo /opt/apache-jmeter-4.0/bin/jmeter-server -Djava.rmi.server.hostname=127.0.0.1 > /dev/null 2>&1

[Install]
WantedBy=multi-user.target
EOL'

sudo sed -i "s/^\#server.rmi.ssl.disable.*$/server.rmi.ssl.disable=true/g" $PROPERTIES_FILES

if [[ $(grep server.rmi.localhostname=127.0.0.1 ${PROPERTIES_FILES}) != "server.rmi.localhostname=127.0.0.1" ]]; then
echo -e "\n\nserver.rmi.localhostname=127.0.0.1" | sudo tee --append $PROPERTIES_FILES >/dev/null
fi

echo "=> Starting jmeter"
sudo systemctl enable jmeter
sudo systemctl start jmeter

echo "=> Fini!"


