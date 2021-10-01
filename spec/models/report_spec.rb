# frozen_string_literal: true

require 'rails_helper'

# TODO: add i18n tests
describe Report do
  before :all do
    clean_data(PrimeroProgram, PrimeroModule, FormSection, Field, Child)
    @module = create :primero_module
  end

  it 'must have a name' do
    r = Report.new(
      record_type: 'case', unique_id: 'report-test', aggregate_by: %w[a b], module_id: @module.unique_id
    )
    expect(r.valid?).to be_falsey
    r.name = 'Test'
    expect(r.valid?).to be_truthy
  end

  it "must have an 'aggregate_by' value" do
    r = Report.new(
      name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: @module.unique_id
    )
    expect(r.valid?).to be_falsey
    r.aggregate_by = %w[a b]
    expect(r.valid?).to be_truthy
  end

  it 'must have a record type associated with itself' do
    r = Report.new(
      name: 'Test', aggregate_by: %w[a b], module_id: @module.unique_id, unique_id: 'report-test'
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

  it 'lists reportable record types' do
    expect(Report.reportable_record_types).to include('case', 'incident', 'tracing_request', 'violation')
  end

  describe 'nested reports' do
    it 'lists reportsable nested record types' do
      expect(Report.reportable_record_types).to include(
        'reportable_follow_up', 'reportable_protection_concern', 'reportable_service'
      )
    end

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
        name: 'Test', record_type: 'case', aggregate_by: %w[a b], module_id: @module.unique_id
      )
      expect(r.unique_id).to match(/^report-test-[0-9a-f]{7}$/)
    end
  end

  describe '#value_vector' do
    it 'will parse a Solr output to build a vector of pivot counts keyd by the pivot fields' do
      test_rsolr_output = {
        'pivot' => [
          {
            'value' => 'Somalia',
            'count' => 5,
            'pivot' => [
              { 'value' => 'male', 'count' => 3 },
              { 'value' => 'female', 'count' => 2 }
            ]
          },
          {
            'value' => 'Burundi',
            'count' => 7,
            'pivot' => [
              { 'value' => 'male', 'count' => 3 },
              { 'value' => 'female', 'count' => 4 }
            ]
          },
          {
            'value' => 'Kenya',
            'count' => 9,
            'pivot' => [
              { 'value' => 'male', 'count' => 5 },
              { 'value' => 'female', 'count' => 4 }
            ]
          }
        ]
      }

      r = Report.new
      result = r.value_vector([], test_rsolr_output)
      expect(result).to match_array(
        [
          [['', ''], nil],
          [['Somalia', ''], 5], [%w[Somalia male], 3], [%w[Somalia female], 2],
          [['Burundi', ''], 7], [%w[Burundi male], 3], [%w[Burundi female], 4],
          [['Kenya', ''], 9], [%w[Kenya male], 5], [%w[Kenya female], 4]
        ]
      )
    end
  end

  describe 'modules_present' do
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
      expect(r.modules_present).to be_nil
    end
  end

  describe 'values_as_json_hash' do
    it 'returns a hash with the values as nested keys' do
      report = Report.new
      report.stub(:values).and_return(%w[female country_1] => 5)
      values_as_hash = { 'female' => { 'country_1' => { '_total' => 5 } } }
      expect(report.values_as_json_hash).to eq(values_as_hash)
    end

    it 'returns a hash with the values as nested keys with 2 levels' do
      report = Report.new
      report.stub(:values).and_return(
        %w[female country_1] => 5,
        %w[female country_2] => 3,
        ['female', ''] => 8
      )
      values_as_hash = {
        'female' => {
          'country_1' => { '_total' => 5 },
          'country_2' => { '_total' => 3 },
          '_total' => 8
        }
      }
      expect(report.values_as_json_hash).to eq(values_as_hash)
    end

    it 'returns a hash with the values as nested keys with 3 levels' do
      report = Report.new
      report.stub(:values).and_return(
        %w[female country_1 city_1] => 2,
        %w[female country_1 city_2] => 2,
        %w[female country_2 city_1] => 3,
        %w[female country_2 city_2] => 2,
        ['female', 'country_1', ''] => 4,
        ['female', 'country_2', ''] => 5,
        ['female', '', ''] => 9,
        %w[male country_1 city_1] => 2,
        %w[male country_1 city_2] => 2,
        %w[male country_2 city_1] => 3,
        %w[male country_2 city_2] => 2,
        ['male', 'country_1', ''] => 4,
        ['male', 'country_2', ''] => 5,
        ['male', '', ''] => 9
      )
      values_as_hash = {
        'female' => {
          'country_1' => {
            'city_1' => { '_total' => 2 },
            'city_2' => { '_total' => 2 },
            '_total' => 4
          },
          'country_2' => {
            'city_1' => { '_total' => 3 },
            'city_2' => { '_total' => 2 },
            '_total' => 5
          },
          '_total' => 9
        },
        'male' => {
          'country_1' => {
            'city_1' => { '_total' => 2 },
            'city_2' => { '_total' => 2 },
            '_total' => 4
          },
          'country_2' => {
            'city_1' => { '_total' => 3 },
            'city_2' => { '_total' => 2 },
            '_total' => 5
          },
          '_total' => 9
        }
      }
      expect(report.values_as_json_hash).to eq(values_as_hash)
    end
  end

  describe 'is_graph' do
    context 'when is_graph is in params' do
      before do
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: @module.unique_id,
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
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: @module.unique_id,
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
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: @module.unique_id,
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
        @report = Report.new(name: 'Test', unique_id: 'report-test', record_type: 'case', module_id: @module.unique_id,
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

  describe 'exclude_empty_rows', search: true do
    before :each do
      clean_data(FormSection, Field, Child, Report)

      SystemSettings.stub(:current).and_return(
        SystemSettings.new(
          primary_age_range: 'primero',
          age_ranges: {
            'primero' => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
            'unhcr' => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
          }
        )
      )

      Child.create!(data: { sex: 'female', module_id: @module.unique_id })
      Child.create!(data: { sex: 'female', module_id: @module.unique_id })
      Child.create!(data: { sex: 'female', module_id: @module.unique_id })
      Child.create!(data: { sex: 'male', module_id: @module.unique_id })

      Child.reindex
    end

    context 'when it is true' do
      before :each do
        @report = Report.new(
          name: 'Test',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: @module.unique_id,
          graph: true,
          exclude_empty_rows: true,
          aggregate_by: ['sex'],
          disaggregate_by: []
        )
      end

      it 'should not return values with zero' do
        Child.where('data @> ?', { sex: 'male' }.to_json).each(&:remove_from_index!)

        @report.build_report

        expect(@report.values).to eq(['female'] => 3, [''] => nil)
      end
    end

    context 'when it is false' do
      before :each do
        @report = Report.new(
          name: 'Test',
          unique_id: 'report-test',
          record_type: 'case',
          module_id: @module.unique_id,
          graph: true,
          exclude_empty_rows: false,
          aggregate_by: ['sex'],
          disaggregate_by: []
        )
      end

      it 'should return values with zero' do
        Child.where('data @> ?', { sex: 'male' }.to_json).each(&:remove_from_index!)

        @report.build_report

        expect(@report.values).to eq(['female'] => 3, ['male'] => 0, [''] => nil)
      end
    end
  end
end
