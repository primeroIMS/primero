# Based on Passenger Systemd integration presented here:
# https://github.com/mtgrosser/passenger-systemd

puma_config_file = "#{node[:primero][:app_dir]}/config/puma.rb"
puma_pid = "#{node[:primero][:app_dir]}/tmp/puma.pid"
puma_state = "#{node[:primero][:app_dir]}/tmp/puma.state"
rails_log_dir = "#{node[:primero][:log_dir]}/rails/"
puma_log = "#{rails_log_dir}/puma.log"
puma_error_log = "#{rails_log_dir}/puma_error.log"

template puma_config_file do
  source 'puma/puma.erb'
  mode '0755'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  variables({
    puma_pid: puma_pid,
    puma_log: puma_log,
    rails_log_dir: rails_log_dir,
    min_thread_count: node[:puma_conf][:min_thread_count],
    max_thread_count: node[:puma_conf][:max_thread_count],
    puma_error_log: puma_error_log,
    port: node[:puma_conf][:port]
  })
end

template '/etc/systemd/system/puma.service' do
  source 'puma/puma.service.erb'
  variables({
    puma_pid: puma_pid,
    puma_state: puma_state
  })
end

execute 'Reload Systemd' do
  command 'systemctl daemon-reload'
end

execute 'Enable Puma' do
  command 'systemctl enable puma.service'
end

execute 'Reload Puma' do
  command 'systemctl restart puma'
end
