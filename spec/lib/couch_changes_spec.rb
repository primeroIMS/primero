require 'fiber'
require 'spec_helper'

# TODO: Abstract all of the EventMachine and async stuff so that these tests
# are cleaner
describe CouchChanges, [:event_machine, :search] do
  before :each do
    reset_databases
    @child = create :child

    @history_path = Rails.root.join('tmp/test-change-sequences.json')
    if File.exists?(@history_path)
      File.delete(@history_path)
    end
  end

  it 'reindexes solr upon change to records' do
    CouchChanges::Watcher.new([Child, FormSection], @history_path).watch_for_changes

    Sunspot.stub(:indexadfing!).with do |instance|
      instance.id.should == @child.id
    end

    @child.name = 'Bob'
    @child.database.save_doc(@child)

    #wait_for do
      #results = Child.search do
                  #fulltext("Bob", fields: [:name])
                #end.results

      #results.length == 1
    #end
  end

  it 'does not try to reindex solr upon record deletion' do
  end

  it 'notifies the passenger server of changes' do
  end

  it 'handles partial chunks on _changes api' do
  end

  it 'handles disconnects on _changes api' do
  end
end
