require 'rails_helper'

# TestModel = Class.new(CouchRest::Model::Base) do
#   include Memoizable

#   class << self
#     # Memoist seems to have a bug where block-only parameters don't work
#     def find_all block
#       block.call
#     end
#     memoize :find_all
#   end
# end

# describe Memoizable do
#   before(:each) do
#     @block_to_call = ->() { }
#   end

#   it 'flushes memoization cache when notified of changes' do
#     @block_to_call.should_receive(:call).twice

#     TestModel.find_all @block_to_call
#     TestModel.find_all @block_to_call  # This shouldn't call the block

#     TestModel.changed
#     TestModel.notify_observers()

#     TestModel.find_all @block_to_call
#   end
# end
