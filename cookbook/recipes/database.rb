require 'chef/mixin/shell_out'
extend Chef::Mixin::ShellOut

include_recipe 'apt'
package 'build-essential'

node.default[:couch_db][:src_version] = '1.5.0'
node.default[:couch_db][:src_checksum] = 'abbdb2a6433124a4a4b902856f6a8a070d53bf7a55faa7aa8b6feb7127638fef'

# The couchdb cookbook seems to have issues with idempotency and tries to
# redownload the source package on every run
unless shell_out("couchdb -V | grep #{node[:couch_db][:src_version]}").status.success?
  include_recipe 'couchdb::source'
end

#TODO: What installs Erlang?