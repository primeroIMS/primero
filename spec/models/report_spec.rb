# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

# TODO: add i18n tests
describe Report do
  before :all do
    clean_data(PrimeroModule, PrimeroProgram, FormSection, Field, Child)
  end

  let(:module1) { create :primero_module }
  let(:module2) { create :primero_module }

  it 'must have a name' do
    r = Report.new(
      record_type: 'case', unique_id: 'report-test', aggregate_by: %w[a b], module_id: module1.unique_id
    )
    expect(r.valid?).to be_falsey
    r.name = 'Test'
    expect(r.valid?).to be_truthy
  end

  it "must have an 'aggregate_by' value" do
    r = Report.new(
      name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: module1.unique_id
    )
    expect(r.valid?).to be_falsey
    r.aggregate_by = %w[a b]
    expect(r.valid?).to be_truthy
  end

  it 'must have a record type associated with itself' do
    r = Report.new(
      name: 'Test', aggregate_by: %w[a b], module_id: module1.unique_id, unique_id: 'report-test'
    )
    expect(r.valid?).to be_falsey
    r.record_type = 'case'
    expect(r.valid?).to be_truthy
  end

  it "doesn't point to invalid modules" do
    r = Report.new(
      name: 'Test', aggregate_by: %w[a b], module_id: 'nosuchmodule', unique_id: 'report-test'
    )
    expect(r.valid?).to be_falsey
  end

  describe 'nested reports' do
    it 'has default follow up filters' do
      r = Report.new(record_type: 'reportable_follow_up', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include('attribute' => 'followup_date', 'constraint' => 'not_null')
    end

    it 'has default service filters' do
      r = Report.new(record_type: 'reportable_service', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include(
        { 'attribute' => 'service_type', 'value' => 'not_null' },
        'attribute' => 'service_appointment_date', 'constraint' => 'not_null'
      )
    end

    it 'has default protection concern filters' do
      r = Report.new(record_type: 'reportable_protection_concern', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include('attribute' => 'protection_concern_type', 'value' => 'not_null')
    end

    it 'generates a unique id' do
      r = Report.create!(
        name: 'Test', record_type: 'case', aggregate_by: %w[a b], module_id: module1.unique_id
      )
      expect(r.unique_id).to match(/^report-test-[0-9a-f]{7}$/)
    end
  end

  describe 'validate_modules_present' do
    it 'will reject the empty module_id list' do
      r = Report.new record_type: 'case', aggregate_by: %w[a b], module_id: ''
      expect(r.valid?).to be_falsey
      expect(r.errors[:module_id][0]).to eq(I18n.t('errors.models.report.module_presence'))
    end

    it 'will reject the invalid module_id list' do
      r = Report.new record_type: 'case', aggregate_by: %w[a b], module_id: 'badmoduleid'
      expect(r.valid?).to be_falsey
      expect(r.errors[:module_id][0]).to eq(I18n.t('errors.models.report.module_syntax'))
    end

    it 'will accept the valid module_id list' do
      r = Report.new record_type: 'case', aggregate_by: %w[a b], module_id: 'primeromodule-cp'
      expect(r.validate_modules_present).to be_nil
    end
  end

  describe 'is_graph' do
    context 'when is_graph is in params' do
      before do
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: module1.unique_id,
                             is_graph: true)
      end

      it 'has value for is_graph' do
        expect(@report.is_graph).to be_truthy
      end

      it 'has value for graph' do
        expect(@report.graph).to be_truthy
      end
    end

    context 'when graph is in params' do
      before do
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: module1.unique_id,
                             graph: true)
      end

      it 'has value for is_graph' do
        expect(@report.is_graph).to be_truthy
      end

      it 'has value for graph' do
        expect(@report.graph).to be_truthy
      end
    end

    context 'when is_graph is updated' do
      before :each do
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: module1.unique_id,
                             is_graph: false)
      end

      it 'updates is_graph' do
        expect(@report.is_graph).to be_falsey

        @report.update_properties(is_graph: true)
        expect(@report.is_graph).to be_truthy
      end

      it 'updates graph' do
        expect(@report.graph).to be_falsey

        @report.update_properties(is_graph: true)
        expect(@report.graph).to be_truthy
      end
    end

    context 'when graph is updated' do
      before :each do
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: module1.unique_id,
                             graph: false)
      end

      it 'updates is_graph' do
        expect(@report.is_graph).to be_falsey

        @report.update_properties(graph: true)
        expect(@report.is_graph).to be_truthy
      end

      it 'updates graph' do
        expect(@report.graph).to be_falsey

        @report.update_properties(graph: true)
        expect(@report.graph).to be_truthy
      end
    end
  end

  describe 'exclude_empty_rows' do
    before :each do
      clean_data(FormSection, Field, Child, Lookup, Report)

      SystemSettings.stub(:current).and_return(
        SystemSettings.new(
          primary_age_range: 'primero',
          age_ranges: {
            'primero' => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
            'unhcr' => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
          }
        )
      )

      Lookup.create!(
        unique_id: 'lookup-sex',
        name_en: 'sex',
        lookup_values_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'sex', display_name: 'sex', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-sex'
      )

      Child.create!(data: { sex: 'female', module_id: module1.unique_id })
      Child.create!(data: { sex: 'female', module_id: module1.unique_id })
      Child.create!(data: { sex: 'female', module_id: module1.unique_id })
    end

    context 'when it is true' do
      before :each do
        @report = Report.new(
          name: 'Test',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: module1.unique_id,
          graph: true,
          exclude_empty_rows: true,
          aggregate_by: ['sex'],
          disaggregate_by: []
        )
      end

      it 'should not return values with zero' do
        Child.where('data @> ?', { sex: 'male' }.to_json).destroy_all

        @report.build_report

        expect(@report.data).to eq('female' => { '_total' => 3 })
      end
    end

    context 'when it is false' do
      before :each do
        @report = Report.new(
          name: 'Test',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: module1.unique_id,
          graph: true,
          exclude_empty_rows: false,
          aggregate_by: ['sex'],
          disaggregate_by: []
        )
      end

      it 'should return values with zero' do
        Child.where('data @> ?', { sex: 'male' }.to_json).destroy_all

        @report.build_report

        expect(@report.data).to eq('female' => { '_total' => 3 }, 'male' => { '_total' => 0 })
      end
    end
  end

  describe 'filter_query' do
    before :each do
      clean_data(FormSection, Field, Child, Lookup, Report)

      SystemSettings.stub(:current).and_return(
        SystemSettings.new(
          primary_age_range: 'primero',
          age_ranges: {
            'primero' => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
            'unhcr' => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
          }
        )
      )

      Lookup.create!(
        unique_id: 'lookup-sex',
        name_en: 'sex',
        lookup_values_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ].map(&:with_indifferent_access)
      )

      Lookup.create!(
        unique_id: 'lookup-status',
        name_en: 'status',
        lookup_values_en: [
          { id: 'open', display_text: 'Open' },
          { id: 'closed', display_text: 'Closed' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'sex', display_name: 'sex', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-sex'
      )

      Field.create!(
        name: 'status', display_name: 'status', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-status'
      )

      Child.create!(data: { status: 'closed', worklow: 'closed', sex: 'female', module_id: module1.unique_id })
      Child.create!(data: { status: 'closed', worklow: 'closed', sex: 'female', module_id: module1.unique_id })
      Child.create!(data: { status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id })
      Child.create!(data: { status: 'closed', worklow: 'closed', sex: 'male', module_id: module1.unique_id })
    end

    context 'when it has filter' do
      before :each do
        @report = Report.new(
          name: 'Test',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: module1.unique_id,
          graph: true,
          exclude_empty_rows: true,
          aggregate_by: ['sex'],
          disaggregate_by: [],
          filters: [
            {
              attribute: 'status',
              value: [
                'closed'
              ]
            }
          ]
        )
      end

      it 'should return 2 female and 1 male' do
        @report.build_report
        expect(@report.data).to eq('female' => { '_total' => 2 }, 'male' => { '_total' => 1 })
      end
    end

    context 'when it has a filter with two values' do
      before :each do
        @report = Report.new(
          name: 'Test - filter with two values',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: module1.unique_id,
          graph: true,
          exclude_empty_rows: true,
          aggregate_by: %w[sex status],
          disaggregate_by: [],
          filters: [
            {
              attribute: 'status',
              value: %w[open closed]
            }
          ]
        )
      end

      it 'should return 3 female and 1 male total' do
        @report.build_report
        expect(@report.data).to eq(
          {
            'female' => { '_total' => 3, 'closed' => { '_total' => 2 }, 'open' => { '_total' => 1 } },
            'male' => { '_total' => 1, 'closed' => { '_total' => 1 } }
          }
        )
      end
    end
  end

  describe 'agency report scope', search: true do
    let(:agency) { Agency.create!(name: 'Test Agency', agency_code: 'TA1', services: ['Test type']) }
    let(:agency_with_space) do
      Agency.create!(name: 'Test Agency with Space', agency_code: 'TA TA', services: ['Test type'])
    end

    let(:case_worker) do
      user = User.new(user_name: 'case_worker', agency_id: agency.id)
      user.save(validate: false) && user
    end

    let(:service_provider) do
      user = User.new(
        user_name: 'service_provider', agency_id: agency_with_space.id
      )
      user.save(validate: false) && user
    end

    before(:each) do
      clean_data(User, Agency, Field, Lookup, Child, Report)
      Lookup.create!(
        unique_id: 'lookup-services',
        name_en: 'services',
        lookup_values_en: [
          { id: 'alternative_care', display_text: 'Alternative Care' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'service_type',
        display_name: 'Service Type',
        type: Field::SELECT_BOX,
        option_strings_source: 'lookup lookup-services'
      )

      Field.create!(
        name: 'service_implemented',
        display_name: 'Service Implemented',
        type: Field::SELECT_BOX,
        option_strings_text_en: [
          { id: 'implemented', display_text: 'Implemented' }
        ]
      )

      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id,
          services_section: [
            {
              unique_id: '1', service_type: 'alternative_care',
              service_implemented_day_time: Time.now,
              service_implementing_agency: 'AGENCY WITH SPACE',
              service_implementing_agency_individual: 'service_provider'
            }
          ],
          owned_by: case_worker.user_name,
          assigned_user_names: [service_provider.user_name]
        }
      )
    end

    let(:report) do
      Report.new(
        name: 'Services',
        record_type: 'reportable_service',
        module_id: module1.unique_id,
        aggregate_by: ['service_type'],
        disaggregate_by: ['service_implemented'],
        permission_filter: { 'attribute' => 'associated_user_agencies', 'value' => [agency_with_space.unique_id] }
      )
    end

    it 'can be seen by the agency scope even if the agency has blank spaces in it unique_id' do
      report.build_report
      expect(report.data).to eq({ 'alternative_care' => { '_total' => 1, 'implemented' => { '_total' => 1 } } })
    end
  end

  describe 'user group report scope', search: true do
    let(:group_1) { UserGroup.create!(name: 'Test User Group 1') }
    let(:group_2) { UserGroup.create!(name: 'Test User Group 2') }
    let(:group_3) { UserGroup.create!(name: 'Test User Group 3') }

    let(:case_worker_1) do
      user = User.new(user_name: 'case_worker_1', user_groups: [group_1])
      user.save(validate: false) && user
    end

    let(:case_worker_2) do
      user = User.new(user_name: 'case_worker_2', user_groups: [group_1, group_2])
      user.save(validate: false) && user
    end

    let(:case_worker_3) do
      user = User.new(user_name: 'case_worker_3', user_groups: [group_3])
      user.save(validate: false) && user
    end

    let(:child1) do
      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'male', module_id: module1.unique_id,
          owned_by: case_worker_1.user_name
        }
      )
    end

    let(:child2) do
      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id,
          owned_by: case_worker_2.user_name
        }
      )
    end

    let(:child3) do
      Child.create!(
        data: {
          status: 'closed', worklow: 'closed', sex: 'female', module_id: module1.unique_id,
          owned_by: case_worker_3.user_name
        }
      )
    end

    before(:each) do
      clean_data(User, UserGroup, Field, Lookup, Child, Report)
      Lookup.create!(
        unique_id: 'lookup-sex',
        name_en: 'sex',
        lookup_values_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ].map(&:with_indifferent_access)
      )

      Lookup.create!(
        unique_id: 'lookup-status',
        name_en: 'status',
        lookup_values_en: [
          { id: 'open', display_text: 'Open' },
          { id: 'closed', display_text: 'Closed' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'sex', display_name: 'sex', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-sex'
      )

      Field.create!(
        name: 'status', display_name: 'status', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-status'
      )

      Field.create!(
        name: 'owned_by_groups',
        display_name: 'Groups of record owner',
        type: Field::SELECT_BOX,
        multi_select: true,
        option_strings_source: 'UserGroup'
      )

      child1
      child2
      child3
    end

    let(:report) do
      Report.new(
        name: 'Report by Status and Sex',
        record_type: 'case',
        module_id: module1.unique_id,
        aggregate_by: ['status'],
        disaggregate_by: ['sex'],
        permission_filter: { 'attribute' => 'owned_by_groups', 'value' => [group_1.unique_id, group_3.unique_id] }
      )
    end

    it 'can be seen by the group scope' do
      report.build_report
      expect(report.data).to eq(
        {
          'open' => { '_total' => 2, 'male' => { '_total' => 1 }, 'female' => { '_total' => 1 } },
          'closed' => { '_total' => 1, 'male' => { '_total' => 0 }, 'female' => { '_total' => 1 } }
        }
      )
    end

    it 'can be seen by the group scope when the permission filter only has a single group' do
      report.permission_filter = { 'attribute' => 'owned_by_groups', 'value' => [group_3.unique_id] }
      report.build_report
      expect(report.data).to eq(
        {
          'closed' => { '_total' => 1, 'male' => { '_total' => 0 }, 'female' => { '_total' => 1 } },
          'open' => { '_total' => 0 }
        }
      )
    end

    it 'can be seen by group if they also meet the filter' do
      report.filters = [{ 'attribute' => 'owned_by_groups', 'value' => [group_3.unique_id] }]
      report.build_report
      expect(report.data).to eq(
        {
          'open' => { '_total' => 0 },
          'closed' => { '_total' => 1, 'male' => { '_total' => 0 }, 'female' => { '_total' => 1 } }
        }
      )
    end
  end

  describe 'Incomplete Data' do
    before(:each) do
      clean_data(Field, Lookup, Child, Report)

      Lookup.create!(
        unique_id: 'lookup-service-type',
        name_en: 'status',
        lookup_values_en: [
          { id: 'education_formal', display_text: 'Education Formal' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'service_type',
        display_name: 'Service Type',
        type: Field::SELECT_BOX,
        option_strings_source: 'lookup lookup-service-type'
      )

      Field.create!(
        name: 'service_implementing_agency',
        display_name: 'Service Implementing Agency',
        type: Field::SELECT_BOX,
        option_strings_source: 'Agency'
      )

      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id,
          owned_by: 'user_owner', services_section: [
            {
              unique_id: 'f0a0f184-ab1d-4e02-a56b-9e1a1836b903',
              service_type: 'education_formal',
              service_implemented: 'not_implemented',
              service_status_referred: false,
              service_appointment_date: '2022-04-07'
            },
            {
              unique_id: 'c532d23e-5ce6-4ec2-a3bb-abc793aec459',
              service_type: 'education_formal',
              service_implemented: 'not_implemented',
              service_implementing_agency: 'agency1',
              service_status_referred: false,
              service_appointment_date: '2022-04-07'
            }
          ]
        }
      )
    end

    it 'returns incomplete_data if there is missing data' do
      report = Report.new(
        name: 'Report by Status and Sex',
        record_type: 'reportable_service',
        module_id: module1.unique_id,
        aggregate_by: ['service_implementing_agency'],
        disaggregate_by: ['service_type']
      )

      expect(report.build_report).to eq(
        {
          'agency1' => { '_total' => 1, 'education_formal' => { '_total' => 1 } },
          'incomplete_data' => { '_total' => 1, 'education_formal' => { '_total' => 1 } }
        }
      )
    end
  end

  describe 'datetimes' do
    let(:child1) do
      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'male', module_id: module1.unique_id,
          created_at: '2021-09-12T06:32:10.000Z', custom_ec4b5a0: 'green'
        }
      )
    end

    let(:child2) do
      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id,
          created_at: '2022-10-10T04:32:10.000Z', custom_ec4b5a0: 'red'
        }
      )
    end

    let(:child3) do
      Child.create!(
        data: {
          status: 'open', worklow: 'open', sex: 'female', module_id: module1.unique_id,
          created_at: '2022-10-05T04:32:10.000Z', custom_ec4b5a0: 'blue', custom_abc4x5a1: 'PR01'
        }
      )
    end

    let(:country) { Location.create!(placename_all: 'MyCountry', type: 'country', location_code: 'MC01') }

    let(:province) do
      Location.create!(
        hierarchy_path: "#{country.location_code}.PR01", type: 'province', location_code: 'PR01',
        placename_i18n: { en: 'Province 1' }
      )
    end

    before(:each) do
      clean_data(User, UserGroup, Field, Lookup, Location, Child, Report)

      country
      province

      Lookup.create!(
        unique_id: 'lookup-sex',
        name_en: 'sex',
        lookup_values_en: [
          { id: 'male', display_text: 'Male' },
          { id: 'female', display_text: 'Female' }
        ].map(&:with_indifferent_access)
      )

      Field.create!(
        name: 'sex', display_name: 'sex', type: Field::SELECT_BOX, option_strings_source: 'lookup lookup-sex'
      )

      Field.create!(
        name: 'custom_ec4b5a0', display_name: 'Custom', type: Field::TEXT_FIELD
      )

      Field.create!(
        name: 'custom_abc4x5a1', display_name: 'Custom Location', type: Field::SELECT_BOX,
        option_strings_source: 'Location'
      )

      Field.create!(
        name: 'created_at',
        display_name: 'Created At',
        type: Field::DATE_FIELD,
        date_include_time: true
      )

      child1
      child2
      child3
    end

    let(:report) do
      Report.new(
        name: 'Report by Created at and Sex',
        record_type: 'case',
        module_id: module1.unique_id,
        aggregate_by: ['sex'],
        disaggregate_by: ['created_at'],
        group_dates_by: Report::DAY
      )
    end

    let(:report_with_custom_field) do
      Report.new(
        name: 'Report by Sex and Custom Field',
        record_type: 'case',
        module_id: module1.unique_id,
        aggregate_by: ['custom_ec4b5a0'],
        disaggregate_by: ['sex']
      )
    end

    let(:report_with_custom_location_field) do
      Report.new(
        name: 'Report by Custom Location and Sex',
        record_type: 'case',
        module_id: module1.unique_id,
        aggregate_by: ['loc:custom_abc4x5a11'],
        disaggregate_by: ['sex']
      )
    end

    let(:report_with_date_filter) do
      Report.new(
        name: 'Report by Created at and Sex with Filter',
        record_type: 'case',
        module_id: module1.unique_id,
        aggregate_by: ['sex'],
        disaggregate_by: ['created_at'],
        group_dates_by: Report::DAY,
        filters: [{ 'value' => '2022-10-10', 'attribute' => 'created_at', 'constraint' => '>' }]
      )
    end

    it 'returns a data dissaggregate by created_at' do
      expect(report.build_report).to eq(
        {
          'male' => { '_total' => 1, '2021-09-12' => { '_total' => 1 } },
          'female' => { '_total' => 2, '2022-10-05' => { '_total' => 1 }, '2022-10-10' => { '_total' => 1 } }
        }
      )
    end

    it 'returns data only for records after 2022-10-10' do
      expect(report_with_date_filter.build_report).to eq(
        {
          'female' => { '_total' => 1, '2022-10-10' => { '_total' => 1 } },
          'male' => { '_total' => 0 }
        }
      )
    end

    it 'groups data by week' do
      report.group_dates_by = Report::WEEK

      expect(report.build_report).to eq(
        'male' => { '_total' => 1, '06-Sep-2021 - 12-Sep-2021' => { '_total' => 1 } },
        'female' => { '_total' => 2, '03-Oct-2022 - 09-Oct-2022' => { '_total' => 1 },
                      '10-Oct-2022 - 16-Oct-2022' => { '_total' => 1 } }
      )
    end

    it 'groups data by month' do
      report.group_dates_by = Report::MONTH

      expect(report.build_report).to eq(
        'male' => { '_total' => 1, '2021-Sep' => { '_total' => 1 } },
        'female' => { '_total' => 2, '2022-Oct' => { '_total' => 2 } }
      )
    end

    it 'groups data by year' do
      report.group_dates_by = Report::YEAR

      expect(report.build_report).to eq(
        'male' => { '_total' => 1, 2021 => { '_total' => 1 } },
        'female' => { '_total' => 2, 2022 => { '_total' => 2 } }
      )
    end

    it 'returns data for the custom field' do
      expect(report_with_custom_field.build_report).to eq(
        {
          'blue' => { '_total' => 1, 'male' => { '_total' => 0 }, 'female' => { '_total' => 1 } },
          'green' => { '_total' => 1, 'male' => { '_total' => 1 }, 'female' => { '_total' => 0 } },
          'red' => { '_total' => 1, 'male' => { '_total' => 0 }, 'female' => { '_total' => 1 } }
        }
      )
    end

    it 'returns data for the custom location field' do
      expect(report_with_custom_location_field.build_report).to eq(
        { 'PR01' => { '_total' => 1, 'female' => { '_total' => 1 }, 'male' => { '_total' => 0 } } }
      )
    end
  end

  describe 'records match the module in the report' do
    let(:child1) do
      Child.create!(
        data: { status: 'open', record_state: true, module_id: module1.unique_id, registration_date: '2021-10-15' }
      )
    end

    let(:child2) do
      Child.create!(
        data: { status: 'open', record_state: true, module_id: module2.unique_id, registration_date: '2021-10-15' }
      )
    end

    let(:registration_report) do
      Report.create!(
        name_all: 'Registration',
        description_all: 'Case registrations over time',
        module_id: module2.unique_id,
        record_type: 'case',
        aggregate_by: ['registration_date'],
        group_dates_by: 'month',
        filters: [
          { 'attribute' => 'status', 'value' => [Record::STATUS_OPEN] },
          { 'attribute' => 'record_state', 'value' => ['true'] }
        ],
        is_graph: true,
        editable: false
      )
    end

    let(:status_field) do
      Field.create!(
        name: 'status', display_name: 'status', type: Field::TEXT_FIELD
      )
    end

    let(:record_state_field) do
      Field.create!(
        name: 'record_state', display_name: 'record_state', type: Field::TICK_BOX
      )
    end

    let(:registration_date_field) do
      Field.create!(
        name: 'registration_date', display_name: 'registration_date', type: Field::DATE_FIELD
      )
    end

    before do
      clean_data(User, UserGroup, Field, Lookup, Location, Child, Report)
      child1
      child2
      status_field
      record_state_field
      registration_date_field
      registration_report
    end

    it 'returns the total for records that match the module' do
      expect(registration_report.build_report).to eq({ '2021-Oct' => { '_total' => 1 } })
    end
  end
end
