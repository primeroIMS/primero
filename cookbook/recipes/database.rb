require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

include_recipe 'apt'
include_recipe 'primero::common'

apt_repository 'apache-couchdb' do
  uri          'https://apache.bintray.com/couchdb-deb'
  distribution 'xenial'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '379CE192D401AB61'
  notifies :run, 'execute[apt-get update]', :immediately
end

package 'build-essential'
package 'curl'
package 'couchdb'

couchdb_log_dir = ::File.join(node[:primero][:log_dir], 'couchdb')
node.force_default[:primero][:couchdb][:config][:log][:file] = ::File.join(couchdb_log_dir, 'couch.log')
node.force_default[:primero][:couchdb][:config][:log][:level] = "info"
node.force_default[:primero][:couchdb][:config][:admins] = {
  node[:primero][:couchdb][:username] => node[:primero][:couchdb][:password],
}

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

template '/opt/couchdb/etc/vm.args' do
  owner 'couchdb'
  group 'couchdb'
  source 'couchdb/vm.args.erb'
  variables( :io_threads => node[:primero][:couchdb][:io_threads] )
  mode '0600'
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
end

logrotate_app 'couchdb' do
  path ::File.join(couchdb_log_dir, '*.log')
  size 50 * 1024 * 1024
  rotate 2
  frequency nil
  options %w( copytruncate delaycompress compress notifempty missingok )
end

include_recipe 'primero::nginx_couch'
