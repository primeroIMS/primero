require 'spec_helper'

EM.describe CouchChanges, type: :eventmachine do
  around :each do |example|
    EM.run do
      example.run
    end
  end
  before :each do
    @child = create :child

    @history_path = Rails.root.join('tmp/test-change-sequences.json')
    if File.exists?(@history_path)
      File.delete(@history_path)
    end

    CouchChanges::Watcher.new([Child, FormSection]).watch_for_changes(@history_path)
  end

  it 'reindexes solr upon change to records' do
    @child.name = 'Bob'
    @child.database.save_doc(@child)

    require 'pry'; binding.pry
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
