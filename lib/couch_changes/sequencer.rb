module CouchChanges
  class Sequencer
    HISTORY_FILE = File.join(Rails.application.config.root, 'log/couch_watcher_history.json')

    class << self
      @sequencers = {}

      # Returns a hash mapping the Couch database name to the last sequence
      # number processed
      def last_sequence_numbers
        @_last_sequence_numbers ||= if File.exist?(HISTORY_FILE)
          File.open(HISTORY_FILE, 'r') do |hist_fh|
            JSON.load(hist_fh)
          end
        else
          {}
        end
      end

      def save_last_sequence_numbers(sequencers)
        File.open(HISTORY_FILE, 'w') do |hist_fh|
          hist_fh.write(JSON.dump(sequence_hash))
          @_last_sequence_numbers = nil
        end
      end

      def for_model(model)
        @sequencers[model] ||= self.new(model, last_sequence_numbers[model.database.name])
      end
    end

    attr_reader :model
    attr_accessor :last_seq

    private

    def initialize(model, last_seq)
      @model = model
      @last_seq = last_seq
    end
  end
end
