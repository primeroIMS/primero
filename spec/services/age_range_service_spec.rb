# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe AgeRangeService do
  describe '.primary_age_ranges' do
    let(:primary_age_ranges) { [0..5, 6..11, 12..17, 18..AgeRange::MAX] }

    let(:module_age_ranges) { [0..11, 12..17, 18..AgeRange::MAX] }

    let(:primero_program) do
      PrimeroProgram.create!(
        unique_id: 'primeroprogram-test',
        name: 'Primero',
        description: 'Default Primero Program'
      )
    end

    let(:module_with_ranges) do
      PrimeroModule.create!(
        unique_id: 'module-with-ranges',
        name: 'Module with Age Ranges',
        associated_record_types: %w[case tracing_request incident],
        age_ranges: module_age_ranges,
        primero_program:
      )
    end

    let(:module_without_ranges) do
      PrimeroModule.create!(
        unique_id: 'module-without-ranges',
        name: 'Module without Age Ranges',
        associated_record_types: %w[case tracing_request incident],
        primero_program:
      )
    end

    before do
      clean_data(PrimeroModule, PrimeroProgram)
      SystemSettings.stub(:primary_age_ranges).and_return(primary_age_ranges)
      module_with_ranges
      module_without_ranges
    end

    it 'returns the SystemSetting age range if a module_unique_id is not specified' do
      expect(AgeRangeService.primary_age_ranges).to eq(primary_age_ranges)
    end

    it 'returns the SystemSetting age range if the module does not have age_ranges' do
      expect(AgeRangeService.primary_age_ranges('module-without-ranges')).to eq(primary_age_ranges)
    end

    it 'returns the SystemSetting age range if the module does not exist' do
      expect(AgeRangeService.primary_age_ranges('module-does-not-exist')).to eq(primary_age_ranges)
    end

    it 'returns the module age range if the module has age_ranges' do
      expect(AgeRangeService.primary_age_ranges('module-with-ranges')).to eq(module_age_ranges)
    end
  end
end
