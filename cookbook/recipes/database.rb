require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

include_recipe 'apt'
package 'build-essential'

node.default[:couch_db][:src_version] = '1.5.0'
node.default[:couch_db][:src_checksum] = 'abbdb2a6433124a4a4b902856f6a8a070d53bf7a55faa7aa8b6feb7127638fef'
node.force_default[:couch_db][:config][:log][:file] = "#{node[:primero][:log_dir]}/couchdb/couch.log"
node.force_default[:couch_db][:config][:admins] = {
  node[:primero][:couchdb][:username] => node[:primero][:couchdb][:password],
}

include_recipe 'couchdb::source'

service 'couchdb' do
  action :nothing
end

