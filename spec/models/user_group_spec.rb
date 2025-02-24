# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe UserGroup do
  before(:each) do
    clean_data(User, Agency, UserGroup)

    @agency1 = Agency.create!(unique_id: 'agency_1', name: 'Agency 1', agency_code: 'agency1')
    @agency2 = Agency.create!(unique_id: 'agency_2', name: 'Agency 2', agency_code: 'agency2')
    @group1 = UserGroup.create!(unique_id: 'group_1', name: 'User Group 1', agencies: [@agency1, @agency2])
    @group2 = UserGroup.create!(unique_id: 'group_2', name: 'User Group 2', agencies: [@agency1])
    @group3 = UserGroup.create!(unique_id: 'group_3', name: 'User Group 3', agencies: [@agency1])
  end

  describe 'unique_id' do
    it 'generates a unique_id when a new UserGroup is created' do
      user_group = UserGroup.create!(name: 'Test Group')

      expect(user_group.unique_id).to match(/^usergroup-test-group-[0-9a-f]{7}$/)
    end
  end

  describe 'list' do
    it 'does not return duplicated user groups when are filtered by agency' do
      user_groups = UserGroup.list(nil, agency_unique_ids: %w[agency_1 agency_2])

      expect(user_groups.size).to eq(3)
      expect(user_groups.pluck(:unique_id)).to match_array(%w[group_1 group_2 group_3])
    end

    it 'when agency filter is not set' do
      user_groups = UserGroup.list(nil)

      expect(user_groups.size).to eq(3)
      expect(user_groups.map(&:unique_id)).to match_array(%w[group_1 group_2 group_3])
    end
  end
end
