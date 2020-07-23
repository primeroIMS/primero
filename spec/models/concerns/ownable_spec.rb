# frozen_string_literal: true

require 'rails_helper'

describe Ownable do
  before do
    clean_data(Field, FormSection, User, Child, PrimeroProgram, PrimeroModule, UserGroup, Agency)
  end

  describe 'save' do
    before do
      @superuser = create(:user)
    end

    context 'when user does not exist' do
      before do
        @inst = Child.create(data: { owned_by: @superuser.user_name })
        @inst.owned_by = 'non-existent user'
        @inst.save!
      end

      it 'sets owned_by to null' do
        expect(@inst.owned_by).to be_nil
      end
    end

    context 'when user exists' do
      before do
        @field_worker = create(:user, location: 'loc012345', agency_office: 'FW Agency Office')
        @inst = Child.create(data: { owned_by: @superuser.user_name })
        @inst.owned_by = @field_worker.user_name
        @inst.save!
      end

      it 'sets owned_by_agency' do
        expect(@inst.owned_by_agency).to eq(@field_worker.organization.name.upcase)
      end

      it 'sets owned_by_location' do
        expect(@inst.owned_by_location).to eq(@field_worker.location)
      end

      it 'sets owned_by_agency_office' do
        expect(@inst.owned_by_agency_office).to eq(@field_worker.agency_office)
      end
    end
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
