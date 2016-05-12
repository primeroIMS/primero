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

    batch_reindex(Child){|record| record.index_nested_reportables}
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

      model.all.page(page).per(batch_size).all.each do |record|
        record.index!
        if record.flags.present?
          Sunspot.index(record.flags)
        end
        yield(record) if block_given?
      end
    end
  end


end
