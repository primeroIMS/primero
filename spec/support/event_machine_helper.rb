
module EventMachineHelper
  def self.extended(mod)
    def it(*args, &block)
      block.instance_eval do
        alias :old_call :call
        def call(*args)
          require 'pry'; binding.pry
          EM.run do
            old_call
          end
        end
      end

      super *args, &block
    end
  end

end
