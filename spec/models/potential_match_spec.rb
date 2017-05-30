require 'spec_helper'
require 'sunspot'

describe PotentialMatch do
  before do
    Role.all.each &:destroy
    User.all.each &:destroy
    Child.all.each &:destroy
    TracingRequest.all.each &:destroy
    PotentialMatch.all.each &:destroy


    permission_worker = Permission.new(resource: Permission::CASE, actions: [Permission::REASSIGN, Permission::READ, Permission::WRITE, Permission::CREATE])
    Role.create(id: 'worker', name: 'a_worker', permissions_list: [permission_worker], group_permission: Permission::GROUP)

    @user = User.create!(:user_name => 'worker_user', :role_ids => ['worker'], :module_ids => [PrimeroModule::CP],
                         :full_name => "A Worker User", :organization => "UNICEF",
                         :password => "Password0001", :password_confirmation => "Password0001")
    @tracing_request = TracingRequest.create(created_by: 'some_user', relation_name: 'some_relation_name',
                                             owned_by: @user.name, inquiry_date: '01-Mar-2017')
    @case = Child.create(created_by: 'some_user', age: 14, name: 'some_child_name', sex: 'female', owned_by: @user.name,
                         registration_date: "01-Feb-2017")
    @potential_match = PotentialMatch.create(tracing_request: @tracing_request, child: @case, average_rating: 4.321,
                                             tr_subform_id: 'abc123')
  end

  describe 'associated fields' do
    context 'when visible is true' do
      before do
        @potential_match.visible = true
      end

      it 'case_age returns the age from the associated case' do
        expect(@potential_match.case_age).to eq(14)
      end

      it 'case_registration_date returns the registration_date from the associated case' do
        expect(@potential_match.case_registration_date).to eq(@case.registration_date)
      end

      it 'case_owned_by returns the owned_by from the associated case' do
        expect(@potential_match.case_owned_by).to eq('worker_user')
      end

      it 'tracing_request_uuid returns the tracing_request_id' do
        expect(@potential_match.tracing_request_uuid).to eq(@tracing_request.id)
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

    context 'when visible is false' do
      before do
        @potential_match.visible = false
      end

      it 'case_age returns the field mask' do
        expect(@potential_match.case_age).to eq(PotentialMatch::FIELD_MASK)
      end

      it 'case_sex returns the field mask' do
        expect(@potential_match.case_sex).to eq(PotentialMatch::FIELD_MASK)
      end

      it 'case_registration_date returns the field mask' do
        expect(@potential_match.case_registration_date).to eq(PotentialMatch::FIELD_MASK)
      end

      it 'case_owned_by returns the owned_by from the associated case' do
        expect(@potential_match.case_owned_by).to eq('worker_user')
      end

      it 'tracing_request_uuid returns the tracing_request_id' do
        expect(@potential_match.tracing_request_uuid).to eq(@tracing_request.id)
      end

      it 'tracing_request_inquiry_date returns the field mask' do
        expect(@potential_match.tracing_request_inquiry_date).to eq(PotentialMatch::FIELD_MASK)
      end

      it 'tracing_request_relation_name returns the field mask' do
        expect(@potential_match.tracing_request_relation_name).to eq(PotentialMatch::FIELD_MASK)
      end

      it 'tracing_request_owned_by returns the owned_by from the associated tracing_request' do
        expect(@potential_match.tracing_request_owned_by).to eq('worker_user')
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
          expect(@potential_match.visible).to be_true
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@case.owned_by], @type)
          expect(@potential_match.visible).to be_true
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(['some_other_user', 'yet_another_user'], @type)
          expect(@potential_match.visible).to be_false
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
          expect(@potential_match.visible).to be_true
        end
      end

      context 'when associated_users is the same as owned by' do
        it 'sets visible to true' do
          @potential_match.set_visible([@tracing_request.owned_by], @type)
          expect(@potential_match.visible).to be_true
        end
      end

      context 'when associated_users is different than owned by' do
        it 'sets visible to false' do
          @potential_match.set_visible(['some_other_user', 'yet_another_user'], @type)
          expect(@potential_match.visible).to be_false
        end
      end
    end
  end

  describe 'group_match_records' do
    before do
      @potential_match_0_1 = PotentialMatch.create(tracing_request: @tracing_request, child: @case, average_rating: 2.321,
                                                   tr_subform_id: 'abc123')

      @potential_match_0_2 = PotentialMatch.create(tracing_request: @tracing_request, child: @case, average_rating: 1.321,
                                                   tr_subform_id: 'def456')

      @tracing_request_1 = TracingRequest.create(created_by: 'some_user', relation_name: 'some_relation_name',
                                               owned_by: @user.name, inquiry_date: '01-Mar-2017')
      @case_1 = Child.create(created_by: 'some_user', age: 14, name: 'some_child_name', sex: 'female', owned_by: @user.name,
                           registration_date: "01-Feb-2017")
      @potential_match_1_0 = PotentialMatch.create(tracing_request: @tracing_request_1, child: @case_1, average_rating: 9.321,
                                                   tr_subform_id: 'def456')
      @potential_match_1_1 = PotentialMatch.create(tracing_request: @tracing_request_1, child: @case_1, average_rating: 0.321,
                                                   tr_subform_id: 'def456')
      @potential_match_1_2 = PotentialMatch.create(tracing_request: @tracing_request_1, child: @case_1, average_rating: 0.333,
                                                   tr_subform_id: 'def456')

      @potential_match_1_3 = PotentialMatch.create(tracing_request: @tracing_request_1, child: @case_1, average_rating: 3.321,
                                                   tr_subform_id: 'ghi789')
      @potential_match_1_4 = PotentialMatch.create(tracing_request: @tracing_request_1, child: @case_1, average_rating: 0.321,
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
end