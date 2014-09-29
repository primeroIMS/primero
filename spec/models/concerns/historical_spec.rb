require 'spec_helper'

_Child = Class.new(CouchRest::Model::Base) do
  include Historical

  property :name, String
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

    it 'should insert an update history with the previous couchrest revision' do
      prev_revision = @inst.rev
      @inst.name = 'something else'
      @inst.save

      @inst.histories[0].prev_revision.should == prev_revision
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
  end
end
