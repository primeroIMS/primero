# Based on Passenger Systemd integration presented here:
# https://github.com/mtgrosser/passenger-systemd

passenger_worker_file = "#{node[:primero][:app_dir]}/passenger-worker.sh"
passenger_pid = "#{node[:primero][:app_dir]}/tmp/passenger.pid"
passenger_log = "#{node[:primero][:log_dir]}/rails/passenger.log"

template passenger_worker_file do
  source 'passenger/passenger-worker.erb'
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  variables({
    passenger_pid: passenger_pid,
    passenger_log: passenger_log,
    conf: node[:primero][:passenger_conf]
  })
end

template '/etc/systemd/system/passenger.service' do
  source 'passenger/passenger.service.erb'
  variables({
    passenger_app: passenger_worker_file,
    passenger_pid: passenger_pid
  })
end

execute 'Reload Systemd' do
  command 'systemctl daemon-reload'
end

execute 'Reload Passenger' do
  command 'systemctl restart passenger'
end