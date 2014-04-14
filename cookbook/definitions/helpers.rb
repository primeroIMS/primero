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

# The following is per http://stackoverflow.com/a/20830324/1009106 for a bug
# that causes the bundle install to bomb out when using the 2.1.0 default
# gemset with rvm
define :update_bundler, :user => nil, :group => nil do
  args = params
  execute_with_ruby "upgrade-bundler-#{params[:name]}" do
    command "[[ $(bundle --version | awk '{ print $3 }') == '1.5.0' ]] && gem update bundler || true"
    user args[:user]
    group args[:group]
  end
end
