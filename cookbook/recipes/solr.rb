
group node[:primero][:solr_group] do
  system true
end

user node[:primero][:solr_user] do
  system true
  home node[:primero][:home_dir]
  gid node[:primero][:solr_group]
  shell '/bin/bash'
end

execute "chown #{node[:primero][:solr_user]}.#{node[:primero][:solr_group]} -R #{node[:primero][:app_dir]}/solr/data"

supervisor_service 'solr' do
  command "java -Djetty.port=8983 -Dsolr.data.dir=#{node[:primero][:app_dir]}/solr/data/production -Dsolr.solr.home=#{node[:primero][:app_dir]}/solr -Djava.awt.headless=true -jar start.jar"
  environment({'RAILS_ENV' => 'production'})
  autostart true
  autorestart true
  killasgroup true
  stopasgroup true
  user node[:primero][:solr_user]
  # TODO: figure out how to make this more dynamic so we aren't hardcoding the
  # sunspot_solr gem dir.  That, or install solr outside of gems
  directory "#{node[:primero][:home_dir]}/.rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/gems/sunspot_solr-2.1.1/solr/"
  numprocs 1
  action [:enable, :restart]
end

