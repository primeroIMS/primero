
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
  mode '0777'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

directory "#{node[:primero][:app_dir]}/solr/data" do
  action :create
  mode '0755'
  owner node[:primero][:solr_user]
  group node[:primero][:solr_group]
end

execute 'change solr owner' do
  command "chown #{node[:primero][:solr_user]}.#{node[:primero][:solr_group]} -R #{node[:primero][:app_dir]}/solr/data"
  only_if { ::File.exists?("#{node[:primero][:app_dir]}/solr/data")}
end

supervisor_service 'solr' do
  command "java -Djetty.port=8983 -Dsolr.data.dir=#{node[:primero][:app_dir]}/solr/data/production -Dsolr.solr.home=#{node[:primero][:app_dir]}/solr -Djava.awt.headless=true -jar start.jar"
  environment({'RAILS_ENV' => 'production'})
  autostart true
  autorestart true

  redirect_stderr true
  stdout_logfile ::File.join(log_base_dir, 'output.log')
  stdout_logfile_maxbytes '5MB'
  stdout_logfile_backups 0

  user node[:primero][:solr_user]
  # TODO: figure out how to make this more dynamic so we aren't hardcoding the
  # sunspot_solr gem dir.  That, or install solr outside of gems
  directory "#{node[:primero][:home_dir]}/application/vendor/bundle/ruby/#{node[:primero][:ruby_version]}/gems/sunspot_solr-2.1.1/solr/"
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

