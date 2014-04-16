require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

include_recipe 'apt'
package 'build-essential'

node.default[:couch_db][:src_version] = '1.5.0'
node.default[:couch_db][:src_checksum] = 'abbdb2a6433124a4a4b902856f6a8a070d53bf7a55faa7aa8b6feb7127638fef'

include_recipe 'couchdb::source'

template '/usr/local/etc/couchdb/local.d/address.ini' do
  source 'couch_local_config.ini.erb'
  variables({
    :bind_address => node[:primero][:couchdb][:bind_address],
  })
  owner 'couchdb'
  group 'couchdb'
  notifies :restart, 'service[couchdb]'
end

service 'couchdb' do
  action :nothing
end

