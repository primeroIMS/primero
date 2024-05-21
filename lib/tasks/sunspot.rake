# frozen_string_literal: true

require 'sunspot/rails/tasks'
require 'rsolr'

# Monekypatch: Use the same PID file for different rails envs
# A single Solr instance has multiple cores (one each for every rails env)
class Sunspot::Rails::Server
  def pid_file
    'sunspot.pid'
  end
end

namespace :sunspot do
  desc 'Wait for solr to be started'
  task :wait, [:timeout] => :environment do |_, args|
    seconds = args[:timeout] ? args[:timeout].to_i : 30
    puts "Waiting #{seconds} seconds for Solr to start..."

    Timeout.timeout(seconds, nil, 'Solr is not responding') do
      sleep 1 until HealthCheckService.solr_accessible?
    end
  end

  Rake::Task['sunspot:reindex'].clear
  desc 'Reindex all indexeable models'
  task reindex: :wait do
    unless Rails.configuration.solr_enabled
      puts 'Reindex not performed. SolR not enabled'
      next
    end

    puts 'Reindexing Solr...'
    location_service = LocationService.new(true)
    [Child, Incident, TracingRequest, Trace, RegistryRecord, Family].each do |model|
      batch_reindex(model, 500, location_service)
    end
    puts 'Solr successfully reindexed'
  end

  desc 'Remove all records from Solr'
  task remove_all: :environment do
    unless Rails.configuration.solr_enabled
      puts 'SolR not enabled'
      next
    end

    indexed_types = [
      Child, Incident, TracingRequest, Trace, RegistryRecord, Family
    ]

    puts "Removing the following record types from the Solr index: #{indexed_types.join(', ')}"
    Sunspot.remove_all!(*indexed_types)
  end

  def batch_reindex(model, batch_size = 500, location_service = nil)
    return unless Rails.configuration.solr_enabled

    puts "Reindexing #{model.count} #{model.name} records in batches of #{batch_size}..."

    model.all.find_in_batches(batch_size:) do |records|
      records.each { |r| r.location_service = location_service } unless model == Trace
      Sunspot.index(records)
    end
  end
end
