require 'rails_helper'

#TODO add i18n tests

describe Report do

  before :all do
    clean_data(PrimeroProgram, PrimeroModule, FormSection)
    @module = create :primero_module
  end

  it "must have a name" do
    r = Report.new record_type: "case", aggregate_by: ['a', 'b'], module_id: @module.unique_id
    expect(r.valid?).to be_falsey
    r.name = 'Test'
    expect(r.valid?).to be_truthy
  end

  it "must have an 'aggregate_by' value" do
    r = Report.new name: 'Test', record_type: 'case', module_id: @module.unique_id
    expect(r.valid?).to be_falsey
    r.aggregate_by = ['a', 'b']
    expect(r.valid?).to be_truthy
  end

  it "must have a record type associated with itself" do
    r = Report.new name: 'Test', aggregate_by: ['a', 'b'], module_id: @module.unique_id
    expect(r.valid?).to be_falsey
    r.record_type = 'case'
    expect(r.valid?).to be_truthy
  end

  it "doesn't point to invalid modules" do
    r = Report.new name: 'Test', aggregate_by: ['a', 'b'], module_id: 'nosuchmodule' #, @module.unique_id
    expect(r.valid?).to be_falsey
  end

  it "lists reportable record types" do
    expect(Report.reportable_record_types).to include('case','incident', 'tracing_request', 'violation')
  end

  describe "nested reports" do

    it "lists reportsable nested record types" do
      expect(Report.reportable_record_types).to include('reportable_follow_up', 'reportable_protection_concern', 'reportable_service')
    end

    it "has default follow up filters" do
      r = Report.new(record_type: 'reportable_follow_up', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include({'attribute' => 'followup_date', 'constraint' => 'not_null'})
    end

    it "has default service filters" do
      r = Report.new(record_type: 'reportable_service', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include(
        {'attribute' => 'service_type', 'value' => 'not_null'},
        {'attribute' => 'service_appointment_date', 'constraint' => 'not_null'}
      )
    end

    it "has default protection concern filters" do
      r = Report.new(record_type: 'reportable_protection_concern', add_default_filters: true)
      r.apply_default_filters
      expect(r.filters).to include({'attribute' => 'protection_concern_type', 'value' => 'not_null'})
    end

  end

  describe "#value_vector" do
    it "will parse a Solr output to build a vector of pivot counts keyd by the pivot fields" do

      test_rsolr_output = {
        'pivot' => [
          {
            'value' => 'Somalia',
            'count' => 5,
            'pivot' => [
              {'value' => 'male', 'count' => 3},
              {'value'=> 'female', 'count' => 2},
            ]
          },
          {
            'value' => 'Burundi',
            'count' => 7,
            'pivot' => [
              {'value' => 'male', 'count' => 3},
              {'value' => 'female', 'count' => 4},
            ]
          },
          {
            'value' => 'Kenya',
            'count' => 9,
            'pivot' => [
              {'value' => 'male', 'count' => 5},
              {'value' => 'female', 'count' => 4},
            ]
          }
        ]
      }

      r = Report.new
      result = r.value_vector([],test_rsolr_output)
      expect(result).to match_array(
        [
          [["", ""], nil],
          [['Somalia',""],5],[['Somalia','male'],3],[['Somalia','female'],2],
          [['Burundi',""],7],[['Burundi','male'],3],[['Burundi','female'],4],
          [['Kenya',""],9],[['Kenya','male'],5],[['Kenya','female'],4]
        ]
      )
    end
  end

  describe "modules_present" do
    it "will reject the empty module_id list" do
      r = Report.new record_type: "case", aggregate_by: ['a', 'b'], module_id: ''
      r.modules_present.should == I18n.t("errors.models.report.module_presence")
    end

    it "will reject the invalid module_id list" do
      r = Report.new record_type: "case", aggregate_by: ['a', 'b'], module_id: "badmoduleid"
      r.modules_present.should == I18n.t("errors.models.report.module_syntax")
    end

    it "will accept the valid module_id list" do
      r = Report.new record_type: "case", aggregate_by: ['a', 'b'], module_id: "primeromodule-cp"
      r.modules_present.should == true
    end

  end

  describe 'values_as_json_hash' do
    it "returns a hash with the values as nested keys" do
      report = Report.new
      report.stub(:values).and_return({["female", "country_1"] => 5})
      values_as_hash = { 'female' => { 'country_1' => { '_total' => 5 } } }
      expect(report.values_as_json_hash).to eq(values_as_hash)
    end

    it "returns a hash with the values as nested keys with 2 levels" do
      report = Report.new
      report.stub(:values).and_return(
        {
          ['female', 'country_1'] => 5,
          ['female', 'country_2'] => 3,
          ['female', ''] => 8
        }
      )
      values_as_hash = {
        'female' => {
          'country_1' => { '_total' => 5 },
          'country_2' => { '_total' => 3 },
          "_total" => 8
        }
      }
      expect(report.values_as_json_hash).to eq(values_as_hash)
    end

    it "returns a hash with the values as nested keys with 3 levels" do
      report = Report.new
      report.stub(:values).and_return(
        {
          ['female', 'country_1', 'city_1'] => 2,
          ['female', 'country_1', 'city_2'] => 2,
          ['female', 'country_2', 'city_1'] => 3,
          ['female', 'country_2', 'city_2'] => 2,
          ['female', 'country_1', ''] => 4,
          ['female', 'country_2', ''] => 5,
          ['female', '', ''] => 9,
          ['male', 'country_1', 'city_1'] => 2,
          ['male', 'country_1', 'city_2'] => 2,
          ['male', 'country_2', 'city_1'] => 3,
          ['male', 'country_2', 'city_2'] => 2,
          ['male', 'country_1', ''] => 4,
          ['male', 'country_2', ''] => 5,
          ['male', '', ''] => 9
        }
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
end
