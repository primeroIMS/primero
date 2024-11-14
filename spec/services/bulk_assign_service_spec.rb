# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe BulkAssignService do
  before do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Incident, Child, Transition
    )
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(:user, user_name: 'user', role:, full_name: 'Test User 1', email: 'owner@primero.dev')
  end

  let(:user2) do
    create(:user, user_name: 'user2', role:, full_name: 'Test User 2', email: 'user2@primero.dev')
  end

  let!(:child) do
    create(:child, name: 'Test', sex: 'female', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let!(:child2) do
    create(:child, name: 'Test2', sex: 'male', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let!(:child3) do
    create(:child, name: 'Test2', sex: 'female', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let!(:incident) do
    create(:incident, owned_by: user.user_name, unique_id: '1a2b3c', incident_code: '987654',
                      description: 'this is a test', module_id: PrimeroModule::CP)
  end

  let!(:incident2) do
    create(:incident, owned_by: user.user_name, unique_id: '5b2a35', incident_code: '112233',
                      description: 'this is a test', module_id: PrimeroModule::CP,
                      incident_case_id: child.id)
  end

  let!(:incident3) do
    create(:incident, owned_by: user.user_name, unique_id: '8a2f3a', incident_code: '445566',
                      description: 'this is a test', module_id: PrimeroModule::CP)
  end

  describe '#assign_records!' do
    let(:bulk_assign_shared_params) do
      {
        transitioned_to: user2.user_name,
        transitioned_by: user.user_name,
        notes: 'this is a note',
        from_bulk_export: true
      }
    end

    context 'when model_class is Child' do
      context 'when filter by id' do
        let(:bulk_assign_params) do
          {
            filters: { 'id' => [child.id, child2.id, child3.id] }
          }.merge(bulk_assign_shared_params)
        end

        it 'creates an Transition record' do
          BulkAssignService.new(Child, user, **bulk_assign_params).assign_records!
          expect(Assign.count).to eq(3)
          assigns = Transition.all
          expect(assigns.pluck(:type).uniq).to eq(['Assign'])
          expect(assigns.pluck(:record_id)).to match_array([child.id, child2.id, child3.id])
        end

        context 'when there is a problem at least one of the record' do
          it 'inserts records and handles failures' do
            expect(Assign).to receive(:create!).with({ record: child }.merge(bulk_assign_shared_params))

            expect(Assign).to receive(:create!).with(
              { record: child2 }.merge(bulk_assign_shared_params)
            ).and_raise(StandardError)

            expect(Assign).to receive(:create!).with({ record: child3 }.merge(bulk_assign_shared_params))

            expect(Rails.logger).to receive(:error).with(/StandardError/).once

            BulkAssignService.new(Child, user, **bulk_assign_params).assign_records!
          end
        end
      end

      context 'when filter by sex' do
        let(:bulk_assign_params) do
          {
            filters: { 'sex' => 'female' }
          }.merge(bulk_assign_shared_params)
        end

        it 'creates an Transition record' do
          BulkAssignService.new(Child, user, **bulk_assign_params).assign_records!
          expect(Assign.count).to eq(2)
          assigns = Transition.all
          expect(assigns.pluck(:type).uniq).to eq(['Assign'])
          expect(assigns.pluck(:record_id)).to match_array([child.id, child3.id])
        end
      end
    end

    context 'when model_class is Incident' do
      let(:bulk_assign_params) do
        {
          filters: { 'id' => [incident.id, incident2.id, incident3.id] }
        }.merge(bulk_assign_shared_params)
      end

      it 'creates an Transition record' do
        BulkAssignService.new(Incident, user, **bulk_assign_params).assign_records!
        expect(Assign.count).to eq(2)
        expect(Assign.pluck(:record_id)).to match_array([incident.id, incident3.id])
      end
    end
  end

  after :each do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Incident, Child, Transition
    )
  end
end
