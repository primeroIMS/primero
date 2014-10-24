module CouchChanges
  module Processors
    def self.process_change(modelCls, change, &done)
      processors = BaseProcessor.descendants.select {|p| p.supported_models.include?(modelCls) }

      if processors.length == 0
        done.call
      else 
        processors_done = 0

        callback = ->(success=true) do
          if success
            processors_done += 1 
            if processors_done == processors.length
              done.call
            end
          else
            done.call false
          end
        end

        processors.each do |processorCls|
          processorCls.process(modelCls, change, &callback)
        end
      end
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

