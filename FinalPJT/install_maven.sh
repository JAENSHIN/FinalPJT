#!/bin/bash

echo "Installing Maven..."
MAVEN_VERSION=3.8.5
curl -o maven.tar.gz https://downloads.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
mkdir -p /opt/buildhome/maven
tar -xzf maven.tar.gz -C /opt/buildhome/maven --strip-components=1
rm maven.tar.gz

echo "Maven installed at /opt/buildhome/maven"
