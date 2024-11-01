# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe PhoneticSearchable do
  let(:child1) do
    Child.create!(
      data: { name_first: 'First 1', name_last: 'Last 1', unhcr_id_no: 'UNHCR/2024-001', national_id_no: 'NID-001' }
    )
  end

  before do
    clean_data(SearchableIdentifier, Child)
    child1
  end

  describe 'recalculate_searchable_identifiers' do
    it 'creates the searchable identifiers for the record' do
      child = Child.create!(
        data: { name_first: 'First 2', name_last: 'Last 2', unhcr_id_no: 'UNHCR/2024-002', national_id_no: 'NID-002' }
      )
      searchable_identifiers = SearchableIdentifier.where(record_type: Child.name, record_id: child.id)

      expect(searchable_identifiers.size).to eq(6)
      expect(searchable_identifiers.map(&:field_name)).to match_array(
        %w[unhcr_id_no national_id_no unique_identifier short_id case_id case_id_display]
      )
      expect(searchable_identifiers.map(&:value)).to match_array(
        ['UNHCR/2024-002', 'NID-002', child.unique_identifier, child.short_id, child.case_id, child.case_id_display]
      )
    end

    it 'creates the searchable identifiers without leading/trailing whitespaces' do
      child = Child.create!(
        data: { name_first: 'First 3', name_last: 'Last 3', unhcr_id_no: '    UNHCR/2024-003   ', national_id_no: '   NID-003' }
      )
      searchable_identifiers = SearchableIdentifier.where(record_type: Child.name, record_id: child.id)

      expect(searchable_identifiers.size).to eq(6)
      expect(searchable_identifiers.map(&:field_name)).to match_array(
        %w[unhcr_id_no national_id_no unique_identifier short_id case_id case_id_display]
      )
      expect(searchable_identifiers.map(&:value)).to match_array(
        ['UNHCR/2024-003', 'NID-003', child.unique_identifier, child.short_id, child.case_id, child.case_id_display]
      )
    end

    it 'updates the searchable identifiers for the record' do
      child1.unhcr_id_no = 'UNHCR/2025-001'
      child1.national_id_no = nil
      child1.save!

      searchable_identifiers = SearchableIdentifier.where(record_type: Child.name, record_id: child1.id)
      expect(searchable_identifiers.map(&:value)).to match_array(
        ['UNHCR/2025-001', nil, child1.unique_identifier, child1.short_id, child1.case_id, child1.case_id_display]
      )
    end
  end
end
