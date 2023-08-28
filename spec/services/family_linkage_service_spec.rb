# frozen_string_literal: true

require 'rails_helper'

describe FamilyLinkageService do
  before(:each) { clean_data(User, Child, Family) }

  let(:user) do
    user = User.new(user_name: 'user_cp', full_name: 'Test User CP')
    user.save(validate: false) && user
  end

  let(:family1) do
    Family.create!(
      data: {
        family_number: '40bf9109',
        module_id: PrimeroModule::CP,
        family_size: 1,
        family_notes: 'Notes about the family',
        family_members: [
          {
            unique_id: '001',
            family_relationship: 'relationship1',
            family_relationship_notes: 'Notes about the relationship',
            family_relationship_notes_additional: 'Additional notes about the relationship',
            relation_name: 'Member 1',
            relation_nickname: 'Member 1 Nickname',
            relation_sex: 'male',
            relation_age: 10,
            relation_date_of_birth: Date.today - 10.years,
            relation_age_estimated: true,
            relation_national_id: 'national_001',
            relation_other_id: 'other_001',
            relation_ethnicity: 'ethnicity1',
            relation_sub_ethnicity1: 'ethnicity2',
            relation_sub_ethnicity2: 'ethnicity3',
            relation_language: 'language1',
            relation_religion: 'religion1',
            relation_address_current: 'Current Address',
            relation_landmark_current: 'Current Landmark',
            relation_location_current: 'abc001',
            relation_address_is_permanent: false,
            relation_telephone: '22222222'
          },
          {
            unique_id: '002',
            relation_name: 'Member 2',
            relation_sex: 'male',
            relation_age: 12
          }
        ]
      }
    )
  end

  let(:family2) do
    family = Family.new_with_user(
      user,
      {
        family_number: '5fba4918',
        family_members: [
          { unique_id: 'f5775818', relation_sex: 'male' },
          { unique_id: '14397418', relation_sex: 'female' }
        ]
      }
    )
    family.save!
    family
  end

  let(:child_without_family) do
    child = Child.new_with_user(
      user,
      {
        age: 5,
        sex: 'male',
        family_details_section: [{ unique_id: '672f56fd', relation_sex: 'female' }]
      }
    )
    child.save!
    child
  end

  let(:child_with_family) do
    child = Child.new_with_user(user, { age: 5, sex: 'male' })
    child.family = family2
    child.family_member_id = 'f5775818'
    child.save!
    child
  end

  describe 'new_child_from_family_member' do
    it 'creates a child record using the family member data' do
      child = family1.new_child_from_family_member(user, '001')
      child.save!

      target_fields = FamilyLinkageService::DEFAULT_MAPPING.map { |mapping| mapping[:target] }.flatten

      expect(Child.find(child.id).data.select { |key, _value| target_fields.include?(key) }).to eq(
        {
          'name_first' => 'Member 1',
          'name_middle' => 'Member 1',
          'name_last' => 'Member 1',
          'name_nickname' => 'Member 1 Nickname',
          'sex' => 'male',
          'age' => 10,
          'date_of_birth' => Date.today - 10.years,
          'estimated' => true,
          'national_id_no' => 'national_001',
          'other_id_no' => 'other_001',
          'ethnicity' => 'ethnicity1',
          'sub_ethnicity_1' => 'ethnicity2',
          'sub_ethnicity_2' => 'ethnicity3',
          'language' => 'language1',
          'religion' => 'religion1',
          'address_current' => 'Current Address',
          'landmark_current' => 'Current Landmark',
          'location_current' => 'abc001',
          'address_is_permanent' => false,
          'telephone_current' => '22222222'
        }
      )
    end
  end

  describe 'family_to_child' do
    it 'returns the family details for a child' do
      family_details = FamilyLinkageService.family_to_child(family1)

      expect(family_details['family_number']).to eq('40bf9109')
      expect(family_details['family_size']).to eq(1)
      expect(family_details['family_notes']).to eq('Notes about the family')
    end
  end

  describe 'family_details_section_for_child' do
    it 'returns the global fields for family member if exists' do
      child = family1.new_child_from_family_member(user, '002')

      expect(FamilyLinkageService.family_details_section_for_child(child)).to eq(
        [
          {
            'unique_id' => '001',
            'relation_name' => 'Member 1',
            'relation_nickname' => 'Member 1 Nickname',
            'relation_sex' => 'male',
            'relation_age' => 10,
            'relation_date_of_birth' => Date.today - 10.years,
            'relation_age_estimated' => true,
            'relation_national_id' => 'national_001',
            'relation_other_id' => 'other_001',
            'relation_ethnicity' => 'ethnicity1',
            'relation_sub_ethnicity1' => 'ethnicity2',
            'relation_sub_ethnicity2' => 'ethnicity3',
            'relation_language' => 'language1',
            'relation_religion' => 'religion1',
            'relation_address_current' => 'Current Address',
            'relation_landmark_current' => 'Current Landmark',
            'relation_location_current' => 'abc001',
            'relation_address_is_permanent' => false,
            'relation_telephone' => '22222222'
          },
          {
            'unique_id' => '002',
            'relation_name' => 'Member 2',
            'relation_sex' => 'male',
            'relation_age' => 12
          }
        ]
      )
    end
  end

  describe 'create_family_linked_child' do
    context 'when the child is not linked to a family' do
      it 'returns a case linked to a family with the cases as members' do
        linked_child = FamilyLinkageService.create_family_linked_child(user, child_without_family, '672f56fd')

        expect(linked_child.family.id).not_to be_nil
        expect(linked_child.family_member_id).to eq('672f56fd')
        expect(linked_child.family.family_members.size).to eq(2)
        expect(linked_child.family.family_members.map { |member| member['relation_sex'] }).to match_array(
          %w[male female]
        )
        expect(linked_child.family.family_members.map { |member| member['case_id'] }).to match_array(
          [linked_child.id, child_without_family.id]
        )
        expect(linked_child.family.family_members.map { |member| member['case_id_display'] }).to match_array(
          [linked_child.case_id_display, child_without_family.case_id_display]
        )
      end
    end

    context 'when the child is linked to a family' do
      it 'returns a case linked to a family with the cases as members' do
        linked_child = FamilyLinkageService.create_family_linked_child(user, child_with_family, '14397418')

        expect(linked_child.family.id).to eq(family2.id)
        expect(linked_child.family_member_id).to eq('14397418')
        expect(linked_child.family.family_members.size).to eq(2)
        expect(linked_child.family.family_members.map { |member| member['relation_sex'] }).to match_array(
          %w[male female]
        )
        expect(linked_child.family.family_members.map { |member| member['case_id'] }).to match_array(
          [linked_child.id, child_with_family.id]
        )
        expect(linked_child.family.family_members.map { |member| member['case_id_display'] }).to match_array(
          [linked_child.case_id_display, child_with_family.case_id_display]
        )
      end
    end
  end
end
