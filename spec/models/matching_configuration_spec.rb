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
end