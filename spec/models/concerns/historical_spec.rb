require 'rails_helper'

_Child = Class.new(CouchRest::Model::Base) do
  include Historical
  include Attachable

  property :name, String
  property :bio, String
  property :family_members, [Class.new do
    include CouchRest::Model::Embeddable

    property :unique_id, String
    property :name, String
    property :relation, String
  end]

  property :violations, Class.new do
    include CouchRest::Model::Embeddable
    property :killing, [Class.new do
      include CouchRest::Model::Embeddable
      property :unique_id, String
      property :date, Date
      property :notes, String
    end]

    property :maiming, [Class.new do
      include CouchRest::Model::Embeddable
      property :unique_id, String
      property :date, Date
      property :notes, String
    end]
  end
end

describe Historical do
  before :each do
    @inst = _Child.new({
      :created_by => 'primero',
      :name => 'Tommy',
      :family_members => [
        { :unique_id => 'abcdef', :name => 'Larry', :relation => 'father' },
        { :unique_id => '123456', :name => 'Mary', :relation => 'mother' },
      ],
      :violations => {
        :killing => [
          { :unique_id => 'k1', :date => nil, :notes => 'kill1'}
        ],
      },
    })
    @inst.save
  end

  describe 'latest_update_from_history' do
    it 'should return nil if no updates' do
      @inst.latest_update_from_history.should == nil
    end

    it 'should return update when only one' do
      @inst.name = 'Other'
      @inst.save

      @inst.latest_update_from_history.should_not be_nil
    end

    it 'should return latest when multiple updates' do
      ['Other', 'Another'].each do |s|
        @inst.name = s
        @inst.save
      end

      @inst.latest_update_from_history.changes['name']['to'].should == 'Another'
    end
  end

  describe 'history handling' do
    it 'should insert a creation history with correct action' do
      hist = @inst.histories[0]
      hist.action.should == :create
    end

    it 'should insert a creation history with user_name set to created_by field' do
      hist = @inst.histories[0]
      hist.user_name.should == @inst.created_by
    end

    it 'should insert a creation history with the prev_revision of nil' do
      @inst.histories[0].prev_revision.should == nil
    end

    it 'should not create a creation history if it already exists' do
      @inst.histories = [{:action => :create, :unique_id => 'hist1'}]
      @inst.add_creation_history

      @inst.histories.length.should == 1
    end

    it "should not record anything in the history if a save occured with no changes" do
      @inst.save!
      @inst.histories.size.should be 1
    end

    it "should not record empty string in the history if only change was spaces" do
      @inst.bio = '  '
      @inst.save!
      @inst.histories.size.should be 1
    end

    it "should not record history on populated field if only change was spaces" do
      @inst.name = "#{@inst.name}    "
      @inst.save!
      @inst.histories.size.should be 1
    end

    it 'should insert an update history with the previous couchrest revision' do
      prev_revision = @inst.rev
      @inst.name = 'something else'
      @inst.save

      @inst.histories[0].prev_revision.should == prev_revision
    end

    it "should insert an update history with the last_updated_by user" do
      @inst.last_updated_by = 'me'
      @inst.name = 'Teddy'
      @inst.save!

      @inst.histories[0].user_name.should == 'me'
    end

    it "should insert an update history with the last_updated_at time" do
      @inst.name = 'Teddy'
      @inst.save!

      @inst.histories[0].datetime.should == @inst.last_updated_at
    end

    it 'should include changes in basic fields' do
      old_name = @inst.name
      @inst.name = 'Timmy'
      @inst.save

      @inst.histories[0].changes.should == {
        'name' => { 'from' => old_name, 'to' => 'Timmy' }
      }
    end

    it 'should include deletions in nested fields' do
      prior_family_member = @inst.family_members[0]
      @inst.family_members.delete_at 0
      @inst.save

      @inst.histories[0].changes['family_members'].should == {
        prior_family_member.unique_id => nil
      }
    end

    it 'should include changes in nested fields' do
      prior_family_member = @inst.family_members[0]
      new_family_member = prior_family_member.clone
      new_family_member.relation = 'Uncle'
      # The regular app will assign entirely new embedded model instances within
      # CastedArrays.  If # you modify an existing model instance, it won't report
      # the previous value in the history correctly due to overly shallow object
      # cloning.
      @inst.family_members[0] = new_family_member
      @inst.save!

      @inst.histories[0].changes['family_members'].should == {
        new_family_member.unique_id => {
          'relation' => {'from' => prior_family_member.relation, 'to' => new_family_member.relation}
        }
      }
    end

    it 'handles nested arrays in nested hashes (e.g. violations)' do
      prior_note = @inst.violations.killing[0].notes
      @inst.violations = @inst.violations.clone.tap do |v|
        v.killing = v.killing.clone.tap do |ks|
          ks[0] = ks[0].clone.tap do |k|
            k.notes = 'kill changed'
          end
        end
      end
      @inst.save!

      @inst.histories[0].changes['violations'].should == {
        'killing' => {
          'k1' => {
            'notes' => { 'from' => prior_note, 'to' => 'kill changed' }
          }
        }
      }
    end

    it 'handles new attachments' do
      file = StringIO.new('abcdefg')
      file.instance_eval { def path; 'file.jpg'; end }
      @inst.create_attachment(:file => file, :name => 'file.jpg')

      @inst.save!
      @inst.histories[0].changes['_attachments']['to']['file.jpg']['stub'].should be_truthy
    end
  end

  describe "ordered_histories" do
    it "should assign histories order by datetime of history" do
      child = _Child.new()
      first_history = {:datetime => "2010-01-01 01:01:02UTC"}
      second_history = {:datetime => "2010-01-02 01:01:02UTC"}
      third_history = {:datetime => "2010-01-02 01:01:03UTC"}
      child.histories = [first_history, second_history, third_history]
      child.ordered_histories.map {|h| {:datetime => h.datetime}}.should == [third_history, second_history, first_history]
    end
  end

  describe 'last_updated_at' do
    it "updates last_updated_at before saving" do
      Child.any_instance.stub(:field_definitions).and_return([])
      DateTime.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      child = Child.new
      child.attributes = {'name' => 'Bob'}
      child.save!
      child.last_updated_at.should == DateTime.parse("2010-01-17 19:05:00UTC")
    end
  end
end
