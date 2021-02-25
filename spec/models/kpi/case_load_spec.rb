# frozen_string_literal: true

require 'rails_helper'

describe Kpi::CaseLoad, search: true do
  include FormAndFieldHelper
  include SunspotHelper

  before :each do
    clean_data(User, Child, UserGroup, Role, Agency)

    @agency = Agency.create!(agency_code: 'test', name: 'test')

    @role = Role.create!(name: 'test', permissions: [Permission.new])

    @group1 = UserGroup.create!(unique_id: 'group1')
    @group2 = UserGroup.create!(unique_id: 'group2')
    @group3 = UserGroup.create!(unique_id: 'group3')

    @user2 = User.create!(
      full_name: '2',
      user_name: '2',
      password: 'abcdefg2',
      password_confirmation: 'abcdefg2',
      role: @role,
      agency: @agency,
      user_groups: [@group2]
    )
    @user3 = User.create!(
      full_name: '3',
      user_name: '3',
      password: 'abcdefg3',
      password_confirmation: 'abcdefg3',
      role: @role,
      agency: @agency,
      user_groups: [@group3]
    )

    Child.create(data: { owned_by: @user2.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })
    Child.create(data: { owned_by: @user3.user_name, module_id: PrimeroModule::GBV })

    Sunspot.commit
  end

  with 'No cases in the users groups' do
    it 'should return a case load of 0 in all categories' do
      json = Kpi::CaseLoad.new(nil, nil, ['group1'], @agency.unique_id).to_json
      case_loads = json[:data].map { |case_load| case_load.map(&:second) }.to_h
      expect(case_loads['10cases']).to eq(0)
      expect(case_loads['20cases']).to eq(0)
      expect(case_loads['21-30cases']).to eq(0)
      expect(case_loads['30cases']).to eq(0)
    end
  end

  with 'One case by a single user' do
    it 'should return a case load of 1.0 for < 10 cases' do
      json = Kpi::CaseLoad.new(nil, nil, ['group2'], @agency.unique_id).to_json
      case_loads = json[:data].map { |case_load| case_load.map(&:second) }.to_h
      expect(case_loads['10cases']).to eq(1.0)
      expect(case_loads['20cases']).to eq(0)
      expect(case_loads['21-30cases']).to eq(0)
      expect(case_loads['30cases']).to eq(0)
    end
  end

  with '10 cases by a single user' do
    it 'should return a case load of 1.0 for < 20 cases' do
      json = Kpi::CaseLoad.new(nil, nil, ['group3'], @agency.unique_id).to_json
      case_loads = json[:data].map { |case_load| case_load.map(&:second) }.to_h
      expect(case_loads['10cases']).to eq(0)
      expect(case_loads['20cases']).to eq(1.0)
      expect(case_loads['21-30cases']).to eq(0)
      expect(case_loads['30cases']).to eq(0)
    end
  end

  with '11 cases between 2 users' do
    it 'should return a case load of 0.5 for < 10 cases and 0.5 for < 20' do
      json = Kpi::CaseLoad.new(nil, nil, %w[group2 group3], @agency.unique_id).to_json
      case_loads = json[:data].map { |case_load| case_load.map(&:second) }.to_h
      expect(case_loads['10cases']).to eq(0.5)
      expect(case_loads['20cases']).to eq(0.5)
      expect(case_loads['21-30cases']).to eq(0)
      expect(case_loads['30cases']).to eq(0)
    end
  end

  after :each do
    clean_data(User, Child, UserGroup, Role, Agency)
    Sunspot.commit
  end
end
