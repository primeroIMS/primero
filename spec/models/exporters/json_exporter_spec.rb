require 'rails_helper'

module Exporters
  describe JSONExporter do

    before :each do
      [Field, FormSection].each(&:destroy_all)
    end

    it "converts models to JSON format" do
      form_section = create(:form_section, unique_id: 'form_section_exporter')
      create(:field, name: 'name_first', form_section: form_section)
      create(:field, name: 'estimated', form_section: form_section, type: Field::TICK_BOX)
      models = [create(:child, name_first: 'Test', estimated: false)]
      fields = Field.where(name: ['name_first', 'estimated']).to_a
      data_hash = JSON.parse(JSONExporter.export(models, fields))

      data_hash.should == [{
        'data' => { 'name_first' => 'Test', 'estimated' => false },
        'duplicate_case_id' => nil,
        'matched_trace_id' => nil,
        'matched_tracing_request_id' => nil,
        'id' => models[0].id
      }]
    end
  end

  describe "convert_model_to_hash" do
    before :each do
      @exporter = Exporters::JSONExporter.new
      [Field, FormSection, Lookup].each(&:destroy_all)
      form_section = create(:form_section, unique_id: 'form_section_exporter')
      create(:field, name: 'name_first', form_section: form_section)
      create(:field, name: 'survivor_code_no', form_section: form_section)
      create(:field, :date, name: 'date_last_seen', form_section: form_section)
      create(:select_field, name: 'nationality', form_section: form_section,
             option_strings_text: [{"id"=>"nationality1", "display_text"=>"Nationality 1"}, {"id"=>"nationality2", "display_text"=>"Nationality 2"}])

      create(:subform_field, name: 'family_details_section', form_section: form_section,
              fields: [
                create(:field, name: 'relation_name'),
                create(:field, name: 'relation')
              ])
      @model_class = Child
      @instance = @model_class.new
      @instance.data = {
        family_details_section: [
          {:relation_name => 'John', :relation => 'father'},
          {:relation_name => 'Mary', :relation => 'mother'},
        ],
        nationality: ['nationality1', 'nationality2']
      }
    end

    it "should handled nested data" do
      field = Field.where(name: 'family_details_section').first
      hash = @exporter.convert_model_to_hash(@instance, [field])

      hash.should == {
      'data' => {
        'family_details_section' => [
          {'relation_name' => 'John', 'relation' => 'father'},
          {'relation_name' => 'Mary', 'relation' => 'mother'}
        ],
      },
      'duplicate_case_id' => nil,
      'id' => @instance.id,
      'matched_trace_id' => nil,
      'matched_tracing_request_id' => nil
    }

    end

    it "should exclude unlisted properties" do
      field = Field.where(name: 'survivor_code_no').first
      hash = @exporter.convert_model_to_hash(@instance, [field])

      hash.keys.should == [
        'id', 'data', 'matched_tracing_request_id',
        'matched_trace_id', 'duplicate_case_id'
      ]
    end
  end
end
