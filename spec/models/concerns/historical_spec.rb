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
    })
    @inst.save
  end

  it 'should insert a creation history with correct action' do
    hist = @inst.histories[0]
    hist.action.should == :create
  end

  it 'should insert a creation history with user_name set to created_by field' do
    hist = @inst.histories[0]
    hist.user_name.should == @inst.created_by
  end

  it 'should include changes in basic fields' do
    old_name = @inst.name
    @inst.name = 'Timmy'
    @inst.save

    @inst.histories[0].changes.should == {
      'name' => { :from => old_name, :to => 'Timmy' }
    }
  end

  it 'should include deletions in nested fields' do
    prior_family_member = @inst.family_members[0]
    @inst.family_members.delete_at 0
    @inst.save

    @inst.histories[0].changes['family_members'].should == [
      { :from => prior_family_member, :to => nil },
    ]
  end

  it 'should include changes in nested fields' do
    prior_family_member = @inst.family_members[0]
    new_family_member = prior_family_member.merge({ :relation => 'Uncle' })
    @inst.family_members[0].relation = 'Uncle'
    @inst.save

    require 'pry'; binding.pry
    @inst.histories[0].changes['family_members'].should == [
      { :from => prior_family_member, :to => prior_family_member.merge({ :relation => 'Uncle' }) }
    ]
  end
end
