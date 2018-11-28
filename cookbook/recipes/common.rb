
template '/etc/init/data-mounts.conf' do
  source 'data-mounts.conf.erb'
  owner 'root'
  group 'root'
end

group node[:primero][:app_group] do
  system true
end

user node[:primero][:app_user] do
  system true
  home node[:primero][:home_dir]
  gid node[:primero][:app_group]
  shell '/bin/bash'
end

directory node[:primero][:log_dir] do
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  recursive true
end

directory node[:primero][:bin_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

cookbook_file ::File.join(node[:primero][:bin_dir], 'primeroctl') do
  source 'primeroctl'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '755'
end

cookbook_file '/usr/local/share/ca-certificates/couch_ca.crt' do
  source node[:primero][:couchdb][:root_ca_cert_source]
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
