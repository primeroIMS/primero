cookbook_file '/usr/local/share/ca-certificates/couch_ca.crt' do
  source 'couch_ca.crt'
  owner 'root'
  group 'root'
  mode '0644'
end

execute 'update-ca-certificates' do
  command 'update-ca-certificates'
  user 'root'
  group 'root'
end

node.force_default[:primero][:couchdb][:config][:ssl][:cacert_file] =
  node.force_default[:primero][:couchdb][:config][:replicator][:ssl_trusted_certificates_file] =
    '/etc/ssl/certs/couch_ca.pem'

file "/etc/cron.daily/clean-tmp" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

/usr/bin/find /tmp -type f -atime +2 -mtime +2 | xargs /bin/rm -f
EOH
end
