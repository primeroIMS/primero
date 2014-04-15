
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

%w(tmux vim curl firefox xvfb).each do |pkg|
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
    :couchdb_host => [:primero][:couchdb][:host],
    :couchdb_username => [:primero][:couchdb][:username],
    :couchdb_password => node[:primero][:couchdb][:password],
  })
  owner 'vagrant'
  group 'vagrant'
end

template '/home/vagrant/primero/config/solr.yml' do
  source "solr.yml.erb"
  variables({
    :solr_port => node[:primero][:solr_port],
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

template '/home/vagrant/primero/config/selenium.yml' do
  source "selenium.yml.erb"
  variables({
    :selenium_server => node[:primero][:selenium_server],
    :integration_server => node[:primero][:integration_server],
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

execute_bundle 'setup-db-dev' do
  command "rake couchdb:create db:seed db:migrate" 
  cwd '/home/vagrant/primero'
  rails_env 'development'
  user 'vagrant'
  group 'vagrant'
end

cookbook_file '/etc/profile.d/xvfb_display.sh' do
  source 'xvfb/set_display.sh'
  owner 'root'
  group 'root'
  mode '0644'
end

cookbook_file '/etc/init/xvfb.conf' do
  source 'xvfb/upstart_script.conf'
  owner 'root'
  group 'root'
  mode '0644'
end

service 'xvfb' do
  action [:enable, :start]
  provider Chef::Provider::Service::Upstart
end
