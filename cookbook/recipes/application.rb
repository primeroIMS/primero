include_recipe 'apt'
include_recipe 'supervisor'
include_recipe 'primero::common'

%w(git
   libxml2-dev
   libxslt1-dev
   imagemagick
   openjdk-8-jre-headless
   inotify-tools).each do |pkg|
  package pkg
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
  mode '0400'
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
  user node[:primero][:app_user]
  runas 'root'
  nopasswd true
  env_keep_add ["RAILS_ENV", "RAILS_LOG_PATH"]
  commands  ['/usr/bin/apt-get', '/usr/bin/env', ::File.join(node[:primero][:home_dir], '.rvm/bin/rvmsudo')]
end

include_recipe 'rvm::user_install'

bashrc_file = "#{node[:primero][:home_dir]}/.bashrc"
execute 'Autoload RVM on sudo' do
  user node[:primero][:app_user]
  command "echo 'source ~/.rvm/scripts/rvm' >> #{bashrc_file}"
  not_if do
    ::File.readlines(bashrc_file).grep(/rvm\/scripts\/rvm/).size > 0
  end
end

execute 'Set RAILS_ENV' do
  user node[:primero][:app_user]
  command "echo 'export RAILS_ENV=production' >> #{bashrc_file}"
  not_if do
    ::File.readlines(bashrc_file).grep(/RAILS_ENV/).size > 0
  end
end

directory node[:primero][:bin_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

cookbook_file ::File.join(node[:primero][:bin_dir], 'reset_config_to') do
  source 'reset_config_to'
  user node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '0744'
end

railsexpress_patch_setup 'prod' do
  user node[:primero][:app_user]
  group node[:primero][:app_group]
end

directory node[:primero][:app_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

rvm_ruby_name = "#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}"
execute_with_ruby 'prod-ruby' do
  command <<-EOH
    rvm install #{node[:primero][:ruby_version]} -n #{node[:primero][:ruby_patch]} --patch #{node[:primero][:ruby_patch]}
    rvm rubygems #{node[:primero][:rubygems_version]} --force
    rvm --default use #{rvm_ruby_name}
    rvm reload && rvm repair all
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

directory node[:primero][:daemons_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

default_rails_log_dir = ::File.join(node[:primero][:app_dir], 'log')
scheduler_log_dir = ::File.join(node[:primero][:log_dir], 'scheduler')
[File.join(node[:primero][:log_dir], 'nginx'),
 scheduler_log_dir,
 File.join(node[:primero][:log_dir], 'rails'),
 default_rails_log_dir].each do |log_dir|
  directory log_dir do
    action :create
    owner node[:primero][:app_user]
    group node[:primero][:app_group]
  end
end

logrotate_app 'primero-production' do
  path ::File.join(rails_log_dir, '*.log')
  size 50 * 1024 * 1024
  rotate 20
  frequency nil
  options %w( copytruncate delaycompress compress notifempty missingok )
end

unless node[:primero][:couchdb][:password]
  Chef::Application.fatal!("You must specify the couchdb password in your node JSON file (node[:primero][:couchdb][:password])!")
end
unless node[:primero][:rails_env]
  Chef::Application.fatal!("You must specify the Primero Rails environment in node[:primero][:rails_env]!")
end

update_bundler 'prod-stack'
execute_with_ruby 'bundle-install' do
  command "bundle install --without development test cucumber"
  cwd node[:primero][:app_dir]
end

template File.join(node[:primero][:app_dir], 'config', 'sunspot.yml') do
  source "sunspot.yml.erb"
  variables({
    :environments => [ node[:primero][:rails_env] ],
    :hostnames => {node[:primero][:rails_env].to_s => node[:primero][:solr_hostname]},
    :ports => {node[:primero][:rails_env].to_s => node[:primero][:solr_port]},
    :log_levels => {node[:primero][:rails_env].to_s => node[:primero][:solr_log_level]},
    :log_files => {node[:primero][:rails_env].to_s => File.join(node[:primero][:log_dir], "solr/sunspot-solr-#{node[:primero][:rails_env]}.log")}
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

## This is a hack. This may be removed in the future.
execute_with_ruby 'clear_bundler_cache' do
  command <<-EOH
    if [ -d #{node[:primero][:app_dir]}/.bundle ];
    then
      grep -v BUNDLE_CLEAN #{node[:primero][:app_dir]}/.bundle/config > #{node[:primero][:app_dir]}/.bundle/config.tmp
      mv #{node[:primero][:app_dir]}/.bundle/config.tmp #{node[:primero][:app_dir]}/.bundle/config;
    fi
    EOH
end

update_bundler 'prod-stack' do
  bundler_version node[:primero][:bundler_version]
end
execute_with_ruby 'bundle-install' do
  command "bundle install --without development test cucumber"
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
  mode '444'
end


template File.join(node[:primero][:app_dir], 'config/mailers.yml') do
  source 'mailers.yml.erb'
  variables({
    :environments => [ node[:primero][:rails_env] ],
    :delivery_method => node[:primero][:mailer][:delivery_method],
    :mailer_host => node[:primero][:mailer][:host],
    :mailer_from_address => node[:primero][:mailer][:from_address],
    :smtp_conf => node[:primero][:mailer][:smtp_conf]
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '444'
end

template File.join(node[:primero][:app_dir], 'config/locales.yml') do
  source 'locales.yml.erb'
  variables({
    :environments => [ node[:primero][:rails_env] ],
    :default_locale => node[:primero][:locales][:default_locale],
    :locales => node[:primero][:locales][:locales],
  })
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '444'
end

app_tmp_dir = ::File.join(node[:primero][:app_dir], 'tmp')
directory app_tmp_dir do
  action :create
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

include_recipe 'primero::solr'
include_recipe 'primero::queue'
include_recipe 'primero::couch_watcher'
include_recipe 'primero::queue_consumer'

execute_bundle 'setup-db-migrate-design-views' do
  command "rake db:migrate:design"
end

if !node[:primero][:seed][:enabled]
  execute_bundle 'setup-db-seed' do
    command "rake db:seed"
    environment({"NO_RESEED" => "true"}) if node[:primero][:no_reseed]
  end
end

execute_bundle 'setup-db-migrate' do
  command "rake db:migrate"
end

# TODO: This will have to be subtle. Will need to define "what is sutble"?
execute_bundle 'reindex-solr' do
  command "rake sunspot:reindex"
end

execute_bundle 'clear-cache' do
  command "rake tmp:cache:clear"
end

execute_bundle 'precompile-assets' do
  command "rake app:assets_precompile"
end

include_recipe 'primero::primero_scheduler'

# This will set the latest sequence numbers in the couch history log so that it
# doesn't try to reprocess things from the seed/migration
execute_bundle 'prime-couch-watcher-sequence-numbers' do
  #TODO: Will this fail?
  command "#{::File.join(node[:primero][:home_dir], '.rvm/bin/rvmsudo')} rake couch_changes:prime_sequence_numbers"
  environment({"RAILS_LOG_PATH" => ::File.join(node[:primero][:log_dir], 'couch_watcher')})
end

supervisor_service 'couch-watcher' do
  action :start
end

supervisor_service 'who-watches-the-couch-watcher' do
  action :start
end

include_recipe 'primero::nginx_app'

execute 'Reload Passenger' do
  command 'systemctl restart passenger'
end
