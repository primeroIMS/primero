# frozen_string_literal: true

require 'rails_helper'

describe Ownable do
  before :each do
    clean_data(Field, FormSection, User, Child, PrimeroProgram, PrimeroModule, UserGroup, Agency)
    @superuser = create :user
    @field_worker = create :user
    @inst = Child.create(data: { owned_by: @superuser.user_name })
  end

  it 'sets the owned_by field to null upon save if user does not exist' do
    @inst.owned_by.should == @superuser.user_name
    @inst.owned_by = 'non-existent user'
    @inst.save!
    @inst.owned_by.should be_nil
  end

  it 'sets the owned_by_agency and owned_by_location upon save' do
    @inst.owned_by_agency.should == @superuser.organization.name.upcase
    @inst.owned_by_location.should == @superuser.location
    @inst.owned_by = @field_worker.user_name
    @inst.save!
    @inst.owned_by_agency.should == @field_worker.organization.name.upcase
    @inst.owned_by_location.should == @field_worker.location
  end

  describe 'scopes' do
    before :each do
      create(:user, user_name: 'test_user')
      create(:user, user_name: 'test_user2')
      create(:user, user_name: 'test_user3')
      @case1 = Child.create!(name: 'Case1', owned_by: 'test_user')
      @case2 = Child.create!(name: 'Case2', owned_by: 'test_user2', assigned_user_names: ['test_user'])
      @case3 = Child.create!(name: 'Case3', owned_by: 'test_user2', assigned_user_names: ['test_user3'])
    end

    describe '.owned_by' do
      it 'fetches records owned by this user' do
        cases = Child.owned_by('test_user')
        expect(cases.size).to eq(1)
        expect(cases[0].name).to eq('Case1')
      end
    end

    describe '.associated_with' do
      it 'fetches record associated with this user' do
        cases = Child.associated_with('test_user')
        expect(cases.size).to eq(2)
        expect(cases.map(&:name)).to match_array(%w[Case1 Case2])
      end
    end
  end

  after :each do
    clean_data(Child, User)
  end
end
