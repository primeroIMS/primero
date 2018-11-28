no_reseed_file = ::File.join(node[:primero][:config_dir], 'no_reseed.txt')
if !node[:primero][:no_reseed]
  file no_reseed_file do
    action :delete
  end
end

directory node[:primero][:config_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

ssh_dir = ::File.join(node[:primero][:home_dir], '.ssh')
directory ssh_dir do
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '0700'
end

private_key_path = ::File.join(ssh_dir, 'config_id_rsa')
file private_key_path do
  content node[:primero][:seed][:deploy_key]
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

git_wrapper_path = ::File.join(ssh_dir, 'git-wrapper-config.sh')
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

git node[:primero][:config_dir] do
  repository node[:primero][:seed][:git][:repo]
  revision node[:primero][:seed][:git][:revision_config]
  #Note: The 2 options below are a workaround for a Chef 0.9.0 bug
  enable_checkout false
  checkout_branch 'deploy-config'
  action :sync
  user node[:primero][:app_user]
  group node[:primero][:app_group]
  ssh_wrapper git_wrapper_path
end

if node[:primero][:seed][:enabled]
  reset_script = ::File.join(node[:primero][:home_dir], 'bin', 'reset_config_to')
  config_script = node[:primero][:seed][:script]
  json_file = node[:primero][:seed][:bundle]
  if config_script
    config_script_path = node[:primero][:config_dir] + config_script
    execute 'run-config-script' do
      command "#{reset_script} #{config_script_path}"
      cwd node[:primero][:app_dir]
      user node[:primero][:app_user]
      environment({
        'HOME' => node[:primero][:home_dir],
        'RAILS_ENV' => 'production'
      })
      not_if { ::File.exists?(no_reseed_file) }
    end
  elsif json_file
    json_file_path = node[:primero][:config_dir] + json_file
    execute_bundle 'load-config-bundle' do
      command "rake db:data:import_config_bundle[#{json_file_path}]"
      not_if { ::File.exists?(no_reseed_file) }
    end
  end

  if node[:primero][:no_reseed]
    file no_reseed_file do
      mode '0644'
      owner node[:primero][:app_user]
      group node[:primero][:app_group]
    end
  end

  execute 'Reload Puma' do
    command 'systemctl restart puma.service'
  end

  execute 'Reload Scheduler' do
    command 'systemctl restart primero_scheduler'
  end

  execute 'Reload Backburner' do
    command 'systemctl restart backburner'
  end

  execute 'Reload Couch Watcher' do
    command 'systemctl restart couch_watcher'
  end

end
