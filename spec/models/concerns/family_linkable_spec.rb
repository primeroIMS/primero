# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe FamilyLinkable do
  before(:each) { clean_data(SearchableIdentifier, User, Child, Family) }

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
          { 'unique_id' => '00001', 'relation_sex' => 'male' },
          { 'unique_id' => '00002', 'relation_sex' => 'female' }
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
      { 'unique_id' => '00001' },
      { 'unique_id' => '00002', 'relation' => 'mother', 'relation_name' => 'Name1' }
    ]
    child.save!
    child
  end

  describe 'family_members_details' do
    it 'returns fields from family members and family details not including itself' do
      expect(child.family_members_details).to eq(
        [
          { 'unique_id' => '00001', 'relation_sex' => 'male' },
          { 'unique_id' => '00002', 'relation' => 'mother', 'relation_sex' => 'female', 'relation_name' => 'Name1' }
        ]
      )
    end
  end

  describe 'update_family_members' do
    it 'updates the family_members and does not change the family_details_section' do
      child.update_properties(
        user, { 'family_details_section' => [{ 'unique_id' => '00002', 'relation_name' => 'Name2' }] }
      )
      child.save!
      child.reload

      expect(
        child.family_members_details.find { |member| member['unique_id'] == '00002' }['relation_name']
      ).to eq('Name2')
      expect(
        child.family_details_section.find { |member| member['unique_id'] == '00002' }['relation_name']
      ).to eq('Name1')
    end

    it 'updates the local family_details_section fields and does not change the family_members' do
      child.update_properties(
        user, { 'family_details_section' => [{ 'unique_id' => '00002', 'relation' => 'father' }] }
      )
      child.save!
      child.reload

      expect(
        child.family.family_members.find { |member| member['unique_id'] == '00002' }['relation']
      ).to be_nil
      expect(
        child.family_details_section.find { |member| member['unique_id'] == '00002' }['relation']
      ).to eq('father')
    end

    context 'when the family detail is new' do
      it 'maps family details to family members and leaves the family details only with local fields' do
        child.update_properties(
          user,
          {
            'family_details_section' => [
              {
                'unique_id' => '00003',
                'relation_name' => 'Name3',
                'relation' => 'mother',
                'relation_is_caregiver' => false
              }
            ]
          }
        )
        child.save!
        child.reload

        expect(child.family.family_members.find { |member| member['unique_id'] == '00003' }).to eq(
          {
            'unique_id' => '00003',
            'relation_name' => 'Name3',
            'family_relationship' => 'mother',
            'family_relation_is_caregiver' => false
          }
        )
        expect(child.family_details_section.find { |member| member['unique_id'] == '00003' }).to eq(
          {
            'unique_id' => '00003',
            'relation' => 'mother',
            'relation_is_caregiver' => false
          }
        )
      end

      it 'updates global fields in the family member and leaves the family details unchanged' do
        child.update_properties(
          user, { 'family_details_section' => [{ 'unique_id' => '00003', 'relation_name' => 'Name3' }] }
        )
        child.save!
        child.reload

        expect(child.family.family_members.find { |member| member['unique_id'] == '00003' }).to eq(
          { 'unique_id' => '00003', 'relation_name' => 'Name3' }
        )
        expect(child.family_details_section.size).to eq(2)
        expect(child.family_details_section.find { |member| member['unique_id'] == '00003' }).to be_nil
      end
    end

    context 'when is a existing family detail' do
      it 'updates local and global fields in the family details and family members' do
        child.update_properties(
          user,
          {
            'family_details_section' => [
              { 'unique_id' => '00002', 'relation_name' => 'OtherName2', 'relation' => 'aunt' }
            ]
          }
        )
        child.save!
        child.reload

        expect(child.family.family_members.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_name' => 'OtherName2', 'relation_sex' => 'female' }
        )
        expect(child.family_details_section.size).to eq(2)
        expect(child.family_details_section.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_name' => 'Name1', 'relation' => 'aunt' }
        )
      end

      it 'updates global fields in the family member and leaves the family detail unchanged' do
        child.update_properties(
          user, { 'family_details_section' => [{ 'unique_id' => '00002', 'relation_name' => 'OtherName2' }] }
        )
        child.save!
        child.reload

        expect(child.family.family_members.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_name' => 'OtherName2', 'relation_sex' => 'female' }
        )
        expect(child.family_details_section.size).to eq(2)
        expect(child.family_details_section.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_name' => 'Name1', 'relation' => 'mother' }
        )
      end

      it 'updates local fields in the family details and leaves the family member unchanged' do
        child.update_properties(
          user, { 'family_details_section' => [{ 'unique_id' => '00002', 'relation' => 'aunt' }] }
        )
        child.save!
        child.reload

        expect(child.family.family_members.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_sex' => 'female' }
        )
        expect(child.family_details_section.size).to eq(2)
        expect(child.family_details_section.find { |member| member['unique_id'] == '00002' }).to eq(
          { 'unique_id' => '00002', 'relation_name' => 'Name1', 'relation' => 'aunt' }
        )
      end
    end
  end

  describe 'sync_family_members' do
    it 'associates a family to a case and copies the family details as family members' do
      child = Child.new_with_user(
        user,
        {
          name_first: 'Name1',
          age: 8,
          sex: 'male',
          family_details_section: [
            { 'unique_id' => '10001', 'relation' => 'father', 'relation_name' => 'Name2' },
            { 'unique_id' => '10002', 'relation' => 'mother', 'relation_name' => 'Name3' }
          ]
        }
      )
      child.save!
      family = Family.new_with_user(user, { family_number: 'f-10001' })
      family.save!

      child.family = family
      child.save!

      expect(child.family_member_id).not_to be_nil
      expect(child.family_id).to eq(family.id)
      expect(family.family_members.size).to eq(3)
      expect(family.family_members).to match_array(
        [
          { 'unique_id' => '10001', 'family_relationship' => 'father', 'relation_name' => 'Name2' },
          { 'unique_id' => '10002', 'family_relationship' => 'mother', 'relation_name' => 'Name3' },
          {
            'unique_id' => child.family_member_id,
            'relation_name' => 'Name1',
            'relation_sex' => 'male',
            'relation_age' => 8,
            'case_id' => child.id,
            'case_id_display' => child.case_id_display
          }
        ]
      )
    end
  end

  describe 'disassociate_from_family' do
    it 'disassociates a case from a family record' do
      child.update_properties(user, { 'family_id' => nil })
      child.save!

      family2.reload

      expect(child.family).to be_nil
      expect(child.family_member_id).to be_nil
      expect(family2.cases).to be_empty
      expect(family2.family_members.find { |member| member['case_id'] == child.id }).to be_nil
    end
  end
end
