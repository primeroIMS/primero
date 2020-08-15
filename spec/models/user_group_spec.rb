# frozen_string_literal: true

require 'rails_helper'

describe UserGroup do
  before(:each) { clean_data(UserGroup, User) }

  describe 'unique_id' do
    it 'generates a unique_id when a new UserGroup is created' do
      user_group = UserGroup.create!(name: 'Test Group')

      expect(user_group.unique_id).to match(/^usergroup-test-group-[0-9a-f]{7}$/)
    end
  end
end
