require 'restclient'
require 'fileutils'
require 'erb'
require 'readline'


def databases_for_env
    COUCHDB_SERVER.databases
                  .select { |db| db =~ /_#{Rails.env}$/ }
                  .map { |name| COUCHDB_SERVER.database(name) }
end

namespace :db do

    namespace :test do
    task :prepare do
      # do nothing - work around
      # cucumber is calling this
      # but does not exist anymore
      # in rails 4
    end
  end

  desc "Remove roles and any reference of the role from users."
  task :remove_roles, [:role] => :environment do |t, args|
    role = Role.find_by_name(args[:role])
    if role
      result = false
      remove = true
      User.all.all.each do |user|
        if user.role_ids.include?(role.id)
          if user.role_ids.size > 1
            user.role_ids.delete(role.id)
            user_changed = user.save
            puts "Role '#{args[:role]}' removed from user: #{user.user_name}" if user_changed
          else
            remove = false
            puts "Role '#{args[:role]}' can't be removed from user: #{user.user_name} because is the last role of the user."
          end
        end
      end
      result = role.destroy if remove
      puts "Removed role '#{args[:role]}'" if result
      puts "Unable to removed role '#{args[:role]}'" unless result
    else
      puts "Was not found the role '#{args[:role]}'"
    end
  end

  desc "Delete out a user"
  task :remove_user, [:user] => :environment do |t, args|
    #TODO: need to handle record owners, associated users?
    user = User.by_user_name(key: args[:user]).all.first
    if user.present?
      puts "Deleting user #{user.user_name}"
      user.destroy
    end
  end

  desc "Seed with data (task manually created during the 3.0 upgrade, as it went missing)"
  task :seed => :environment do
    load(Rails.root.join("db", "seeds.rb"))
  end

  task :migrate => :environment do
    Migration.migrate
  end

  desc "Create system administrator for couchdb. This is needed only if you are interested to test out replications"
  task :create_couch_sysadmin, :user_name, :password do |t, args|
    puts "
      **************************************************************
          Welcome to RapidFTR couchdb system administrator setup
      **************************************************************
    "

    url       = "http://localhost:5984"
    user_name = args[:user_name] || get("Enter username for CouchDB: ")
    password  = args[:password]  || get("Enter password for CouchDB: ")

    begin
      RestClient.post "#{url}/_session", "name=#{user_name}&password=#{password}", {:content_type => 'application/x-www-form-urlencoded'}
      puts "Administrator account #{user_name} is already existing and verified"
    rescue RestClient::Request::Unauthorized
      full_host = "#{url}/_config/admins/#{user_name}"
      RestClient.put full_host, "\""+password+"\"", {:content_type => :json}
      puts "Administrator account #{user_name} has been created"
    end
  end

  desc "Create/Copy couchdb.yml from cocuhdb.yml.example"
  task :create_couchdb_yml, :user_name, :password  do |t, args|
    default_env = ENV['RAILS_ENV'] || "development"
    environments = ["development", "test", "cucumber", "production", "uat", "standalone", "android", default_env].uniq
    user_name = ENV['couchdb_user_name'] || args[:user_name] || ""
    password = ENV['couchdb_password'] || args[:password] || ""

    default_config = {
      "host" => "localhost",
      "port" => 5984,
      "https_port" => 6984,
      "prefix" => "primero",
      "username" => user_name,
      "password" => password,
      "ssl" => false
    }

    couchdb_config = {}
    environments.each do |env|
      couchdb_config[env] = default_config.merge("suffix" => "#{env}")
    end

    write_file Rails.root.to_s+"/config/couchdb.yml", couchdb_config.to_yaml
  end

  task :delete => :environment do
    databases_for_env.each do |db|
      db.delete!
    end
  end

  namespace :migrate do
    desc "Resets migrations metadata. Use with extreme caution!!!"
    task :clean => :environment do
      Migration.database.recreate!
    end
  end

end

def write_file name, content
  puts "Writing #{name}..."
  File.open(name, 'w') do |file|
    file.write content
  end
end

def get prompt
  Readline.readline prompt
end

