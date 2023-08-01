#! /usr/bin/env ruby

require_relative('../lib/primero_database')

def check_migrated
  if PrimeroDatabase.instance.migrated?
    puts 'DATABASE_MIGRATED'
  else
    puts 'DATABASE_MIGRATION_PENDING'
  end

  PrimeroDatabase.instance.connection.close
end

check_migrated
