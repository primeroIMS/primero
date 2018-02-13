include_recipe 'apt'
include_recipe 'supervisor'
include_recipe 'primero::common'

%w(git
   libxml2-dev
   libxslt1-dev
   imagemagick
   openjdk-7-jre-headless
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

railsexpress_patch_setup 'prod' do
  user node[:primero][:app_user]
  group node[:primero][:app_group]
end

#why this wasn't before?
directory node[:primero][:app_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

rvm_ruby_name = "#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}"
execute_with_ruby 'prod-ruby' do
  command <<-EOH
    rvm install #{node[:primero][:ruby_version]} -n #{node[:primero][:ruby_patch]} --patch #{node[:primero][:ruby_patch]}
    rvm rubygems #{node[:primero][:rubygems_version]}
    rvm --default use #{rvm_ruby_name}
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
 File.join(node[:primero][:log_dir], 'couch_watcher'),
 File.join(node[:primero][:log_dir], 'rails'),
 default_rails_log_dir].each do |log_dir|
  directory log_dir do
    action :create
    owner node[:primero][:app_user]
    group node[:primero][:app_group]
  end
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

include_recipe 'primero::solr'
include_recipe 'primero::queue'

app_tmp_dir = ::File.join(node[:primero][:app_dir], 'tmp')
directory app_tmp_dir do
  action :create
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

couch_watcher_log_dir = ::File.join(node[:primero][:log_dir], 'couch_watcher')
directory couch_watcher_log_dir do
  action :create
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

[::File.join(node[:primero][:app_dir], 'tmp/couch_watcher_history.json'),
 ::File.join(node[:primero][:app_dir], 'tmp/couch_watcher_restart.txt'),
 ::File.join(node[:primero][:log_dir], 'couch_watcher/production.log')
].each do |f|
  file f do
    #content ''
    #NOTE: couch_watcher_restart.txt must be 0666 to allow any user importing a config bundle
    #      to be able to touch the file, triggering a restart of couch_watcher
    #TODO: This is a hack, and probably no longer needed now that couch_watcher and passenger
    #      run as 'primero'
    mode '0666'
    owner node[:primero][:app_user]
    group node[:primero][:app_group]
    #action :create_if_missing
  end
end

couchwatcher_worker_file = "#{node[:primero][:daemons_dir]}/couch-watcher-worker.sh"
file couchwatcher_worker_file do
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  content <<-EOH
#!/bin/bash
#Launch the Couch Watcher
#This file is generated by Chef
cd #{node[:primero][:app_dir]}
source #{::File.join(node[:primero][:home_dir],'.rvm','scripts','rvm')}
export PASSENGER_TEMP_DIR=#{node[:primero][:app_dir]}/tmp
RAILS_ENV=#{node[:primero][:rails_env]} RAILS_LOG_PATH=#{couch_watcher_log_dir} bundle exec rails r lib/couch_changes/base.rb
EOH
end

supervisor_service 'couch-watcher' do
  command couchwatcher_worker_file
  autostart true
  autorestart true
  user node[:primero][:app_user]
  directory node[:primero][:app_dir]
  numprocs 1
  killasgroup true
  stopasgroup true
  redirect_stderr true
  stdout_logfile ::File.join(couch_watcher_log_dir, '/output.log')
  stdout_logfile_maxbytes '20MB'
  stdout_logfile_backups 0
  # We want to stop the watcher before doing seeds/migrations so that it
  # doesn't go crazy with all the updates.  Make sure that everything that it
  # does is also done in this recipe (e.g. reindex solr, reset memoization,
  # etc..)
  action [:enable, :stop]
end

who_watches_worker_file = "#{node[:primero][:daemons_dir]}/who-watches-the-couch-watcher.sh"

file who_watches_worker_file do
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  content <<-EOH
#!/bin/bash
#Look for any changes to /tmp/couch_watcher_restart.txt.
#When a change occurrs to that file, restart couch-watcher
inotifywait #{::File.join(node[:primero][:app_dir], 'tmp')}/couch_watcher_restart.txt && supervisorctl restart couch-watcher
EOH
end

supervisor_service 'who-watches-the-couch-watcher' do
  command who_watches_worker_file
  autostart true
  autorestart true
  directory node[:primero][:app_dir]
  numprocs 1
  killasgroup true
  stopasgroup true
  redirect_stderr true
  stdout_logfile ::File.join(node[:primero][:log_dir], 'couch_watcher/restart.log')
  stdout_logfile_maxbytes '20MB'
  stdout_logfile_backups 0
  # We want to stop the watcher before doing seeds/migrations so that it
  # doesn't go crazy with all the updates.  Make sure that everything that it
  # does is also done in this recipe (e.g. reindex solr, reset memoization,
  # etc..)
  action [:enable, :stop]
end

include_recipe 'primero::queue_consumer'

execute_bundle 'setup-db-migrate-design-views' do
  command "rake db:migrate:design"
end

execute_bundle 'setup-db-seed' do
  command "rake db:seed"
  environment({"NO_RESEED" => "true"}) if node[:primero][:no_reseed]
end

execute_bundle 'setup-db-migrate' do
  command "rake db:migrate"
end

# TODO: This will have to be subtle. Will need to define "what is sutble"?
execute_bundle 'reindex-solr' do
  command "rake sunspot:reindex"
end

execute_bundle 'precompile-assets' do
  command "rake app:assets_precompile"
end

include_recipe 'primero::primero_scheduler'

# This will set the latest sequence numbers in the couch history log so that it
# doesn't try to reprocess things from the seed/migration
execute_bundle 'prime-couch-watcher-sequence-numbers' do
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
