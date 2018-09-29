require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

apt_repository 'apache-couchdb' do
  uri          'https://apache.bintray.com/couchdb-deb'
  distribution 'xenial'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '379CE192D401AB61'
  notifies :run, 'execute[apt-get update]', :immediately
end

include_recipe 'apt'
include_recipe 'primero::common'
package 'build-essential'
couchdb_log_dir = ::File.join(node[:primero][:log_dir], 'couchdb')
node.force_default[:primero][:couchdb][:config][:log][:file] = ::File.join(couchdb_log_dir, 'couch.log')
node.force_default[:primero][:couchdb][:config][:log][:level] = "info"
#TODO: This has to be initially false. Otherwise initializing an admin user will fail.
#      After admin user is created, set this to true.
# node.force_default[:primero][:couchdb][:config][:couch_httpd_auth][:require_valid_user] = false
#TODO: CouchDB 1.6.0 no longer supports reading an un-encrypted password from the config file
#      and replacing it with an encrypted password. This may be reverted under CouchDB 2.0.0
node.force_default[:primero][:couchdb][:config][:admins] = {
  node[:primero][:couchdb][:username] => node[:primero][:couchdb][:password],
}

package 'curl'
package 'couchdb'

if node[:primero][:couchdb][:config][:couchdb]
  database_dir = node[:primero][:couchdb][:config][:couchdb][:database_dir]
  if database_dir
    directory database_dir do
      action :create
      owner 'couchdb'
      group 'couchdb'
      mode '700'
    end
  end

  view_index_dir = node[:primero][:couchdb][:config][:couchdb][:view_index_dir]
  if view_index_dir
    directory view_index_dir do
      action :create
      owner 'couchdb'
      group 'couchdb'
      mode '700'
    end
  end
end

directory couchdb_log_dir do
  action :create
  owner 'couchdb'
  group 'couchdb'
  mode '700'
end

file node[:primero][:couchdb][:cert_path] do
  content node[:primero][:couchdb][:ssl][:cert]
  owner 'root'
  group 'root'
  mode '644'
  not_if do
    ::File.symlink?(node[:primero][:couchdb][:cert_path]) &&
    node[:primero][:letsencrypt] &&
    node[:primero][:letsencrypt][:couchdb]
  end
  #If symlink, then this has been created and is being maintained by letsencrypt
end

file node[:primero][:couchdb][:key_path] do
  content node[:primero][:couchdb][:ssl][:key]
  owner 'root'
  group 'root'
  mode '400'
  not_if do
    ::File.symlink?(node[:primero][:couchdb][:key_path]) &&
    node[:primero][:letsencrypt] &&
    node[:primero][:letsencrypt][:couchdb]
  end
  #If symlink, then this has been created and is being maintained by letsencrypt
end

template '/opt/couchdb/etc/local.ini' do
  owner 'couchdb'
  group 'couchdb'
  source 'couchdb/local.ini.erb'
  variables( :config => node[:primero][:couchdb][:config] )
  mode '0600'
  notifies :restart, 'service[couchdb]', :immediately
end

service 'couchdb' do
  action [:enable, :restart]
  provider Chef::Provider::Service::Systemd
#  notifies :run, 'execute[set-couchdb-admin-user]', :immediately
end

#TODO: This is required for Couch 1.6.0 since it can no longer rehash
#      clear text-passwords written to the local.ini file.
# host_url = "http://#{node[:primero][:couchdb][:host]}:#{node[:primero][:couchdb][:config][:httpd][:port]}"
# user = node[:primero][:couchdb][:username]
# password = node[:primero][:couchdb][:password]
# execute 'set-couchdb-admin-user' do
#   command  "curl -X PUT #{host_url}/_config/admins/#{user} -d '\"#{password}\"'"
#   action :nothing
#   not_if do
#     ::File.readlines("/etc/couchdb/local.ini").grep(/admins/).size > 0
#   end
#   retries 5
#   #sensitive true
#   subscribes :restart, 'service[couchdb]', :immediately
# end

#Security measure.
#TODO: We are forced to set this attribute after the admin user is generated.
#      May go away if the local.ini will again permit setting/rehashing cleartext passwords
# execute 'require-couchdb-auth' do
#   command <<-EOH
#     sed 's/require_valid_user = false/require_valid_user = true/' /etc/couchdb/local.ini > /etc/couchdb/local.ini.tmp
#     mv /etc/couchdb/local.ini.tmp /etc/couchdb/local.ini
#   EOH
#   notifies :restart, 'service[couchdb]', :immediately
# end

logrotate_app 'couchdb' do
  path ::File.join(couchdb_log_dir, '*.log')
  size 50 * 1024 * 1024
  rotate 2
  frequency nil
  options %w( copytruncate delaycompress compress notifempty missingok )
end

include_recipe 'primero::nginx_couch'
