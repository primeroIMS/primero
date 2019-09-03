require 'sunspot/rails/tasks'

module Sunspot
  module Rails
    class Server
      # Use the same PID file for different rails envs
      # Because now, in the same Solr, we can have multiple cores (one each for every rails env)
      def pid_file
        'sunspot.pid'
      end
    end
  end
end

namespace :sunspot do
  desc "wait for solr to be started"
  task :wait, [:timeout] => :environment do |t, args|
    require 'rsolr'

    connected = false
    seconds = args[:timeout] ? args[:timeout].to_i : 30
    puts "Waiting #{seconds} seconds for Solr to start..."

    Timeout.timeout(seconds) do
      until connected do
        begin
          connected = RSolr.connect(:url => Sunspot.config.solr.url).get "admin/ping"
        rescue => e
          sleep 1
        end
      end
    end

    raise "Solr is not responding" unless connected
  end

  Rake::Task["sunspot:reindex"].clear
  desc "re-index case/incident records"
  task :reindex => :wait do

    puts 'Reindexing Solr...'
    [Child, Incident, TracingRequest, BulkExport].each {|m| batch_reindex(m) }

    puts 'Solr successfully reindexed'
  end

  desc "remove all records from the index"
  task :remove_all => :environment do
    indexed_types = [
      Child, Incident, TracingRequest,
      Flag, ReportableFollowUp, ReportableProtectionConcern,
      ReportableService, BulkExport, Violation, PotentialMatch
    ]

    puts "Removing the following record types from the Solr index: #{indexed_types.join(', ')}"
    Sunspot.remove_all! *indexed_types
  end

  def batch_reindex(model, batch_size=500)

    puts "Reindexing #{model.count} #{model.name} records in batches of #{batch_size}..."

    model.all.find_in_batches(batch_size: batch_size) do |records|
      flags = []
      nesteds = []
      if model.instance_methods.include?(:flags)
        flags = records.reduce([]) do |list, record|
          list = list + record.flags if record.flags.present?
          list
        end
      end
      if model.instance_methods.include?(:nested_reportables_hash)
        nesteds = records.reduce([]) do |list, record|
          record.nested_reportables_hash.each do |_, reportables|
            list = list + reportables
          end
          list
        end
      end

      Sunspot.index(records)
      flags.each_slice(batch_size){|batch| Sunspot.index(batch)} unless flags.empty?
      nesteds.each_slice(batch_size){|batch| Sunspot.index(batch)} unless nesteds.empty?
    end
  end

end
