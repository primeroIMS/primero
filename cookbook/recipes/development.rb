
include_recipe 'apt'

# To get tmux 1.8 and newer vim
apt_repository "pi-rho" do
  uri "http://ppa.launchpad.net/pi-rho/dev/ubuntu"
  distribution "precise"
  components ["main"]
  action :add
  keyserver 'keyserver.ubuntu.com'
  key '779C27D7'
  notifies :run, 'execute[apt-get update]', :immediately
end

%w(tmux vim curl chromium-browser libgconf-2-4).each do |pkg|
  package pkg
end

# This module gets pulled in with tmux 1.8 but unfortunately breaks Chef, it
# doesn't seem to be required by tmux though so we can remove it
package 'libpam-tmpdir' do
  action :remove
end

link '/home/vagrant/primero' do
  to '/vagrant'
end

include_recipe 'rvm::user_install'

railsexpress_patch_setup 'dev' do
  user 'vagrant'
  group 'vagrant'
end

execute_with_ruby 'dev-ruby' do
  command <<-EOH
    rvm install #{node[:primero][:ruby_version]} -n #{node[:primero][:ruby_patch]} --patch #{node[:primero][:ruby_patch]}
    rvm rubygems #{node[:primero][:rubygems_version]} --force
    rvm --default use #{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}
    rvm reload && rvm repair all
  EOH
  cwd '/home/vagrant/primero'
  user 'vagrant'
  group 'vagrant'
end

update_bundler 'dev-stack' do
  user 'vagrant'
  group 'vagrant'
  bundler_version node[:primero][:bundler_version]
end

execute_with_ruby 'bundle-install-vagrant' do
  command 'bundle install'
  cwd '/home/vagrant/primero'
  user 'vagrant'
  group 'vagrant'
  rails_env 'development'
end

template "/home/vagrant/primero/config/couchdb.yml" do
  source 'couch_config.yml.erb'
  variables({
    :environments => [ 'development', 'cucumber', 'test', 'production', 'uat', 'standalone', 'android' ],
    :couchdb_host => node[:primero][:couchdb][:host],
    :couchdb_username => node[:primero][:couchdb][:username],
    :couchdb_password => node[:primero][:couchdb][:password],
  })
  owner 'vagrant'
  group 'vagrant'
end


template '/home/vagrant/primero/config/sunspot.yml' do
  source "sunspot.yml.erb"
  variables({
    :environments => [ 'development', 'cucumber', 'test', 'production', 'uat', 'standalone', 'android' ],
    :hostnames => {'development' => 'localhost',
                   'cucumber' => 'localhost',
                   'test' => 'localhost',
                   'uat' => 'localhost',
                   'standalone' => 'localhost',
                   'android' => 'localhost',
                   'production' => node[:primero][:solr_hostname]},
    :ports => {'development' => 8982,
               'cucumber' => 8981,
               'test' => 8981,
               'uat' => 8901,
               'standalone' => 8903,
               'android' => 8902,
               'production' => node[:primero][:solr_port]},
    :log_levels => {'development' => 'INFO',
                    'cucumber' => 'INFO',
                    'test' => 'INFO',
                    'uat' => 'INFO',
                    'standalone' => 'INFO',
                    'android' => 'INFO',
                    'production' => node[:primero][:solr_log_level]},
    :log_files => {'production' => "#{node[:primero][:log_dir]}/solr/sunspot-solr-production.log"}
  })
  owner 'vagrant'
  group 'vagrant'
end

directory '/home/vagrant/primero/log' do
  action :create
  owner 'vagrant'
  group 'vagrant'
end

cookbook_file '/home/vagrant/.pryrc' do
  source 'development/pryrc'
  owner 'vagrant'
  group 'vagrant'
  mode '0644'
end
