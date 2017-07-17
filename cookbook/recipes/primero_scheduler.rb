scheduler_log_dir = ::File.join(node[:primero][:log_dir], 'primero-scheduler')

directory scheduler_log_dir do
  action :create
  mode '0700'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

scheduler_worker_file = "#{node[:primero][:app_dir]}/primero-scheduler-worker.sh"

file scheduler_worker_file do
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  content <<-EOH
#!/bin/bash
#Launch the Primero Scheduler worker
source #{::File.join(node[:primero][:home_dir],'.rvm','scripts','rvm')}
RAILS_ENV=#{node[:primero][:rails_env]} RAILS_SCHEDULER_LOG_DIR=#{scheduler_log_dir} bundle exec rake scheduler:run
EOH
end

#Launch the rake task via supervisord
supervisor_service 'primero-scheduler' do
  command scheduler_worker_file
  autostart true
  autorestart true
  stopasgroup true
  killasgroup true

  redirect_stderr true
  stdout_logfile ::File.join(scheduler_log_dir, 'output.log')
  stdout_logfile_maxbytes '5MB'
  stdout_logfile_backups 0

  user node[:primero][:app_user]
  directory node[:primero][:app_dir]
  numprocs 1
  action [:enable, :restart]
end
