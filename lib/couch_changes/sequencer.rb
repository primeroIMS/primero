module CouchChanges
  # Handles the sequence numbers in the history so we don't process changes
  # twice
  class Sequencer
    HISTORY_FILE = File.join(Rails.application.config.root, 'log/couch_watcher_history.json')

    class << self
      @sequencers = {}

      def load_sequencers
        sequence_hash = load_sequence_numbers
        CouchChanges.logger.debug "Loading previous sequence numbers: #{sequence_hash}"

        sequence_hash.inject({}) do |acc, (name, last_seq)|
          acc.merge(name => self.new(name, last_seq))
        end
      end

      # Returns a hash mapping the Couch database name to the last sequence
      # number processed
      def load_sequence_numbers
        if File.exist?(HISTORY_FILE)
          File.open(HISTORY_FILE, 'r') do |hist_fh|
            JSON.load(hist_fh)
          end
        else
          {}
        end
      end

      def save_sequence_numbers
        data = @_sequencers.inject({}) do |acc, (name, seq)|
          acc.merge(name => seq.last_seq)
        end
        CouchChanges.logger.debug "Saving sequence numbers to #{HISTORY_FILE}: #{data}"

        File.open(HISTORY_FILE, 'w') do |hist_fh|
          hist_fh.write(JSON.pretty_generate(data))
        end
      end

      def for_model(model)
        @_sequencers ||= load_sequencers
        @_sequencers[model.database.name] ||= self.new(model.database.name, 0)
      end
    end

    attr_reader :db_name, :last_seq

    def last_seq=(val)
      @last_seq = val
      self.class.save_sequence_numbers
    end

    private

    def initialize(db_name, last_seq)
      @db_name = db_name
      @last_seq = last_seq
    end
  end
end
