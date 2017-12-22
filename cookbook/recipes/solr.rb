
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

execute 'change solr owner' do
  command "chown #{node[:primero][:solr_user]}.#{node[:primero][:solr_group]} -R #{node[:primero][:solr_data_dir]}"
  only_if { ::File.exists?(node[:primero][:solr_data_dir])}
end

solr_memory = node[:primero][:solr_memory]
memory_param = solr_memory ? "-Xmx#{solr_memory}" : ""

supervisor_service 'solr' do
  command "java #{memory_param} -Djetty.port=8983 -Dsolr.data.dir=#{node[:primero][:solr_data_dir]}/production -Dsolr.solr.home=#{node[:primero][:app_dir]}/solr -Djava.awt.headless=true -jar start.jar"
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
  # TODO: figure out how to make this more dynamic so we aren't hardcoding the
  # sunspot_solr gem dir.  That, or install solr outside of gems
  directory "#{node[:primero][:home_dir]}/.rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/gems/sunspot_solr-2.2.7/solr/"
  numprocs 1
  action [:enable, :restart]
end

file "/etc/cron.daily/solr_restart" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

supervisorctl restart solr
EOH
end
