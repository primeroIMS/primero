# frozen_string_literal: true

require 'rails_helper'

describe CareArrangements do
  describe '#current_care_arrangements_changes' do
    before do
      clean_data(Child)
    end

    let(:test_record) do
      Child.create(
        name: 'bar',
        data: { name: 'name test', module_id: 'primeromodule-cp' }
      )
    end
    it 'returns the current care arragment fields if care_arrangements_section changed' do
      test_record.care_arrangements_section = [{ care_arrangements_type: 'test', name_caregiver: 'caregiver' }]
      test_record.save!
      expect(
        test_record.current_care_arrangements_changes
      ).to eq(Child::CURRENT_CARE_ARRANGEMENTS_FIELDS)
    end
    it 'returns the empty array if care_arrangements_section did not changed' do
      test_record.age = 1
      test_record.save!
      expect(test_record.current_care_arrangements_changes).to eq([])
    end
  end
end
