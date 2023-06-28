#! /usr/bin/env ruby

require_relative('../lib/primero_database.rb')

def check_migrated
  if PrimeroDatabase.instance.migrated?
    puts 'Database already migrated!'
    PrimeroDatabase.connection.close
    exit 1
  else
    exit 0
  end
end

check_migrated
