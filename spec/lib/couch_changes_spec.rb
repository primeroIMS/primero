require 'fiber'
require 'spec_helper'

# TODO: Abstract all of the EventMachine and async stuff so that these tests
# are cleaner
describe CouchChanges, [:event_machine, :search] do
  before :each do
    reset_databases
    @child = create :child
    @form = create :form_section

    @history_path = Rails.root.join('tmp/test-change-sequences.json')
    if File.exists?(@history_path)
      File.delete(@history_path)
    end

    CouchChanges::Passenger.stub(:http_process_info) { [double(:address => 'http://example.com', :password => 'pass')] }
  end

  # We can't do this in an around(:each) block because RSpec verifies the mocks
  # immediately after the after callbacks and not after the around callback.
  def run_with_watcher &block
    EM.run do
      CouchChanges::Watcher.new([Child, FormSection], @history_path).watch_for_changes

      block.call
      check_mocks
    end
  end

  it 'reindexes solr upon change to records' do
    run_with_watcher do
      Sunspot.should_receive(:index!) do |instance|
        instance.id.should == @child.id
      end

      @child.name = 'Bob'
      @child.database.save_doc(@child)
    end
  end

  it 'removes record from solr upon deletion' do
    run_with_watcher do
      Sunspot.should_receive(:remove_by_id).with(Child, @child.id)
      @child.database.delete_doc(@child)
    end
  end

  it 'notifies the passenger server of changes' do
    run_with_watcher do
      FormSection.
    end
  end

  it 'handles partial chunks on _changes api' do
  end

  it 'handles disconnects on _changes api' do
  end
end
