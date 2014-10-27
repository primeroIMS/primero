module CouchChanges
  module Processors
    def self.process_change(modelCls, change)
      dfd = EventMachine::DefaultDeferrable.new
      processors = BaseProcessor.descendants.select {|p| p.supported_models.include?(modelCls) }

      if processors.length == 0
        dfd.succeed
      else
        processors_done = 0

        processors.each do |processorCls|
          processorCls.process(modelCls, change).callback do
            processors_done += 1
            if processors_done == processors.length
              dfd.succeed
            end
          end.errback do
            dfd.fail
          end
        end
      end

      dfd
    end

    class BaseProcessor
      # The models that this processor handles changes for
      def supported_models
        []
      end
    end
  end
end

require_relative 'processors/notifier'
require_relative 'processors/solr_reindexer'

