# frozen_string_literal: true

require 'rails_helper'

describe Followable do
  before :each do
    clean_data(Child)
    @child = Child.create!(
      data: { age: 2, sex: 'male', name: 'Random Name' }
    )
  end

  describe 'when a record is new' do
    it 'followup_status is set to follow_ups_not_planned' do
      expect(@child.followup_status).to eq(Child::FOLLOW_UPS_NOT_PLANNED)
    end
  end

  describe 'when followup_subform_section is added' do
    it 'followup_status is set to follow_ups_not_planned' do
      @child.followup_subform_section = [
        {
          'unique_id' => 'f732a61c-cdae-435c-9c0c-55a893321fed',
          'followup_type' => 'visit1',
          'followup_child_labor' => 'in_child_labor',
          'followup_needed_by_date' => '2023-01-03'
        }
      ]
      @child.save!
      expect(@child.reload.followup_status).to eq(Child::FOLLOW_UPS_PLANNED)
    end
  end

  describe 'when any followup_subform_section has followup_needed_by_date' do
    it 'followup_status is set to follow_ups_not_planned' do
      @child.followup_subform_section = [
        {
          'unique_id' => '4b7c1011-a63e-422c-b6fb-a64cdcc2d472',
          'followup_type' => 'visit1',
          'followup_child_labor' => 'in_child_labor',
          'followup_needed_by_date' => '2023-01-03'
        },
        {
          'unique_id' => 'f732a61c-cdae-435c-9c0c-55a893321fed',
          'followup_type' => 'visit2',
          'followup_child_labor' => 'in_child_labor',
          'followup_needed_by_date' => '2023-01-03',
          'followup_date' => '2022-12-04'
        }
      ]
      @child.save!
      expect(@child.reload.followup_status).to eq(Child::FOLLOW_UPS_PLANNED)
    end
  end

  describe 'when all followup_subform_section are implemented added' do
    it 'followup_status is set to follow_ups_not_planned' do
      @child.followup_subform_section = [
        {
          'unique_id' => 'f732a61c-cdae-435c-9c0c-55a893321fed',
          'followup_type' => 'visit1',
          'followup_child_labor' => 'in_child_labor',
          'followup_needed_by_date' => '2022-12-13',
          'followup_date' => '2022-12-13'
        },
        {
          'unique_id' => '4b7c1011-a63e-422c-b6fb-a64cdcc2d472',
          'followup_type' => 'visit2',
          'followup_child_labor' => 'in_child_labor',
          'followup_needed_by_date' => '2023-01-03',
          'followup_date' => '2023-01-03'
        }
      ]
      @child.save!
      expect(@child.reload.followup_status).to eq(Child::FOLLOW_UPS_IMPLEMENTED)
    end
  end

  after :each do
    clean_data(Child)
  end
end
