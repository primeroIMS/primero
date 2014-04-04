define :execute_as_primero, :command => nil, :cwd => nil do
  execute params[:name] do
    command params[:command]
    user node[:primero][:app_user]
    group node[:primero][:app_group]
    cwd params[:cwd]
  end
end

define :execute_with_ruby, :command => nil, :cwd => nil, :rails_env => nil, :user => nil, :group => nil do
  params[:rails_env] ||= node[:primero][:rails_env]
  params[:user] ||= node[:primero][:app_user]
  params[:group] ||= node[:primero][:app_group]
  params[:cwd] ||= node[:primero][:app_dir]

  command = params[:command]
  args = params
  rvm_shell "ruby-#{params[:name]}" do
    code command
    cwd args[:cwd]
    environment({ 'RAILS_ENV' => args[:rails_env] })
    user args[:user]
    group args[:group]
  end
end

define :execute_bundle, :command => nil, :cwd => nil, :rails_env => nil, :user => nil, :group => nil do
  params[:cwd] ||= node[:primero][:app_dir]
  command = params[:command]
  args = params
  execute_with_ruby "bundle-#{params[:name]}" do
    command "bundle exec #{command}"
    cwd args[:cwd]
    rails_env args[:rails_env]
    user args[:user]
    group args[:group]
  end
end
