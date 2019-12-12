Certificates
------------

Primero requires SSL to run. The following options for enabling SSL are available:

 - **Self-signed:** This document includes instructions for setting up a Certificate Authority (CA).
 - **Purchased:** Certificates can be purchased from a certificate vendor like DigiCert or Comodo. This file contains instructions for generating a Certificate Signing Request (CSR) file.
 - **Let's Encrypt:** This is a free, automated [certificate authority](https://letsencrypt.org) that is based on DNS validation. Primero Chef deployment includes support for automatically enabling and periodically renewing Let's Encrypt certificates. See the file `cookbook/README.md` for how to do this.


### Application SSL
To get the application SSL cert, you must go through a recognized Certificate
Authority (CA) or a CA which is trusted by the browsers of the primary users
of this Primero deployment.  It is currently not possible to run Primero
except through HTTPS, nor is it advisable to run any part of Primero except
under HTTPS.

### CouchDB SSL
The CouchDB SSL cert uses a private CA whose root certificate is distributed
automatically to all of the servers to verify communication. To generate a
new key and cert, follow the next steps.

#### Initial Setup
(All from [this site](https://jamielinux.com/articles/2013/08/act-as-your-own-certificate-authority/).)

To setup a new root Certificate Authority to sign CouchDB certs, you need to configure your machine as your own certificate authority (CA).
Create the next directories and files to save the certificates and keys. You may need to do it as root.

```sh
$
sudo mkdir -p /etc/pki/CA
cd /etc/pki/CA
sudo mkdir certs crl newcerts private
sudo chmod 700 private
sudo touch index.txt
sudo echo 1000 > serial
```

Also it is necessary to create a root key and a root certificate, that identify the certificate authority. To generate the root key with the proper encryption:

```sh
$ sudo openssl genrsa -aes256 -out /etc/pki/CA/private/couch_ca.pem 4096

Enter pass phrase for ca.key.pem: secretpassword
Verifying - Enter pass phrase for ca_key.pem: secretpassword

$ sudo chmod 600 /etc/pki/CA/private/couch_ca.pem
```

Open the file `/etc/ssl/openssl.cnf`

Under [ CA_default ], change the field 'dir' to the following
dir = /etc/pki/CA

Also, in the same file, make sure the following fields look like the following:
NOTE: if one of the lines below is commented out, uncomment it.

```sh
[ usr_cert ]
# These extensions are added when 'ca' signs a request.
basicConstraints=CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
nsComment = "OpenSSL Generated Certificate"
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer

[ v3_ca ]
# Extensions for a typical CA
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
basicConstraints = CA:true
keyUsage = cRLSign, keyCertSign
```

Save any changes made to the openssl.cnf file.


To generate the root certificate:

```sh
$ sudo openssl req -new -x509 -days 3650 -key /etc/pki/CA/private/couch_ca.pem -sha256 -extensions v3_ca -out /etc/pki/CA/certs/couch_ca.cert
$ sudo chmod 600 /etc/pki/CA/certs/couch_ca.cert
```

The first time you do this, it will prompt you for information about your location, company, etc.
Answer those questions per your organization's location and contact information.

After the first time, you should set up your own `config.cnf` file based on
your organization's policy and contact information.
See example below.
See the openssl docs for more info on how to configure things.
[https://www.openssl.org/docs/](https://www.openssl.org/docs/)

###### Example config.cnf

```sh
[req]
default_bits            = 4096
distinguished_name      = req_distinguished_name
encrypt_key             = no
prompt                  = yes
string_mask             = nombstr

[ ca ]
default_ca = couch_ca

[ couch_ca ]
dir = /etc/pki/CA
new_certs_dir = $dir/newcerts/
database = $dir/index.txt
certificate = $dir/certs/couch_ca.cert
private_key = $dir/private/couch_ca.pem
default_days = 3650
default_md   = md5
policy       = policy_match
serial       = $dir/serial
preserve = yes

[ policy_match ]
commonName = supplied

[ req_distinguished_name ]
countryName                 = Country Name
stateOrProvinceName         = State Name
localityName                = City Name
0.organizationName          = Company/Organization
emailAddress                = Email Address
commonName                  = Couch DB Host

countryName_default         = US
stateOrProvinceName_default = Massachusetts
localityName_default        = Boston
0.organizationName_default  = Quoin, Inc.
emailAddress_default        = unknown@quoininc.com
```

#### Creating and Signing New Certs
Firstly, copy the openssl configuration file

```sh
$ cp /etc/ssl/openssl.cnf ./config.cnf
```

Once you have a CA set up, you can make new keys and certs for individual
CouchDB instances. Go to the root directory of your CA. (/etc/pki/CA)

For the following, HOST_NAME is the host name of the remote server.

To create a new key:
```
openssl genrsa -out <HOST_NAME>.key 2048
```

To create a Certificate Signing Request with a key:
```
openssl req -new -key <HOST_NAME>.key -out <HOST_NAME>.csr -config config.cnf
```

To sign the CSR and make a Cert using the root CA key:
```
openssl ca -in <HOST_NAME>.csr -config config.cnf
```

All clients using HTTPS must have trust the root cert in the file
`couch_ca.crt`.

You must configure the node file (see below) to provision this new CA
certificate onto the deployed server so that it can verify remote connections
upon replication.  You can either overwrite the file
`<Primero Application Directory>/cookbook/files/couch_ca.crt` with your own root cert or you can move the cert
into another file in that directory and set the
`primero.couchdb.root_ca_cert_source` attribute in the node file to point to
that new file.  See below for more information on this attribute.

EXAMPLE:
```sh
ubuntu@ubuntu:~/work/primero/cookbook/files$ cp /etc/pki/CA/certs/couch_ca.cert .
```

#### Update self signed certs (If self-signed and easyrsa installed)
`./easyrsa --subject-alt-name=DNS:[DOMAIN] build-server-full [DOMAIN] nopass`
