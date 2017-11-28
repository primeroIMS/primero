require 'rails_helper'

_Child = Class.new(CouchRest::Model::Base) do
  def self.to_s
    'Child'
  end

  use_database :child
  include Syncable
  include Attachable

  property :name, String
  property :age, Integer
  property :survivor_code, String
  property :gender, String
  property :family_members, [Class.new do
    include CouchRest::Model::Embeddable

    property :unique_id, String
    property :name, String
    property :relation, String
    property :languages, [String]
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
      property :eyewitness, TrueClass, :default => false
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
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', 'languages' => ['English', 'French'] },
          { 'unique_id' => 'bbbb', 'name' => 'Martha', 'relation' => 'mother', },
        ],
        'violations' => {
          'killing' => [{:unique_id => 'k1', :notes => 'kill 1'}]
        },
        'languages' => ['Chinese', 'English'],
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

    it 'removes values from array' do
      @child.attributes = {
        'languages' => ['English'],
      }

      @child.languages.should == ['English']
    end

    it 'removes values from normal array in nested subform' do
      @child.attributes = {
        'family_members' => [
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', 'languages' => ['English'] },
          { 'unique_id' => 'bbbb', 'name' => 'Martha', 'relation' => 'mother', },
        ]
      }

      @child.family_members[0].languages.should == ['English']
    end

    it 'should delete all nested elements if nil' do
      proposed_props = {
        'family_members' => nil,
      }
      @child.attributes = proposed_props

      @child.family_members.length.should == 0
    end

    it 'should delete all nested elements within nested hash if nil' do
      @child.attributes = {
        'violations' => {
          'killing' => nil
        }
      }

      @child.violations.killing.length.should == 0
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

    it "should track changes if no history provided" do
      @child.attributes = {
        'name' => @child.name + ', Jr.'
      }

      @child.changes.keys.should include 'name'
    end

    it "should track changes if nil histories provided" do
      @child.attributes = {
        'name' => @child.name + ', Jr.',
        'histories' => nil,
      }

      @child.changes.keys.should include 'name'
    end

    it "should not track changes if history provided" do
      new_name = @child.name + ', Jr.'
      @child.attributes = {
        'name' => new_name,
        'histories' => @child.histories.clone.tap do |h|
          h << {:datetime => DateTime.now, :changes => {'name' => { 'from' => @child.name, 'to' => new_name }}}
        end
      }

      @child.changes.keys.should_not include 'name'
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
      @second_revision = @child.rev
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
        'base_revision' => @second_revision,
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
        :birth_day => Date.new(2000, 1, 1),
        :languages => ['English'],
        :family_members => [
          {:unique_id => 'f1', :name => 'Arthur', :relation => 'brother', 'languages' => ['English', 'Spanish'] },
        ],
        :violations => {
          :killing => [
            { 'unique_id' => 'k1', 'date' => nil, 'notes' => 'kill1'},
          ],
          :maiming => [ {:unique_id => 'm1' } ]
        }
      })
      @child.save

      now = Time.now

      @saved_first = @timestamp_earliest = _Child.get(@child._id).tap do |c|
        c.attributes = {
          :survivor_code => '200',
          :gender => 'male',
          :birth_day => Date.new(2000, 2, 1),
          :last_updated_at => now + 5.minutes,
          :last_updated_by => 'me',
          :languages => ['English', 'Spanish'],
          :family_members => [
            {:unique_id => 'f1', :name => 'Arthur', :relation => 'father', :languages => ['English', 'Spanish', 'Russian']},
            {:unique_id => 'f2', :name => 'Anna', :relation => 'mother'},
          ],
          :violations => {
            :killing => [c.violations.killing[0].to_hash] + [{:unique_id => 'k3', :notes => 'kill3'}],
            :maiming => [ {:unique_id => 'm1', :eyewitness => true } ]
          },
        }

        c.attach FileAttachment.new('att1', 'text/ascii', '123456')
      end

      @saved_last = @timestamp_latest = _Child.get(@child._id).tap do |c|
        c.attributes = {
          :survivor_code => '123',
          :name => 'Jorge',
          :birth_day => Date.new(2000, 1, 1),
          :age => 18,
          :languages => ['English', 'German'],
          :last_updated_at => now + 10.minutes,
          :last_updated_by => 'me',
          :family_members => [
            {:unique_id => 'f1', :name => 'Lawrence', :relation => 'brother', :languages => ['English', 'Spanish', 'Dutch']},
            {:unique_id => 'f3', :name => 'Lara', :relation => 'aunt'},
          ],
          :violations => {
            :killing => [c.violations.killing[0].to_hash] + [{:unique_id => 'k5', :notes => 'kill5'}],
            :maiming => [ {:unique_id => 'm1', :notes => 'maim 1'} ]
          }
        }
        # For some reason, when you do the bulk save you have to manually
        # base64 encode attachments
        c.attach FileAttachment.new('att2', 'text/ascii', Base64.encode64('123456'))

        c.update_history
      end

      @saved_first.save
      _Child.database.bulk_save([@saved_last], {use_uuids: true, all_or_nothing: true})
    end

    it 'should select the latest update in a conflict on the same field' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved[:survivor_code].should == @timestamp_latest[:survivor_code]
      resolved[:birth_day].should == @timestamp_earliest[:birth_day]
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

    it 'keeps two independently added values in a normal array' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved.languages.sort.should == ['English', 'German', 'Spanish']
    end

    it 'keeps two independently added values in a nested array in nested hash' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved.violations.killing.length.should == 3
    end

    it 'merges data from the same nested array element in a nested hash' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      m = resolved.violations.maiming[0]
      m.notes.should == 'maim 1'
      m.eyewitness.should be_truthy
    end

    it 'merges data from a nested array with in a nested array' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved.family_members[0].languages.sort.should == ['English', 'Spanish', 'Dutch', 'Russian'].sort
    end

    it 'merges attachments' do
      @child.reload.resolve_conflicting_revisions

      resolved = _Child.get(@child._id)
      resolved.attachments.length.should == 2
    end

    it 'does not exponentially duplicate array values' do
      remove_languages = _Child.get(@child.id).tap do |c|
        c.attributes = {
          :languages => [],
        }
      end.save!

      readd_languages = _Child.get(@child.id).tap do |c|
        c.attributes = {
          :languages => ['English', 'Spanish', 'German'],
        }
      end.save!

      @child.reload.resolve_conflicting_revisions
      resolved = _Child.get(@child._id)
      resolved.languages.length.should == 3
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
