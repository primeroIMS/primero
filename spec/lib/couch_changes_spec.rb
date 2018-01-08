require 'fiber'
require 'rails_helper'

# TODO: Abstract all of the EventMachine and async stuff so that these tests
# are cleaner
describe CouchChanges, :event_machine, :search do
  before :each do
    reset_databases
    @child = create :child
    @form = create :form_section

    @history_path = Rails.root.join('tmp/test-change-sequences.json')
    if File.exists?(@history_path)
      File.delete(@history_path)
    end

    @fake_passenger_proc = double(:address => 'http://example.com', :password => 'pass')
    CouchChanges::Passenger.stub(:http_process_info) { [@fake_passenger_proc] }
  end

  # We can't do this in an around(:each) block because RSpec verifies the mocks
  # immediately after the after callbacks and not after the around callback.
  def run_with_watcher models, &block
    run_EM_for_test do
      watcher = CouchChanges::Watcher.new(models, @history_path)

      # If you ask for the watcher, you are responsible for calling
      # `watch_for_changes` on it.
      if block.arity == 1
        block.call watcher
      else
        watcher.watch_for_changes
        block.call
      end

      check_mocks
    end
  end

  it 'reindexes solr upon change to records' do
    run_with_watcher([Child]) do
      Sunspot.should_receive(:index!) do |instance|
        instance.id.should == @child.id
      end

      @child.name = 'Bob'
      @child.database.save_doc(@child)
    end
  end

  it 'removes record from solr upon deletion' do
    run_with_watcher([Child]) do
      Sunspot.should_receive(:remove_by_id).with(Child, @child.id)
      @child.database.delete_doc(@child)
    end
  end

  it 'notifies the passenger server of changes' do
    run_with_watcher([FormSection]) do
      CouchChanges::Processors::Notifier.should_receive(:start_request_to_process).with(any_args)
      @form.name = "new name"
      @form.database.save_doc(@form)
    end
  end

  it 'resolves conflicts if document contains them' do
    # Update the record first so that we have something to conflict with
    @child.name = 'Barry'
    @child.save!

    run_with_watcher([Child]) do
      Child.should_receive(:get).with(@child.id).and_return(@child)
      @child.should_receive(:resolve_conflicting_revisions)

      save_as_conflicting_revision(@child, {
        'name' => 'Larry',
      })
    end
  end

  # TODO: this test is kind of fragile
  it 'handles disconnects on _changes api' do
    req = double('request', :stream => nil)
    called = false
    req.should_receive(:errback).twice do |&block|
      if !called
        called = true
        block.call
      end
    end
    CouchChanges::RequestHandler.any_instance.should_receive(:create_http_request).twice.and_return(req)

    run_with_watcher([Child]) do |watcher|
      watcher.should_receive(:listen_for_changes).with(any_args).twice.and_call_original
      watcher.watch_for_changes
    end
  end
end
