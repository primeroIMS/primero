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

    batch_reindex(Child)
    batch_reindex(Incident)
    batch_reindex(TracingRequest)
    batch_reindex(PotentialMatch)
    batch_reindex(BulkExport)
    batch_reindex(User)

    puts 'Solr successfully reindexed'
  end

  desc "remove all records from the index"
  task :remove_all => :environment do
    indexed_types = [
      Child, Incident, TracingRequest, Violation, IndividualVictim,
      Flag, ReportableFollowUp, ReportableProtectionConcern,
      ReportableService, BulkExport, Violation, PotentialMatch
    ]

    puts "Removing the following record types from the Solr index: #{indexed_types.join(', ')}"
    Sunspot.remove_all! *indexed_types
  end

  def batch_reindex(model, batch_size=500)
    count = model.all.count
    pages = (count / batch_size.to_f).ceil

    puts "Reindexing #{count} #{model.name} records in batches of #{batch_size}..."

    1.upto(pages).each do |page|
      puts "Indexing batch #{page} of #{pages}"

      records = model.all.page(page).per(batch_size).all
      flags = []
      nesteds = []
      if model.instance_methods.include? :flags
        flags = records.reduce([]) do |list, record|
          list = list + record.flags if record.flags.present?
          list
        end
      end
      if model.instance_methods.include? :nested_reportables_hash
        nesteds = records.reduce([]) do |list, record|
          record.nested_reportables_hash.each do |_, reportables|
            list = list + reportables
          end
          list
        end
      end
      violations = []
      individual_victims = []
      if model == Incident #yeah yeah
        violations = records.reduce([]) do |list, record|
          list = list + Violation.from_incident(record)
          list
        end
        individual_victims = records.reduce([]) do |list, record|
          list = list + IndividualVictim.from_incident(record)
          list
        end
      end

      Sunspot.index(records)
      flags.each_slice(batch_size){|batch| Sunspot.index(batch)} unless flags.empty?
      nesteds.each_slice(batch_size){|batch| Sunspot.index(batch)} unless nesteds.empty?
      violations.each_slice(batch_size){|batch| Sunspot.index(batch)} unless violations.empty?
      individual_victims.each_slice(batch_size){|batch| Sunspot.index(batch)} unless individual_victims.empty?
    end

  end

end
