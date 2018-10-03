scheduler_log_dir = ::File.join(node[:primero][:log_dir], 'primero-scheduler')

directory scheduler_log_dir do
  action :create
  mode '0700'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

scheduler_worker_file = "#{node[:primero][:daemons_dir]}/primero-scheduler-worker.sh"

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

template '/etc/systemd/system/primero_scheduler.service' do
  source 'primero_scheduler.service.erb'
end

execute 'Reload Systemd' do
  command 'systemctl daemon-reload'
end

execute 'Enable Primero Scheduler' do
  command 'systemctl enable primero_scheduler.service'
end

execute 'Restart Primero Scheduler' do
  command 'systemctl restart primero_scheduler'
end
