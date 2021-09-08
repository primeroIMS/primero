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
    puts 'Reindexing Solr...'
    location_service = LocationService.new(true)
    [Child, Incident, TracingRequest, Trace].each { |m| batch_reindex(m, 500, location_service) }
    puts 'Solr successfully reindexed'
  end

  desc 'Remove all records from Solr'
  task remove_all: :environment do
    indexed_types = [
      Child, Incident, TracingRequest,
      Flag, ReportableFollowUp, ReportableProtectionConcern,
      ReportableService, Violation, Trace
    ]

    puts "Removing the following record types from the Solr index: #{indexed_types.join(', ')}"
    Sunspot.remove_all!(*indexed_types)
  end

  def batch_reindex(model, batch_size = 500, location_service = nil)
    puts "Reindexing #{model.count} #{model.name} records in batches of #{batch_size}..."

    model.all.find_in_batches(batch_size: batch_size) do |records|
      records.each { |r| r.location_service = location_service } unless model == Trace
      Sunspot.index(records)
      index_flags_for_records(model, records, batch_size)
      index_nested_reportables_for_records(model, records, batch_size)
    end
  end

  def index_flags_for_records(model, records, batch_size)
    return unless model.instance_methods.include?(:flags)

    flags = records.reduce([]) do |list, record|
      list += record.flags if record.flags.present?
      list
    end
    flags.each_slice(batch_size) { |batch| Sunspot.index(batch) }
  end

  def index_nested_reportables_for_records(model, records, batch_size)
    return unless model.instance_methods.include?(:nested_reportables_hash)

    nested_reportables = records.reduce([]) do |list, record|
      record.nested_reportables_hash.each do |_, reportables|
        list += reportables
      end
      list
    end
    nested_reportables.each_slice(batch_size) { |batch| Sunspot.index(batch) }
  end
end
