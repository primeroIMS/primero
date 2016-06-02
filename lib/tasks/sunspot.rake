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

    timeout(seconds) do
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

    puts 'Solr successfully reindexed'
  end

  def batch_reindex(model, batch_size=500)
    count = model.all.count
    pages = (count / batch_size.to_f).ceil

    puts "Reindexing #{count} #{model.name} records in batches of #{batch_size}..."

    1.upto(pages).each do |page|
      puts "Indexing batch #{page} of #{pages}"

      records = model.all.page(page).per(batch_size).all
      flags = records.reduce([]) do |list, record|
        list = list + record.flags if record.flags.present?
        list
      end
      nesteds = records.reduce([]) do |list, record|
        record.nested_reportables_hash.each do |_, reportables|
          list = list + reportables
        end
        list
      end

      Sunspot.index(records)
      flags.each_slice(batch_size){|batch| Sunspot.index(batch)}
      nesteds.each_slice(batch_size){|batch| Sunspot.index(batch)}
    end
  end


end
