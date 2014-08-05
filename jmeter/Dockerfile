FROM ubuntu:14.04
MAINTAINER Ben Keith <ben.keith@quoininc.com>

# This could be useful later if we ever dockerize the primero app.  With
# Primero running apart from docker it is somewhat difficult to make this
# useful, at least with the default VM setup.

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends default-jre openssh-client unzip wget gnuplot && \
    apt-get clean -y

RUN mkdir /tmp/jmeter && cd /tmp/jmeter && \
    wget http://www.dsgnwrld.com/am//jmeter/binaries/apache-jmeter-2.11.tgz && \
    tar -zxf apache-jmeter-2.11.tgz -C /opt && \
    wget http://jmeter-plugins.org/downloads/file/JMeterPlugins-Standard-1.1.3.zip && \
    unzip JMeterPlugins-Standard-1.1.3.zip && \
    mv lib/ext/* /opt/apache-jmeter-2.11/lib/ext/ && \
    cd / && rm -rf /tmp/jmeter

COPY scripts/jmeter-bin.sh /usr/bin/jmeter
COPY . primero-jmeter

RUN chmod +x primero-jmeter/scripts/run-jmeter

ENTRYPOINT ["primero-jmeter/scripts/run-jmeter"]

