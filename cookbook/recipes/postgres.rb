execute 'Apt Update' do
  command 'apt-get update'
end

%w(postgresql postgresql-contrib libpq-dev).each do |package|
  package package
end

execute 'Create Postgres role' do
  command "psql -c \"create role #{node[:primero][:postgres][:role]} with superuser login password '#{node[:primero][:postgres][:password]}';\""
  user 'postgres'
  only_if { `sudo -upostgres psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='#{node[:primero][:postgres][:role]}'"`.to_i != 1}
end