# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ReportFieldService do
  before do
    Field.destroy_all
    Lookup.destroy_all
    Report.destroy_all

    I18n.stub(:available_locales).and_return(%i[en es fr])

    SystemSettings.stub(:current).and_return(
      SystemSettings.new(
        primary_age_range: 'primero',
        reporting_location_config: { admin_level: 3 },
        age_ranges: {
          'primero' => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
          'unhcr' => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
        }
      )
    )

    @owned_by_location_field = Field.create!(
      name: 'owned_by_location',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Owned by location' },
      option_strings_source: 'Location'
    )

    @service_location_field = Field.create!(
      name: 'service_location',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Service Location' },
      option_strings_source: 'ReportingLocation'
    )

    @owned_by_agency_field = Field.create!(
      name: 'owned_by_agency',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Owned by agency' },
      option_strings_source: 'Agency'
    )

    Field.create!(
      name: 'protection_concerns',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Protection Concerns' },
      option_strings_source: 'lookup lookup-protection-concerns'
    )

    @sex_field = Field.create!(
      name: 'sex',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Sex' },
      option_strings_text_i18n: [
        { id: 'male', display_text: { 'en' => 'Male' } },
        { id: 'female', display_text: { 'en' => 'Female' } }
      ]
    )

    Lookup.create!(
      unique_id: 'lookup-risk-level',
      name_en: 'risk_level',
      lookup_values_en: [
        { id: 'high', display_text: 'High' },
        { id: 'medium', display_text: 'Medium' },
        { id: 'low', display_text: 'Low' }
      ].map(&:with_indifferent_access)
    )

    @risk_level_field = Field.create!(
      name: 'risk_level',
      type: Field::SELECT_BOX,
      display_name_i18n: { en: 'Risk level' },
      option_strings_source: 'lookup lookup-risk-level'
    )

    @report1 = Report.create!(
      id: 1,
      name_en: 'Protection Concerns By Location',
      description_en: '',
      module_id: PrimeroModule::CP,
      record_type: 'case',
      aggregate_by: ['owned_by_location'],
      disaggregate_by: ['protection_concerns'],
      filters: [
        { 'attribute' => 'status', 'value' => [Record::STATUS_OPEN] },
        { 'attribute' => 'record_state', 'value' => ['true'] }
      ],
      editable: false
    )
  end

  it 'returns the horizontal fields' do
    horizontal_field = {
      name: 'owned_by_location',
      display_name: { 'en' => 'Owned by location' },
      position: { type: 'horizontal', order: 0 },
      option_strings_source: 'Location'
    }
    horizontal_fields = ReportFieldService.horizontal_fields(@report1)
    expect(horizontal_fields.first).to eq(horizontal_field)
  end

  it 'returns the vertical fields' do
    vertical_field = {
      name: 'protection_concerns',
      display_name: { 'en' => 'Protection Concerns' },
      position: { type: 'vertical', order: 0 }

    }
    vertical_fields = ReportFieldService.vertical_fields(@report1)
    expect(vertical_fields.first).to eq(vertical_field)
  end

  it 'returns a field withs options from lookup' do
    report_risk_field = {
      name: 'risk_level',
      display_name: { 'en' => 'Risk level' },
      position: { type: 'horizontal', order: 0 },
      option_labels: {
        'en' => [
          { 'id' => 'high', 'display_text' => 'High' },
          { 'id' => 'medium', 'display_text' => 'Medium' },
          { 'id' => 'low', 'display_text' => 'Low' }
        ],
        'es' => [],
        'fr' => []
      }
    }
    report_field = ReportFieldService.report_field(@risk_level_field, 'risk_level', 'horizontal', 0, Child.parent_form)
    expect(report_field).to eq(report_risk_field)
  end

  it 'returns a location field' do
    report_owned_by_location_field = {
      name: 'owned_by_location',
      display_name: { 'en' => 'Owned by location' },
      position: { type: 'horizontal', order: 0 },
      option_strings_source: 'Location'
    }
    report_field = ReportFieldService.report_field(
      @owned_by_location_field, 'owned_by_location', 'horizontal', 0, Child.parent_form
    )
    expect(report_field).to eq(report_owned_by_location_field)
  end

  it 'returns a location field with admin level' do
    report_owned_by_location_field = {
      name: 'owned_by_location',
      display_name: { 'en' => 'Owned by location' },
      position: { type: 'horizontal', order: 0 },
      option_strings_source: 'Location',
      admin_level: 2
    }
    report_field = ReportFieldService.report_field(
      @owned_by_location_field, 'owned_by_location2', 'horizontal', 0, Child.parent_form
    )
    expect(report_field).to eq(report_owned_by_location_field)
  end

  it 'returns a agency field' do
    report_owned_by_agency_field = {
      name: 'owned_by_agency',
      display_name: { 'en' => 'Owned by agency' },
      position: { type: 'horizontal', order: 0 },
      option_strings_source: 'Agency'
    }
    report_field = ReportFieldService.report_field(
      @owned_by_agency_field, 'owned_by_agency', 'horizontal', 0, Child.parent_form
    )
    expect(report_field).to eq(report_owned_by_agency_field)
  end

  it 'returns a field with options from string text source' do
    report_sex_field = {
      name: 'sex',
      display_name: { 'en' => 'Sex' },
      position: { type: 'horizontal', order: 0 },
      option_labels: {
        'en' => [
          { 'id' => 'male', 'display_text' => 'Male' },
          { 'id' => 'female', 'display_text' => 'Female' }
        ],
        'es' => [],
        'fr' => []
      }
    }
    report_field = ReportFieldService.report_field(@sex_field, 'sex_field', 'horizontal', 0, Child.parent_form)
    expect(report_field).to eq(report_sex_field)
  end

  describe '.user_groups_options' do
    before do
      clean_data(User, UserGroup)

      allow(I18n).to receive(:available_locales).and_return(%i[es en])
    end

    let!(:group1) { UserGroup.create!(unique_id: 'group_1', name: 'User Group 1') }
    let!(:group2) { UserGroup.create!(unique_id: 'group_2', name: 'User Group 2') }
    let!(:group3) { UserGroup.create!(unique_id: 'group_3', name: 'User Group 3') }
    let!(:disabled_group) { UserGroup.create!(unique_id: 'group_4', name: 'User Group 4', disabled: true) }

    it 'returns option_labels for all available locales with enabled user groups' do
      result = ReportFieldService.user_groups_options
      expect(result).to eq(
        option_labels: {
          en: [
            { display_text: 'User Group 1', id: 'group_1' },
            { display_text: 'User Group 2', id: 'group_2' },
            { display_text: 'User Group 3', id: 'group_3' }
          ],
          es: [
            { display_text: 'User Group 1', id: 'group_1' },
            { display_text: 'User Group 2', id: 'group_2' },
            { display_text: 'User Group 3', id: 'group_3' }
          ]
        }
      )
    end
  end
end
