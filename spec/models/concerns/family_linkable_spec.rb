# frozen_string_literal: true

require 'rails_helper'

describe FamilyLinkable do
  before(:each) { clean_data(User, Child, Family) }

  let(:user) do
    user = User.new(user_name: 'user_cp', full_name: 'Test User CP')
    user.save(validate: false) && user
  end

  let(:family2) do
    family = Family.new_with_user(
      user,
      {
        family_number: '5fba4918',
        family_members: [
          { 'unique_id' => 'f5775818', 'relation_sex' => 'male' },
          { 'unique_id' => '14397418', 'relation_sex' => 'female' }
        ]
      }
    )
    family.save!
    family
  end

  let(:child) do
    child = Child.new_with_user(user, { age: 5, sex: 'male' })
    child.family = family2
    child.family_member_id = 'f5775818'
    child.family_details_section = [
      { 'unique_id' => 'f5775818' },
      { 'unique_id' => '14397418', 'relation' => 'mother' }
    ]
    child.save!
    child
  end

  describe 'family_members_details' do
    it 'returns fields from family members and family details not including itself' do
      expect(child.family_members_details).to eq(
        [{ 'unique_id' => '14397418', 'relation' => 'mother', 'relation_sex' => 'female' }]
      )
    end
  end
end
