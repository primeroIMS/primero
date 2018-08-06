# #! /bin/bash

PROPERTIES_FILES=/opt/apache-jmeter-4.0/bin/jmeter.properties

echo "=> Installing java jdk"
sudo apt-get update
sudo apt-get install -y openjdk-8-jre-headless

echo "=> Installing jmeter"
if [ -e /tmp/apache-jmeter-4.0.tgz ]; then
    echo "=> Already have jmeter binary in /tmp :)"
else
    sudo wget http://mirrors.sonic.net/apache//jmeter/binaries/apache-jmeter-4.0.tgz -P /tmp
    cd /opt && sudo tar -xf /tmp/apache-jmeter-4.0.tgz
    sudo wget http://central.maven.org/maven2/kg/apc/cmdrunner/2.2/cmdrunner-2.2.jar -P /opt/apache-jmeter-4.0/lib
    sudo wget -O /opt/apache-jmeter-4.0/lib/ext/jmeter-plugins-manager-1.3.jar http://search.maven.org/remotecontent?filepath=kg/apc/jmeter-plugins-manager/1.3/jmeter-plugins-manager-1.3.jar
    sudo java -cp /opt/apache-jmeter-4.0/lib/ext/jmeter-plugins-manager-1.3.jar org.jmeterplugins.repository.PluginManagerCMDInstaller
    sudo /opt/apache-jmeter-4.0/bin/PluginsManagerCMD.sh install-for-jmx /srv/primero/jmeter/primero.jmx
fi

echo "=> Creating/updating jmeter systemd config"
sudo bash -c 'cat > /lib/systemd/system/jmeter.service' << EOF

[Unit]
Description=Jmeter Service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/bin/bash -c 'sudo /opt/apache-jmeter-4.0/bin/jmeter-server > /dev/null 2>&1'
ExecStop=/bin/bash -c 'sudo /opt/apache-jmeter-4.0/bin/shutdown.sh'

[Install]
WantedBy=multi-user.target
EOF

sudo sed -i "s/^\#server.rmi.ssl.disable.*$/server.rmi.ssl.disable=true/g" $PROPERTIES_FILES

echo "=> Starting jmeter"
sudo systemctl enable jmeter
sudo systemctl start jmeter

echo "=> Fini!"


