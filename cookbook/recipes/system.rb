set_limit 'nginx' do
  type 'hard'
  item 'nofile'
  value node[:system][:file_limit_hard]
end

set_limit 'nginx' do
  type 'soft'
  item 'nofile'
  value node[:system][:file_limit_soft]
end

sysctl_param 'fs.file-max' do
  value node[:system][:fs_file_max]
end

sysctl_param 'net.core.somaxconn' do
  value node[:system][:net_core_somaxconn]
end

sysctl_param 'net.core.netdev_max_backlog' do
  value node[:system][:net_core_netdev_max_backlog]
end