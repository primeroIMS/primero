passenger_worker_file = "#{node[:primero][:app_dir]}/passenger-worker.sh"

template passenger_worker_file do
  source 'passenger_worker.sh.erb'
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

#Launch passenger via supervisord
supervisor_service 'passenger' do
  command passenger_worker_file
  autostart true
  autorestart true
  stopasgroup true

  redirect_stderr true
  stdout_logfile ::File.join(node[:primero][:home_dir], 'logs', 'rails', 'passenger.log')
  stdout_logfile_maxbytes '5MB'
  stdout_logfile_backups 0

  user node[:primero][:app_user]
  directory node[:primero][:app_dir]
  numprocs 1
  action [:enable, :restart]
end