require 'spec_helper'

# TODO: Abstract all of the EventMachine and async stuff so that these tests
# are cleaner
describe CouchChanges, :type => :couch_changes, :search => true do
  around :each do |example|
    EM.run do
      example.run
      EM.add_timer(5) do
        fail "Test timed out!"
        EM.stop
      end
    end
  end

  before :each do
    reset_databases
    @child = create :child

    @history_path = Rails.root.join('tmp/test-change-sequences.json')
    if File.exists?(@history_path)
      File.delete(@history_path)
    end

    CouchChanges::Watcher.new([Child, FormSection], @history_path).watch_for_changes
  end

  it 'reindexes solr upon change to records' do
    p Sunspot.object_id
    Sunspot.stub(:index!) do |instance|
      require 'pry'; binding.pry
    end

    @child.name = 'Bob'
    @child.database.save_doc(@child)

    EM.add_periodic_timer(0.1) do
      results = Child.search do
                  fulltext("Bob", fields: [:name])
                end.results

      if results.length == 1
        EM.stop
      end
    end
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
