# frozen_string_literal: true

require 'rails_helper'

describe FamilyLinkable do
  before(:each) { clean_data(User, Child, Family) }

  let(:role) do
    Role.create_or_update!(name: 'Test Role 1', unique_id: 'test-role-1',
                           permissions: Permission::RESOURCE_ACTIONS.slice('case'))
  end

  let(:user) do
    user = User.new(user_name: 'user_cp', full_name: 'Test User CP', role:)
    user.save(validate: false) && user
  end

  let(:user2) do
    user = User.new(user_name: 'user_mgr_cp', full_name: 'Test User Mgr CP', role:)
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

  let(:family3) do
    family = Family.new_with_user(
      user,
      {
        family_number: 'fc3f17e',
        family_members: [
          { 'unique_id' => '48ca2f90', 'relation_sex' => 'male', 'case_id' => '9de12cce-16f9-498c-83e9-4b1317d70e42' },
          { 'unique_id' => '0671b1cd', 'relation_sex' => 'female',
            'case_id' => '530e67c2-81fa-41ee-aa7b-b98b552954ca' },
          { 'unique_id' => 'b57374ec', 'relation_sex' => 'male', 'case_id' => '98e25d95-1365-4ae9-afd0-53f18e86a101' }
        ]
      }
    )
    family.save!
    family
  end

  let(:child1) do
    child = Child.new_with_user(user, { age: 6, sex: 'male' })
    child.id = '530e67c2-81fa-41ee-aa7b-b98b552954ca'
    child.family = family3
    child.family_member_id = 'f5775818'
    child.family_details_section = [
      { 'unique_id' => '48ca2f90', 'relation' => 'brother' },
      { 'unique_id' => 'b57374ec', 'relation' => 'brother' }
    ]
    child.save!
    child
  end

  let(:child2) do
    child = Child.new_with_user(user2, { age: 7, sex: 'male' })
    child.id = '9de12cce-16f9-498c-83e9-4b1317d70e42'
    child.family = family3
    child.family_member_id = 'f5775818'
    child.family_details_section = [
      { 'unique_id' => '0671b1cd', 'relation' => 'sister' },
      { 'unique_id' => 'b57374ec', 'relation' => 'brother' }
    ]
    child.save!
    child
  end

  let(:child3) do
    child = Child.new_with_user(user, { age: 8, sex: 'male' })
    child.id = '98e25d95-1365-4ae9-afd0-53f18e86a101'
    child.family = family3
    child.family_member_id = 'f5775818'
    child.family_details_section = [
      { 'unique_id' => '48ca2f90', 'relation' => 'brother' },
      { 'unique_id' => '0671b1cd', 'relation' => 'sister' }
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

    context 'when case_id attribute is present in family_details' do
      before do
        child2
        child3
        user2
      end

      it 'returns fields included can_read_record for family members' do
        expect(child1.family_members_details).to match_array(
          [
            { 'can_read_record' => false, 'case_id' => '9de12cce-16f9-498c-83e9-4b1317d70e42', 'relation' => 'brother',
              'relation_sex' => 'male', 'unique_id' => '48ca2f90' },
            { 'can_read_record' => true, 'case_id' => '530e67c2-81fa-41ee-aa7b-b98b552954ca',
              'relation_sex' => 'female', 'unique_id' => '0671b1cd' },
            { 'can_read_record' => true, 'case_id' => '98e25d95-1365-4ae9-afd0-53f18e86a101', 'relation' => 'brother',
              'relation_sex' => 'male', 'unique_id' => 'b57374ec' }
          ]
        )
      end
    end
  end
end
