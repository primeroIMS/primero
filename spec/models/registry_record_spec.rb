# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RegistryRecord do
  before do
    clean_data(RegistryRecord)
  end

  describe 'parent_form' do
    it 'returns registry_record' do
      expect(RegistryRecord.parent_form).to eq('registry_record')
    end
  end

  describe 'registry_types' do
    before do
      @default_registry_types = [RegistryRecord::REGISTRY_TYPE_FARMER, RegistryRecord::REGISTRY_TYPE_FOSTER_CARE,
                                 RegistryRecord::REGISTRY_TYPE_INDIVIDUAL]
    end
    context 'when there are no system_options in SystemSettings' do
      before do
        SystemSettings.stub(:current).and_return(
          SystemSettings.new(primary_age_range: 'primero')
        )
      end

      it 'returns default types from Registry' do
        expect(RegistryRecord.registry_types).to match_array(@default_registry_types)
      end
    end

    context 'when there are system_options in SystemSettings' do
      context 'and registry_types is blank' do
        before do
          SystemSettings.stub(:current).and_return(
            SystemSettings.new(primary_age_range: 'primero',
                               system_options: { show_alerts: true })
          )
        end

        it 'returns default types from Registry' do
          expect(RegistryRecord.registry_types).to match_array(@default_registry_types)
        end
      end

      context 'and registry_types is present' do
        before do
          @ss_registry_types = %w[teacher girl boy dog]
          SystemSettings.stub(:current).and_return(
            SystemSettings.new(primary_age_range: 'primero',
                               system_options: { show_alerts: true,
                                                 registry_types: @ss_registry_types })
          )
        end

        it 'returns registry_types configured in SystemSettings' do
          expect(RegistryRecord.registry_types).to match_array(@ss_registry_types)
        end
      end
    end
  end

  describe 'quicksearch', search: true do
    it 'has a searchable case id, survivor number' do
      expected = %w[registry_id short_id registry_no registry_type name]
      expect(RegistryRecord.quicksearch_fields).to match_array(expected)
    end

    it 'can find a Registry Record by Registry Number' do
      registry = RegistryRecord.create!(registry_type: 'farmer',
                                        data: { name: 'Registry One', registry_no: 'ABC123XYZ' })
      registry.index!
      search_result = SearchService.search(RegistryRecord, query: 'ABC123XYZ').results
      expect(search_result).to have(1).registryRecord
      expect(search_result.first.registry_no).to eq('ABC123XYZ')
    end
  end

  describe 'phonetic tokens' do
    before do
      clean_data(RegistryRecord)
    end

    it 'generates the phonetic tokens' do
      registry_record = RegistryRecord.create!(data: { name: 'Miller' })
      expect(registry_record.tokens).to eq(%w[MLR])
    end
  end

  after do
    clean_data(RegistryRecord)
  end
end
