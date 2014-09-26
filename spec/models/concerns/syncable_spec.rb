require 'spec_helper'

_Child = Class.new(CouchRest::Model::Base) do
  include Syncable

  property 'name', String
  property 'family_members', [Class.new do
    include CouchRest::Model::Embeddable

    property 'unique_id', String
    property 'name', String
    property 'relation', String
  end]
  property 'languages', [String]
  property 'birth_day', Date

  property 'violations', Class.new do
    include CouchRest::Model::Embeddable
    property 'killing', [Class.new do
      include CouchRest::Model::Embeddable
      property 'unique_id', String
      property 'date', Date
      property 'notes', String
    end]

    property 'maiming', [Class.new do
      include CouchRest::Model::Embeddable
      property 'unique_id', String
      property 'date', Date
      property 'notes', String
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

      @child.family_members[1] = @child.family_members[1].clone.tap do |fm|
        fm.name = 'Martha'
      end

      @child.save!
    end

    it "should ignore only nested properties that were updated before" do
      proposed_props = {
        'name' => 'Fred',
        'family_members' => [
          { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother' },
          { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'uncle' },
        ],
        'revision' => @first_revision
      }
      @child.attributes = proposed_props

      @child.family_members[0].name.should == 'Martha'
      @child.family_members[1].relation.should == 'uncle'
    end

    it "should handle normal arrays without unique_id" do
      proposed_props = {
        'languages' => ['English', 'Chinese'],
        'revision' => @first_revision,
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
      require 'pry'; binding.pry

      @child.attributes = {
        'violations' => {
          'killing' => [
            original_kill.to_hash,
          ],
        },
        'revision' => @first_revision,
      }

      @child.violations.killing[0].notes.should == 'kill changed'
    end
  end
end
