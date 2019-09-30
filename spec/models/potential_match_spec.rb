require 'rails_helper'
require 'sunspot'

describe PotentialMatch do
  before do
    Role.all.each &:destroy
    User.all.each &:destroy
    Child.all.each &:destroy
    TracingRequest.all.each &:destroy
    PotentialMatch.all.each &:destroy


    permission_worker = Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN, Permission::READ, Permission::WRITE, Permission::CREATE])
    Role.create(id: 'worker', name: 'a_worker', permissions: [permission_worker], group_permission: Permission::GROUP)

    @user = User.create!(:user_name => 'worker_user', :role_ids => ['worker'], :module_ids => [PrimeroModule::CP],
                         :full_name => "A Worker User", :organization => "UNICEF",
                         :password => "Password0001", :password_confirmation => "Password0001")
    @tracing_request = TracingRequest.create(created_by: 'some_user', relation_name: 'some_relation_name',
                                             owned_by: @user.name, inquiry_date: '01-Mar-2017')
    @case = Child.create(created_by: 'some_user', age: 14, name: 'some_child_name', sex: 'female', owned_by: @user.name,
                         registration_date: "01-Feb-2017")
    @potential_match = PotentialMatch.create(tracing_request_id: @tracing_request.id, child_id: @case.id, average_rating: 4.321,
                                             tr_subform_id: 'abc123')
  end

  describe 'associated fields' do
    context 'when visible is true' do
      before do
        @potential_match.visible = true
      end

      it 'case_age returns the age from the associated case' do
        expect(@potential_match.child_age).to eq(14)
      end

      it 'case_registration_date returns the registration_date from the associated case' do
        expect(@potential_match.case_registration_date).to eq(@case.registration_date)
      end

      it 'case_owned_by returns the owned_by from the associated case' do
        expect(@potential_match.case_owned_by).to eq('worker_user')
      end

      it 'tracing_request_uuid returns the tracing_request_id' do
        expect(@potential_match.tracing_request_id).to eq(@tracing_request.id)
      end

      it 'tracing_request_inquiry_date returns the inquiry_date from the associated tracing_request' do
        expect(@potential_match.tracing_request_inquiry_date).to eq(@tracing_request.inquiry_date)
      end

      it 'tracing_request_relation_name returns the relation_name from the associated tracing_request' do
        expect(@potential_match.tracing_request_relation_name).to eq('some_relation_name')
      end

      it 'tracing_request_owned_by returns the owned_by from the associated tracing_request' do
        expect(@potential_match.tracing_request_owned_by).to eq('worker_user')
      end
    end
  end

  describe 'comparison' do
    describe '.compare_values' do
      before do
        @potential_match = PotentialMatch.new
      end

      context 'when the values are present and equal' do
        it 'returns a match' do
          expect(@potential_match.compare_values('male', 'male')).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns a match with multi-selected values' do
          expect(@potential_match.compare_values(['eth1', 'eth2'], ['eth2', 'eth1'])).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns a match with only one multi-selected value' do
          expect(@potential_match.compare_values('eth3', ['eth3'])).to eq(PotentialMatch::VALUE_MATCH)
        end

        it 'returns match with non-string values' do
          expect(@potential_match.compare_values(20, 20)).to eq(PotentialMatch::VALUE_MATCH)
        end
      end

      context 'when at least one value is present and the values are not equal' do
        it 'returns a mismatch' do
          expect(@potential_match.compare_values('female', 'male')).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns a mismatch with un-identical multi-selected values' do
          expect(@potential_match.compare_values(['female', 'child'], ['male', 'adult'])).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns a mismatch with multi-selected values' do
          expect(@potential_match.compare_values(['eth1', 'eth2'], ['eth1', 'eht2', 'eth3'])).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns mismatch with either value is empty or null' do
          expect(@potential_match.compare_values('south', '')).to eq(PotentialMatch::VALUE_MISMATCH)
        end

        it 'returns mismatch with non-string values' do
          expect(@potential_match.compare_values(20, 10)).to eq(PotentialMatch::VALUE_MISMATCH)
        end
      end

      context 'when values are not present' do
        it 'returns false with null values' do
          expect(@potential_match.compare_values(nil, nil)).to be_falsy
        end

        it 'returns false with empty values' do
          expect(@potential_match.compare_values('', '')).to be_falsy
        end
      end
    end

    describe '.case_fields_for_comparison' do
      before do
        FormSection.all.each &:destroy
        @form_section = create(:form_section,
          is_first_tab: true,
          fields: [
            build(:field, name: "sex", display_name: "Sex", type: Field::SELECT_BOX, option_strings_source: "lookup lookup-gender", create_property: false, matchable: true),
            build(:field, name: "age", display_name: "Age", type: Field::NUMERIC_FIELD, create_property: false, matchable: true),
            build(:field, name: "name", display_name: "Service Due Dates", type: Field::TEXT_FIELD, create_property: false, matchable: true),
            build(:field, name: 'comments', type: Field::TEXT_AREA, display_name: 'Comments', create_property: false, matchable: true),
            build(:field, name: 'sex_of_caregiver', display_name: "Sex", type: Field::SELECT_BOX, option_strings_source: "lookup lookup-gender", create_property: false, matchable: false)
          ]
        )
      end

      it 'returns non-text matchable fields' do
        field_names = PotentialMatch.case_fields_for_comparison.map(&:name)
        expect(field_names).to contain_exactly('sex', 'age')
      end
    end

    describe '.compare_case_to_trace' do
      before do
        FormSection.all.each &:destroy
        subform_fields = [
          Field.new({"name" => "sex",
                     "type" => Field::SELECT_BOX,
                     "matchable" => true,
                     "display_name_all" => "Sex",
                     option_strings_source: "lookup lookup-gender"
                    }),
          Field.new({"name" => "age",
                     "type" => Field::NUMERIC_FIELD,
                     "matchable" => true,
                     "display_name_all" => "Age",
                    })
        ]
        @subform_section = FormSection.new({
                                             "is_nested"=>true,
                                             :unique_id=>"subform_section_1",
                                             :parent_form=>"case",
                                             "editable"=>true,
                                             :fields => subform_fields,
                                             "name_all" => "Nested Subform Section 1",
                                           })
        @subform_section.save!

        fields = [
          Field.new({"name" => "name",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Name",
                     "matchable" => true
          }),
          Field.new({"name" => "sex",
                     "type" => Field::SELECT_BOX,
                     "matchable" => true,
                     "display_name_all" => "Sex",
                     option_strings_source: "lookup lookup-gender"
                    }),
          Field.new({"name" => "age",
                     "type" => Field::NUMERIC_FIELD,
                     "matchable" => true,
                     "display_name_all" => "Age",
                    }),
          Field.new({"name" => "subform_section_1",
                     "type" => "subform",
                     "editable" => true,
                     "subform_section_id" => @subform_section.unique_id,
                     "display_name_all" => "Subform Section 1"
                    })
        ]
        @form_section = FormSection.new(
          :unique_id => "form_section_test_1",
          :parent_form=>"case",
          "name_all" => "Form Section Test 1",
          :fields => fields
        )
        @form_section.save!
        Child.any_instance.stub(:field_definitions).and_return(fields)
        Child.refresh_form_properties

        @child = Child.new(name: 'temp', sex: 'male', age: 12, subform_section_1: [{sex: 'male', age: 12}])
        @trace = build(:child, age: 12, sex: 'female') #Cheating a bit!
        @potentail_match = PotentialMatch.new
        @potential_match.stub(:child).and_return(@child)
        @potential_match.stub(:trace).and_return(@trace)
      end

      after :all do
        FormSection.all.each &:destroy
        Child.all.each &:destroy
      end

      it 'returns comparison hash for case' do
        case_comparison = @potential_match.compare_case_to_trace[:case].first
        expect(case_comparison[:form_name]).to eq(@form_section.name)
        sex_comparison = case_comparison[:case_values].select{|c| c[:case_field].name == 'sex'}.first
        age_comparison = case_comparison[:case_values].select{|c| c[:case_field].name == 'age'}.first
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end

      it 'returns comparison hash for case_subform' do
        case_comparison = @potential_match.compare_case_to_trace[:case_subform].first
        expect(case_comparison[:form_name]).to eq(@subform_section.name)
        sex_comparison = case_comparison[:case_values].select{|c| c[:case_field].name == 'sex'}.first
        age_comparison = case_comparison[:case_values].select{|c| c[:case_field].name == 'age'}.first
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end

    end

    describe '.compare_names' do
      before do
        @child = build(:child, age: 12, sex: 'male', name: 'Test User', name_other: 'Someone', name_nickname: 'Nicky')
        @trace = build(:child, age: 12, sex: 'female', name: 'Tester', name_nickname: 'Nicks')
        @potentail_match = PotentialMatch.new
        @potential_match.stub(:child).and_return(@child)
        @potential_match.stub(:trace).and_return(@trace)
      end

      it 'returns comparable name fields for case and trace' do
        comparable_names = @potential_match.compare_names
        expect(comparable_names.length).to eq 3
        expect(PotentialMatch.comparable_name_fields).to include(comparable_names.first[:field])
        expect(PotentialMatch.comparable_name_fields).to include(comparable_names.last[:field])
        expect(comparable_names.first[:child_name]).to eq 'Test User'
        expect(comparable_names.first[:trace_name]).to eq 'Tester'
        expect(comparable_names[1][:trace_name]).to eq '-'
      end
    end

    describe '.case_to_trace_values' do
      before do
        @sex = Field.new({name: 'sex'})
        @age = Field.new({name: 'age'})
        @child = build(:child, age: 12, sex: 'male')
        @trace = build(:child, age: 12, sex: 'female')
        @potentail_match = PotentialMatch.new
        @potential_match.stub(:child).and_return(@child)
        @potential_match.stub(:trace).and_return(@trace)
      end

      it 'returns comparable hash of fields for case and trace' do
        sex_comparison = @potential_match.case_to_trace_values(@sex, @child)
        age_comparison = @potential_match.case_to_trace_values(@age, @child)
        expect(age_comparison[:case_value]).to eq(@child.age)
        expect(age_comparison[:trace_value]).to eq(@trace.age)
        expect(sex_comparison[:case_value]).to eq(@child.sex)
        expect(sex_comparison[:trace_value]).to eq(@trace.sex)
        expect(age_comparison[:matches]).to eq(PotentialMatch::VALUE_MATCH)
        expect(sex_comparison[:matches]).to eq(PotentialMatch::VALUE_MISMATCH)
      end
    end
  end

  describe 'set_visible' do
    context 'when type is case' do
      before do
        @type = 'case'
      end

      context 'when all is passed in for associated_users' do
        it 'sets visible to true' do
          @potential_match.set_visible(['all'], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@case.owned_by], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(['some_other_user', 'yet_another_user'], @type)
          expect(@potential_match.visible).to be_falsey
        end
      end
    end

    context 'when type is tracing_request' do
      before do
        @type = 'tracing_request'
      end

      context 'when all is passed in for associated_users' do
        it 'sets visible to true' do
          @potential_match.set_visible(['all'], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@tracing_request.owned_by], @type)
          expect(@potential_match.visible).to be_truthy
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(['some_other_user', 'yet_another_user'], @type)
          expect(@potential_match.visible).to be_falsey
        end
      end
    end
  end

  describe 'group_match_records' do
    before do
      @potential_match_0_1 = PotentialMatch.create(tracing_request_id: @tracing_request.id, child_id: @case.id, average_rating: 2.321,
                                                   tr_subform_id: 'abc123')

      @potential_match_0_2 = PotentialMatch.create(tracing_request_id: @tracing_request.id, child_id: @case.id, average_rating: 1.321,
                                                   tr_subform_id: 'def456')

      @tracing_request_1 = TracingRequest.create(created_by: 'some_user', relation_name: 'some_relation_name',
                                               owned_by: @user.name, inquiry_date: '01-Mar-2017')
      @case_1 = Child.create(created_by: 'some_user', age: 14, name: 'some_child_name', sex: 'female', owned_by: @user.name,
                           registration_date: "01-Feb-2017")
      @potential_match_1_0 = PotentialMatch.create(tracing_request_id: @tracing_request_1.id, child_id: @case_1.id, average_rating: 9.321,
                                                   tr_subform_id: 'def456')
      @potential_match_1_1 = PotentialMatch.create(tracing_request_id: @tracing_request_1.id, child_id: @case_1.id, average_rating: 0.321,
                                                   tr_subform_id: 'def456')
      @potential_match_1_2 = PotentialMatch.create(tracing_request_id: @tracing_request_1.id, child_id: @case_1.id, average_rating: 0.333,
                                                   tr_subform_id: 'def456')

      @potential_match_1_3 = PotentialMatch.create(tracing_request_id: @tracing_request_1.id, child_id: @case_1.id, average_rating: 3.321,
                                                   tr_subform_id: 'ghi789')
      @potential_match_1_4 = PotentialMatch.create(tracing_request_id: @tracing_request_1.id, child_id: @case_1.id, average_rating: 0.321,
                                                   tr_subform_id: 'ghi789')

      @potential_matches = [@potential_match, @potential_match_1_0, @potential_match_0_2, @potential_match_0_1,
                            @potential_match_1_3, @potential_match_1_1, @potential_match_1_2, @potential_match_1_4]
    end

    context 'when type is case' do
      before do
        @type = 'case'
      end

      it 'returns a list grouped by child ids and sorted by average rating' do
        expected = [
            [@case_1.id,
             [@potential_match_1_0, @potential_match_1_3, @potential_match_1_1, @potential_match_1_2, @potential_match_1_4]],
            [@case.id,
             [@potential_match, @potential_match_0_2, @potential_match_0_1]]
        ]
        expect(PotentialMatch.group_match_records(@potential_matches, @type)).to eq(expected)
      end
    end

    context 'when type is tracing_request' do
      before do
        @type = 'tracing_request'
      end

      it 'returns a list grouped by tracing request ids and sorted by average rating' do
        expected = [
            [[@tracing_request_1.id, 'def456'],
             [@potential_match_1_0, @potential_match_1_1, @potential_match_1_2]],
            [[@tracing_request.id, 'abc123'],
             [@potential_match, @potential_match_0_1]],
            [[@tracing_request_1.id, 'ghi789'],
             [@potential_match_1_3, @potential_match_1_4]],
            [[@tracing_request.id, 'def456'],
             [@potential_match_0_2]]
        ]
        expect(PotentialMatch.group_match_records(@potential_matches, @type)).to eq(expected)
      end
    end
  end

  describe 'likelihood' do
    before do
      @potential_match = PotentialMatch.new(average_rating: 0.9)
    end

    it 'marks a potential match as "likely" if it is more than 0.7 away from the average' do
      @potential_match.set_likelihood(@potential_match.average_rating, 0.15)
      expect(@potential_match.likelihood).to eq(PotentialMatch::LIKELY)
    end

    it 'marks a potential match as "possible" if it is less than 0.7 away from the average' do
      @potential_match.set_likelihood(@potential_match.average_rating, 0.7)
      expect(@potential_match.likelihood).to eq(PotentialMatch::POSSIBLE)
    end

  end
end
