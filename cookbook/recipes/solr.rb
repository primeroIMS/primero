
# Install the unzip package
package "unzip" do
  action :install
end

group node[:primero][:solr_group] do
  system true
end

user node[:primero][:solr_user] do
  system true
  home node[:primero][:home_dir]
  gid node[:primero][:solr_group]
  shell '/bin/bash'
end

log_base_dir = ::File.join(node[:primero][:log_dir], 'solr')

directory log_base_dir do
  action :create
  mode '0700'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

directory node[:primero][:solr_data_dir] do
  action :create
  mode '0700'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

directory node[:primero][:solr_core_dir] do
  action :create
  mode '0700'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

execute 'change solr owner' do
  command "chown #{node[:primero][:solr_user]}.#{node[:primero][:solr_group]} -R #{node[:primero][:solr_data_dir]}"
  only_if { ::File.exists?(node[:primero][:solr_data_dir])}
end



['production'].each do |core_name|
  core_dir = File.join(node[:primero][:solr_core_dir], core_name)
  directory core_dir do
    action :create
    mode '0700'
    owner node[:primero][:solr_user]
    group node[:primero][:solr_group]
  end
  template File.join(core_dir, 'core.properties') do
    source "core.properties.erb"
    variables({
      :data_dir => File.join(node[:primero][:solr_data_dir], core_name)
    })
    owner node[:primero][:solr_user]
    group node[:primero][:solr_group]
  end
end

# TODO: Hack as is in the line 79. make dinamic the gem of sunspot. sunspot_solr-2.3.0
# For some reason solr try to log in this location despite the fact that we indicate a different one.
another_log_base_dir = "#{node[:primero][:home_dir]}/.rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/gems/sunspot_solr-2.3.0/solr/server/logs"
directory another_log_base_dir do
  action :create
  mode '0700'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

solr_memory = node[:primero][:solr_memory]
memory_param = solr_memory ? "-m #{solr_memory}" : ""

# TODO: figure out how to make this more dynamic so we aren't hardcoding the
# sunspot_solr gem dir.  That, or install solr outside of gems
solr_bin_dir = "#{node[:primero][:home_dir]}/.rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/gems/sunspot_solr-2.3.0/solr/bin"
supervisor_service 'solr' do
  command "#{solr_bin_dir}/solr start -f -p 8983 -s /srv/primero/application/solr #{memory_param}"
  environment({'RAILS_ENV' => 'production'})
  autostart true
  autorestart true
  stopasgroup true
  killasgroup true

  redirect_stderr true
  stdout_logfile ::File.join(log_base_dir, 'output.log')
  stdout_logfile_maxbytes '5MB'
  stdout_logfile_backups 0

  user node[:primero][:solr_user]
  directory solr_bin_dir
  numprocs 1
  action [:enable, :stop, :start]
end

file "/etc/cron.daily/solr_restart" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

supervisorctl stop solr
sleep 10
supervisorctl start solr
EOH
end
