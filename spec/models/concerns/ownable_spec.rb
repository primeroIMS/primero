
require 'spec_helper'

_Model = Class.new(CouchRest::Model::Base) do
  include Ownable

  def save_doc(*args)
    true
  end
end

describe Ownable do
  before :each do
    @superuser = create :user
    @field_worker = create :user
    @inst = _Model.create({:owned_by => @superuser.user_name})
  end

  it 'sets the owned_by field to null upon save if user does not exist' do
    @inst.owned_by.should == @superuser.user_name
    @inst.owned_by = 'non-existent user'
    @inst.save!
    @inst.owned_by.should be_nil
  end
end
