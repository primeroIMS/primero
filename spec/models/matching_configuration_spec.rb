require 'rails_helper'
require 'sunspot'

describe MatchingConfiguration do

  before :all do
    @match_config = {
      :case_fields=>{"activities"=>["activities_child_in_school_or_training", "activities_school_name"],
                     "basic_identity"=>["name", "name_nickname", "name_other", "sex", "age", "date_of_birth"],
                     "tracing"=>["date_of_separation", "separation_cause", "separation_cause_other"]},
      :tracing_request_fields=>{"tracing_request_subform_section"=> ["name", "relation", "name_nickname", "name_other",
                                                                     "sex", "age", "date_of_birth"]}
    }.with_indifferent_access
  end

  describe 'find matchable' do
    it 'should load matchable_fields in MatchingConfiguration' do
      match_config = MatchingConfiguration.find_for_filter(@match_config)
      expect(match_config.match_configuration[:case_fields]).to eq(@match_config[:case_fields])
      expect(match_config.match_configuration[:tracing_request_fields]).to eq(@match_config[:tracing_request_fields])
    end
  end

  describe '.load_fields_for_filter' do
    before :all do
      @matching_configurations = MatchingConfiguration.new(nil, @match_config)
      @matching_configurations.load_fields_for_filter
    end

    context 'when match_configuration' do
      it 'should load match_configuration parms' do
        expect(@matching_configurations.match_configuration[:case_fields]).to eq(@match_config[:case_fields])
        expect(@matching_configurations.match_configuration[:tracing_request_fields])
            .to eq(@match_config[:tracing_request_fields])
      end
    end

    context 'when fields' do
      it 'should load case and trace fields' do
        case_fields = @matching_configurations.case_fields.to_h.with_indifferent_access
        tracing_request_fields = @matching_configurations.tracing_request_fields.to_h.with_indifferent_access
        expect(case_fields[:activities]).to eq(@match_config[:case_fields][:activities])
        expect(tracing_request_fields[:tracing_request_subform_section])
            .to eq(@match_config[:tracing_request_fields][:tracing_request_subform_section])
      end
    end

    context 'when forms' do
      it 'should load case and trace forms' do
        expect(@matching_configurations.case_forms).to eq(@match_config[:case_fields].keys)
        expect(@matching_configurations.tracing_request_forms).to eq(@match_config[:tracing_request_fields].keys)
      end
    end
  end

  describe 'get_matchable_fields_by_parent_form' do
    before do
      [Field, FormSection].each(&:destroy_all)
      subform_fields = [
          Field.new({"name" => "field_name_1",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => Field::TEXT_FIELD,
                     "matchable" => true,
                     "display_name_all" => "Field name 1",
                    })
      ]
      @subform_section = FormSection.new({
        :visible=>false,
        :is_nested=>true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 1,
        :unique_id=>"subform_section_1",
        :parent_form=>"case",
        :editable=>true,
        :fields => subform_fields,
        :initial_subforms => 1,
        :name_all => "Nested Subform Section 1",
        :description_all => "Details Nested Subform Section 1"
     })
      @subform_section.save!

      fields = [
          Field.new({"name" => "field_name_3",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 3",
                     "matchable" => true
                    }),
          Field.new({"name" => "field_name_4",
                     "type" => "subform",
                     "editable" => true,
                     "subform_section_id" => @subform_section.id,
                     "display_name_all" => "Subform Section 1"
                    })
      ]
      @form_section = FormSection.new(
        :unique_id => "form_section_test_1",
        :parent_form=>"case",
        :visible => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        :form_group_id => "m",
        :editable => true,
        :name_all => "Form Section Test 1",
        :description_all => "Form Section Test 1",
        :fields => fields
      )
      @form_section.save!
    end

    context 'when subform' do
      it 'should get no matchable nested forms' do
        expect(MatchingConfiguration.matchable_fields_by_form('trace', true).count).to eq(0)
      end

      it 'should get all matchable forms' do
        expect(MatchingConfiguration.matchable_fields_by_form('case', true).count).to eq(1)
      end

      it 'should get all matchable fields' do
        forms = MatchingConfiguration.matchable_fields_by_form('case', true)
        expect(forms.first[1].count).to eq(1)
      end

      it 'should get no matchable fields' do
        @subform_section.delete_field('field_name_2')
        forms = MatchingConfiguration.matchable_fields_by_form('case', true)
        expect(forms).to be_empty
      end
    end

    context 'when form' do
      it 'should get no matchable forms' do
        expect(MatchingConfiguration.matchable_fields_by_form('trace', true).count).to eq(0)
      end

      it 'should get all matchable forms' do
        expect(MatchingConfiguration.matchable_fields_by_form('case', false).count).to eq(1)
      end

      it 'should get all matchable fields' do
        forms = MatchingConfiguration.matchable_fields_by_form('case', false)
        expect(forms.first[1].count).to eq(1)
      end

      it 'should get no matchable fields' do
        @form_section.delete_field('field_name_3')
        forms = MatchingConfiguration.matchable_fields_by_form('case', false)
        expect(forms).to be_empty
      end
    end
  end
end
