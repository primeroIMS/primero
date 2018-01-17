require 'rails_helper'

describe CouchChanges::RequestHandler do
  before(:each) do
    @rh = CouchChanges::RequestHandler.new(Child, 0)
  end

  it 'handles parts of line delivered in separate chunks' do
    change = {'id' => '1', 'deleted' => false}
    change_str = JSON.dump(change)
    yielded = nil
    @rh.handle_chunk(change_str[0..6])
    @rh.handle_chunk("#{change_str[7..-1]}\n{") do |change|
      yielded = change
    end

    yielded.should == change
  end
end
