
default[:primero].tap do |p|
  p[:http_port] = 80
  p[:https_port] = 443
  p[:rails_env] = 'production'
  p[:home_dir] = '/srv/primero'
  p[:app_dir] = File.join(node[:primero][:home_dir], 'application')
  p[:log_dir] = File.join(node[:primero][:home_dir], 'logs')
  p[:app_user] = 'primero'
  p[:app_group] = 'primero'
  p[:solr_user] = 'solr'
  p[:solr_group] = 'solr'

  p[:queue].tap do |queue|
    queue[:host] = 'localhost'
    queue[:port] = '11300'
    queue[:storage_dir] = File.join(node[:primero][:home_dir], 'beanstalkd')
  end

  p[:no_reseed] = false

  p[:git].tap do |git|
    git[:repo] = 'git@bitbucket.org:primeroims/primero.git'
    git[:revision] = 'development'
  end

  p[:couchdb].tap do |c|
    c[:host] = 'localhost'
    c[:username] = 'primero'
    c[:cert_path] = '/etc/ssl/couch.crt'
    c[:key_path] = '/etc/ssl/private/couch.key'
    c[:client_ca_path] = '/etc/ssl/client_ca.crt'
    c[:root_ca_cert_source] = 'couch_ca.crt'
    c[:config].tap do |conf|
      conf[:httpd].tap do |httpd|
        httpd[:bind_address] = '0.0.0.0'
        httpd[:port] = '5984'
      end
      conf[:ssl].tap do |ssl|
        ssl['verify_ssl_certificates'] = true
      end
      conf[:compactions].tap do |compactions|
        compactions[:_default] = '[{db_fragmentation, "70%"}, {view_fragmentation, "60%"}, {from, "23:00"}, {to, "04:00"}]'
      end
      conf[:replicator].tap do |rep|
        rep['verify_ssl_certificates'] = true
      end
      conf[:query_servers].tap do |qs|
        qs[:javascript] = "/usr/bin/couchjs -S 134217728 /usr/share/couchdb/server/main.js"
      end
      conf[:couchdb].tap do |cdb|
        cdb[:os_process_timeout] = '20000'
      end
    end
  end

  p[:solr_hostname] = 'localhost'
  p[:solr_port] = 8983
  p[:solr_log_level] = 'INFO'
  p[:solr_data_dir] =  File.join(node[:primero][:app_dir], 'solr', 'data')
  p[:ruby_version] = '2.2.8'
  p[:ruby_patch] = 'railsexpress'

  p[:passenger_conf].tap do |pc|
    pc[:min_instances] = 1
    pc[:max_pool_size] = 6
  end
end

default[:rvm].tap do |rvm|
  rvm[:user_installs] = [
    {
      :user => node[:primero][:app_user],
      :home => node[:primero][:home_dir],
    }
  ]
  rvm[:vagrant][:system_chef_solo] = '/opt/chef/bin/chef-solo'
end

default[:nginx_dir] = '/etc/nginx'
default[:nginx_default_site] = true

default[:python][:install_method] = 'package'
default[:python][:setuptools_version] = '3.4.4'
default[:python][:virtualenv_version] = '1.11.4'
default[:supervisor][:version] = '3.1.2'
default[:supervisor][:minfds] = 16384
