module CouchChanges
  # Handles the sequence numbers in the history so we don't process changes
  # twice
  class Sequencer
    DEFAULT_HISTORY_PATH = File.join(Rails.application.config.root, 'tmp/couch_watcher_history.json')

    def initialize(history_path=nil, preloader=false)
      @history_path = history_path || DEFAULT_HISTORY_PATH

      if preloader
        @sequences ||= load_sequencers
      end
    end

    def for_model(model)
      @sequences ||= load_sequencers
      @sequences[model.database.name] ||= ModelSequence.new(model.database.name, 0, self)
    end

    # @param sequence_data: a Hash mapping the database name to the latest
    # sequence number
    def self.prime_sequence_numbers(sequence_data, history_path=nil)
      seq = self.new(history_path)
      seq.instance_exec(self) do
        @sequences = sequence_data.inject({}) do |acc, (db_name, last_seq)|
          acc.merge(db_name => ModelSequence.new(db_name, last_seq, seq))
        end
        save_sequence_numbers
      end
    end

    protected

    class ModelSequence
      attr_reader :db_name, :last_seq

      def initialize(db_name, last_seq, sequencer)
        @db_name = db_name
        @last_seq = last_seq
        @sequencer = sequencer
      end

      def last_seq=(val)
        @last_seq = val
        @sequencer.instance_exec(self) { save_sequence_numbers }
      end
    end

    def load_sequencers
      sequence_hash = load_sequence_numbers
      CouchChanges.logger.debug "Loading previous sequence numbers: #{sequence_hash}"

      sequence_hash.inject({}) do |acc, (name, last_seq)|
        acc.merge(name => ModelSequence.new(name, last_seq, self))
      end
    end

    # Returns a hash mapping the Couch database name to the last sequence
    # number processed
    def load_sequence_numbers
      if File.exist?(@history_path)
        File.open(@history_path, 'r') do |hist_fh|
          JSON.load(hist_fh) || {}
        end
      else
        {}
      end
    end

    def save_sequence_numbers
      data = @sequences.inject({}) do |acc, (name, seq)|
        acc.merge(name => seq.last_seq)
      end
      CouchChanges.logger.debug "Saving sequence numbers to #{@history_path}: #{data}"

      File.open(@history_path, 'w') do |hist_fh|
        hist_fh.write(JSON.pretty_generate(data))
      end
    end
  end
end
