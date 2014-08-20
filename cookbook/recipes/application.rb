include_recipe 'apt'

%w(git
   libxml2-dev
   libxslt1-dev
   imagemagick
   openjdk-7-jdk).each do |pkg|
  package pkg
end


group node[:primero][:app_group] do
  system false
end

user node[:primero][:app_user] do
  system false
  home node[:primero][:home_dir]
  gid node[:primero][:app_group]
  shell '/bin/bash'
end

directory node[:primero][:home_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

ssh_dir = File.join(node[:primero][:home_dir], '.ssh')
directory ssh_dir do
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '0700'
end

private_key_path = ::File.join(ssh_dir, 'id_rsa')
file private_key_path do
  content node[:primero][:deploy_key]
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '0400'
end

known_hosts_path = ::File.join(ssh_dir, 'known_hosts')
cookbook_file known_hosts_path do
  source 'ssh/known_hosts'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

git_wrapper_path = File.join(ssh_dir, 'git-wrapper.sh')
template git_wrapper_path do
  source 'ssh_wrapper.sh.erb'
  mode '0744'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  variables({
    :deploy_private_key_path => private_key_path,
    :known_hosts_file => known_hosts_path,
  })
end

# Hack to get around https://github.com/fnichol/chef-rvm/issues/227
sudo "#{node[:primero][:app_user]}-rvm" do
  user      node[:primero][:app_user]
  runas     'root'
  nopasswd true
  commands  ['/usr/bin/apt-get', '/usr/bin/env']
end

include_recipe 'rvm::user_install'

railsexpress_patch_setup 'prod' do
  user node[:primero][:app_user]
  group node[:primero][:app_group]
end

execute_with_ruby 'prod-ruby' do
  command <<-EOH
    rvm install #{node[:primero][:ruby_version]} -n #{node[:primero][:ruby_patch]} --patch #{node[:primero][:ruby_patch]}
    rvm --default use #{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}
  EOH
end

# Run a `git reset` before this step??
git node[:primero][:app_dir] do
  repository node[:primero][:git][:repo]
  revision node[:primero][:git][:revision]
  action :sync
  user node[:primero][:app_user]
  group node[:primero][:app_group]
  ssh_wrapper git_wrapper_path
end

unless node[:primero][:couchdb][:password]
  Chef::Application.fatal!("You must specify the couchdb password in your node JSON file (node[:primero][:couchdb][:password])!")
end
unless node[:primero][:rails_env]
  Chef::Application.fatal!("You must specify the Primero Rails environment in node[:primero][:rails_env]!")
end


template File.join(node[:primero][:app_dir], 'config', 'sunspot.yml') do
  source "sunspot.yml.erb"
  variables({
    :environments => [ node[:primero][:rails_env] ],
    :hostnames => {node[:primero][:rails_env].to_s => node[:primero][:solr_hostname]},
    :ports => {node[:primero][:rails_env].to_s => node[:primero][:solr_port]},
    :log_levels => {node[:primero][:rails_env].to_s => node[:primero][:solr_log_level]}
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end


template File.join(node[:primero][:app_dir], "public", "version.txt") do
  source 'version.txt.erb'
  variables({
    # TODO: Figure out how to get the right values for app_version and
    # latest_revision
    :app_version => node[:primero][:git][:revision],
    :repository => node[:primero][:git][:repo],
    :branch => node[:primero][:git][:revision],
    :latest_revision => node[:primero][:git][:revision],
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

update_bundler 'prod-stack'
execute_with_ruby 'bundle-install' do
  command "bundle install"
  cwd node[:primero][:app_dir]
end

template File.join(node[:primero][:app_dir], 'config/couchdb.yml') do
  source 'couch_config.yml.erb'
  variables({
    :environments => [ node[:primero][:rails_env] ],
    :couchdb_host => node[:primero][:couchdb][:host],
    :couchdb_username => node[:primero][:couchdb][:username],
    :couchdb_password => node[:primero][:couchdb][:password],
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

execute_bundle 'restart-solr' do
  command "rake sunspot:solr:restart"
end

# TODO: This will have to be subtle. Will need to define "what is sutble"?
execute_bundle 'reindex-solr' do
  command "rake sunspot:reindex"
end

execute_bundle 'setup-db' do
  command "rake db:seed db:migrate"
end

execute_bundle 'precompile-assets' do
  command "rake app:assets_precompile"
end

execute_bundle 'restart-scheduler' do
  command "rake scheduler:restart"
end
