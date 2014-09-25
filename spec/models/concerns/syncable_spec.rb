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
end

describe Syncable do
  before :each do
    @child = _Child.new()
    @child.save!
    @child.attributes = {
      'name' => 'Fred',
      'family_members' => [
        { 'unique_id' => 'aaaa', 'name' => 'Carl', 'relation' => 'father', },
        { 'unique_id' => 'bbbb', 'name' => 'Mary', 'relation' => 'mother', },
      ]
    }
    @child.save!

    @first_revision = @child.rev

    @child.family_members[1] = @child.family_members[1].clone.tap do |fm|
      fm.name = 'Martha'
    end

    @child.save!
  end

  describe "attribute set" do
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

      require 'pry'; binding.pry
      new_props.should == {}
    end
  end
end
