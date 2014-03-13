define :execute_as_primero, :command => nil, :cwd => nil do
  execute params[:name] do
    command params[:command]
    user node[:primero][:app_user]
    group node[:primero][:app_group]
    cwd params[:cwd]
  end
end

define :execute_with_ruby, :command => nil, :cwd => nil do
  command = params[:command]
  rvm_shell "ruby-#{params[:name]}" do
    code command
    cwd params[:cwd]
    environment({ 'RAILS_ENV' => node[:primero][:rails_env] })
    user node[:primero][:app_user]
    group node[:primero][:app_group]
  end
end

define :execute_bundle, :command => nil do
  command = params[:command]
  execute_with_ruby "bundle-#{params[:name]}" do
    command "bundle exec #{command}"
    cwd node[:primero][:app_dir]
  end
end
