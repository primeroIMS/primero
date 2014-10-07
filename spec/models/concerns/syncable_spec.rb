require 'spec_helper'

_Child = Class.new(CouchRest::Model::Base) do
  def self.to_s
    'Child'
  end

  use_database :child
  include Syncable

  property :name, String
  property :age, Integer
  property :survivor_code, String
  property :gender, String
  property :family_members, [Class.new do
    include CouchRest::Model::Embeddable

    property :unique_id, String
    property :name, String
    property :relation, String
  end]
  property :languages, [String]
  property :birth_day, Date

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

describe Syncable do
  describe "attribute set" do
    before :each do
      @child = _Child.new()
      @child.save!
      @child.attributes = {
        'name' => 'Fred',
        'family_members' => [
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', },
          { 'unique_id' => 'bbbb', 'name' => 'Martha', 'relation' => 'mother', },
        ],
        'languages' => ['Chinese'],
      }
      @child.save!
    end

    it "should delete missing nested elements" do
      proposed_props = {
        'name' => 'Fred',
        'family_members' => [
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'uncle' },
        ],
      }
      @child.attributes = proposed_props

      @child.family_members.length.should == 1
    end

    it "should ignore missing nested elements if unique id is present" do
      proposed_props = {
        'family_members' => [
          { 'unique_id' => 'aaaa', },
          { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother' },
        ],
      }
      @child.attributes = proposed_props

      @child.family_members[0].name.should == 'Carl'
    end

    it "doesn't blow up if unique_id is missing" do
      proposed_props = {
        'family_members' => [
          { 'name' => 'Mary', 'relation' => 'mother' },
        ],
      }
      @child.attributes = proposed_props

      @child.family_members[0].name.should == 'Mary'
    end

    it "should handle nested hashes of arrays" do
      @child.attributes = {
        'violations' => {
          'killing' => [
            {'unique_id' => 'aaaa', 'date' => nil, 'notes' => 'test'}
          ],
        }
      }

      @child.violations.killing[0].notes.should == 'test'
    end
  end

  describe "set attribute with conflicts" do
    before :each do
      @child = _Child.new()
      @child.save!
      @child.attributes = {
        'name' => 'Fred',
        'birth_day' => DateTime.new(2000, 10, 1),
        'family_members' => [
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', },
          { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother', },
        ],
        'languages' => ['Chinese'],
        'violations' => {
          'killing' => [
            { 'unique_id' => '1234', 'date' => nil, 'notes' => 'kill1' },
            { 'unique_id' => '9876', 'date' => nil, 'notes' => 'kill2' },
          ],
        },
      }
      @child.save!

      @first_revision = @child.rev

      @child.age = 12
      @child.family_members[1] = @child.family_members[1].clone.tap do |fm|
        fm.name = 'Martha'
      end
      @child.family_members << { 'unique_id' => 'cccc', 'name' => 'Larry', 'relation' => 'uncle' }

      @child.save!
    end

    it "should ignore only nested properties that were updated before" do
      proposed_props = {
        'name' => 'Fred',
        'family_members' => [
          { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother' },
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'uncle' },
        ],
        'base_revision' => @first_revision
      }
      @child.attributes = proposed_props

      @child.family_members[0].name.should == 'Martha'
      @child.family_members[1].relation.should == 'uncle'
    end

    it "should handle if the base revision is the current revision" do
      @child.attributes = {
        'age' => 14,
        'base_revision' => @child.rev
      }

      @child.age.should == 14
    end

    it "should not consider a separate update as stale" do
      @child.attributes = {
        'age' => 14,
        'base_revision' => @first_revision,
      }

      @child.age.should == 14
    end

    it "should handle additions to nested arrays" do
      @child.attributes = {
        'family_members' => [
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', },
          { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother', },
          { 'unique_id' => 'dddd', 'name' => 'Loretta', 'relation' => 'aunt', },
        ],
      }

      @child.family_members.length.should == 3
    end

    it "should handle normal arrays without unique_id" do
      proposed_props = {
        'languages' => ['English', 'Chinese'],
        'base_revision' => @first_revision,
      }
      @child.attributes = proposed_props

      @child.languages.should == ['English', 'Chinese']
    end

    it "should handle nested hashes of arrays" do
      original_kill = @child.violations.killing[0].clone

      @child.violations = @child.violations.clone.tap do |v|
        v.killing = v.killing.clone.tap do |ks|
          ks[0] = ks[0].clone.tap do |k|
            k.notes = 'kill changed'
          end
        end
      end
      @child.save!

      @child.attributes = {
        'violations' => {
          'killing' => [
            original_kill.to_hash,
          ],
        },
        'base_revision' => @first_revision,
      }

      @child.violations.killing[0].notes.should == 'kill changed'
    end

    it "should handle integer field conflicts" do
      base_rev = @child.rev
      original_age = @child.age
      new_age = original_age + 2
      @child.age = new_age
      @child.save!

      @child = @child.reload
      @child.attributes = {
        'name' => 'George',
        # Cast it to a string since that is how the front end will always submit it
        'age' => original_age.to_s,
        'base_revision' => base_rev,
      }

      @child.age.should == new_age
    end

    it "should handle date field conflicts" do
      base_rev = @child.rev
      original_bday = @child.birth_day
      new_bday = original_bday + 2.days
      @child.birth_day = new_bday
      @child.save!

      # Reload to get the histories converted to strings as they will be
      # after a fresh fetch.
      @child = @child.reload
      @child.attributes = {
        # That format is how the front-end submits it
        'birth_day' => original_bday.strftime('%d-%b-%Y'),
        'name' => 'Jorge',
        'base_revision' => base_rev,
      }

      @child.birth_day.should == new_bday
    end
  end

  describe 'replication conflict resolution' do
    before :each do
      @child = _Child.new({
        :name => 'Test123',
        :created_by => 'me',
        :family_members => [
          {:unique_id => 'f1', :name => 'Arthur', :relation => 'brother'},
        ]
      })
      @child.save

      now = Time.now

      @saved_first = @timestamp_earliest = _Child.get(@child._id).tap do |c|
        c.attributes = {
          :survivor_code => '200',
          :gender => 'male',
          :last_updated_at => now + 5,
          :last_updated_by => 'me',
          :family_members => [
            {:unique_id => 'f1', :name => 'Arthur', :relation => 'father'},
            {:unique_id => 'f2', :name => 'Anna', :relation => 'mother'},
          ],
        }
      end

      @saved_last = @timestamp_latest = _Child.get(@child._id).tap do |c|
        c.attributes = {
          :survivor_code => '123',
          :name => 'Jorge',
          :age => 18,
          :last_updated_at => now + 10,
          :last_updated_by => 'me',
          :family_members => [
            {:unique_id => 'f1', :name => 'Lawrence', :relation => 'brother'},
            {:unique_id => 'f3', :name => 'Lara', :relation => 'aunt'},
          ],
        }
        c.update_history
      end

      @saved_first.save
      _Child.database.bulk_save([@saved_last], true, true)
    end

    it 'should select the latest update in a conflict on the same field' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved[:survivor_code].should == @timestamp_latest[:survivor_code]
    end

    it 'should merge updates where updates are to a disjoin set of fields' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved[:age].should == @saved_last[:age]
      resolved[:gender].should == @saved_first[:gender]
    end

    it "should merge nested fields" do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved[:family_members].length.should == 3
    end

    it "should update existing nested fields" do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved[:family_members][0].name.should == 'Lawrence'
      resolved[:family_members][0].relation.should == 'father'
    end

    it "should merge histories properly" do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved.histories.length.should == 3
    end
  end

  describe 'get_intermediate_histories' do
    it 'should return histories even with duplicate prev_revisions' do
      now = DateTime.now
      c = _Child.create
      c.histories = [
        {:datetime => now, :action => :update, :prev_revision => 'r5'},
        {:datetime => now - 1.minutes, :action => :update, :prev_revision => 'r7'},
        {:datetime => now - 5.minutes, :action => :update, :prev_revision => 'r1', :changes => {'age' => 15}},
        {:datetime => now - 8.minutes, :action => :update, :prev_revision => 'r1', :changes => {'name' => 'Larry'}},
        {:datetime => now - 10.minutes, :action => :create},
      ]
      c.save!

      c.get_intermediate_histories('r1').should == c.histories[0..-2]
    end
  end
end
