require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

include_recipe 'apt'
include_recipe 'primero::common'
package 'build-essential'

file node[:primero][:couchdb][:cert_path] do
  content node[:primero][:couchdb][:ssl][:cert]
  owner 'root'
  group 'root'
  mode '644'
end

file node[:primero][:couchdb][:key_path] do
  content node[:primero][:couchdb][:ssl][:key]
  owner 'root'
  group 'root'
  mode '400'
end

node.default[:couch_db][:src_version] = '1.5.0'
node.default[:couch_db][:src_checksum] = 'abbdb2a6433124a4a4b902856f6a8a070d53bf7a55faa7aa8b6feb7127638fef'
node.force_default[:couch_db][:config][:admins] = {
  node[:primero][:couchdb][:username] => node[:primero][:couchdb][:password],
}

include_recipe 'couchdb::source'

service 'couchdb' do
  action :nothing
end

couch_conf_file = "#{node[:nginx_dir]}/sites-available/couchdb"
template couch_conf_file do
  source "nginx_couch.erb"
  owner 'root'
  group 'root'
  mode '0644'
  variables({
    :ssl_cert_path => node[:primero][:couchdb][:cert_path],
    :ssl_key_path => node[:primero][:couchdb][:key_path],
  })
  notifies :restart, 'service[nginx]'
end

link "#{node[:nginx_dir]}/sites-enabled/couchdb" do
  to couch_conf_file
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

