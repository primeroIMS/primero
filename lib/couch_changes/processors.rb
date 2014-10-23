require_relative 'processors'

module CouchChanges
  module Processors
    def self.process_change(modelCls, change, &done)
      processors = BaseProcessor.descendants.select {|p| p.supported_models.include?(modelCls) }

      if processors.length == 0
        done.call
      else 
        processors_done = 0

        callback = ->() do
          processors_done += 1 
          if processors_done == processors.length
            done.call
          end
        end

        processors.each do |processorCls|
          processorCls.process(&callback)
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
