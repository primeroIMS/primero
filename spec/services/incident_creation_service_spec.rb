# frozen_string_literal: true

require 'rails_helper'

describe IncidentCreationService do
  before(:each) { clean_data(Child, Incident, PrimeroModule, User, Role) }
  let(:module_cp) do
    module_cp = PrimeroModule.new(
      unique_id: 'primeromodule-cp',
      field_map: {
        map_to: 'primeromodule-cp',
        fields: [
          { source: 'ethnicity', target: 'ethnicity' },
          { source: 'protection_concerns', target: 'protection_concerns' }
        ]
      }
    )
    module_cp.save(validate: false) && module_cp
  end
  let(:module_gbv) do
    module_gbv = PrimeroModule.new(unique_id: 'primeromodule-gbv')
    module_gbv.save(validate: false) && module_gbv
  end
  let(:role) do
    permissions = Permission.new(
      resource: Permission::CASE,
      actions: [
        Permission::READ, Permission::WRITE,
        Permission::CREATE, Permission::EXPORT_CSV
      ]
    )
    role = Role.new(permissions: [permissions])
    role.save(validate: false) && role
  end
  let(:user_cp) do
    user = User.new(user_name: 'user_cp', full_name: 'Test User CP', role: role)
    user.save(validate: false) && user
  end
  let(:user_gbv) do
    user = User.new(user_name: 'user_gbv', full_name: 'Test User GBV', role: role)
    user.save(validate: false) && user
  end
  let(:case_cp) do
    Child.create!(
      name: 'Niall McPherson', age: 12, sex: 'male',
      protection_concerns: %w[unaccompanied separated], ethnicity: 'CP Ethnicity',
      module_id: 'primeromodule-cp', owned_by: user_cp.user_name, owned_by_full_name: user_cp.full_name
    )
  end
  let(:case_gbv) do
    Child.create!(
      name: 'Niall McPherson', age: 12, sex: 'male',
      survivor_code_no: 'abc123', ethnicity: 'GBV Ethnicity',
      module_id: 'primeromodule-gbv', owned_by: user_gbv.user_name, owned_by_full_name: user_gbv.full_name
    )
  end

  describe 'incident_from_case' do
    context 'when the module id is specified' do
      context 'and the module has a form mapping' do
        before do
          @incident = IncidentCreationService.incident_from_case(case_cp, {}, module_cp.unique_id)
          @incident.save!
        end

        it 'copies fields specified in the mapping from the case to the new incident' do
          expect(@incident.data['ethnicity']).to eq(case_cp.ethnicity)
          expect(@incident.data['protection_concerns']).to eq(case_cp.protection_concerns)
        end

        it 'does not copy not specified in the mapping from the case to the new incident' do
          expect(@incident.data['sex']).to be_nil
        end

        it 'copies module id from the case to the new incident' do
          expect(@incident.module_id).to eq(module_cp.unique_id)
        end

        it 'copies ownership from the case to the new incident' do
          expect(@incident.data['owned_by']).to eq('user_cp')
          expect(@incident.data['owned_by_full_name']).to eq('Test User CP')
        end
      end

      context 'and the module does not have a form mapping' do
        before do
          @incident = IncidentCreationService.incident_from_case(case_gbv, {}, module_gbv.unique_id)
          @incident.save!
        end

        it 'copies fields specified in the default mapping from the case to the new incident' do
          expect(@incident.data['survivor_code']).to eq(case_gbv.survivor_code_no)
          expect(@incident.data['sex']).to eq(case_gbv.sex)
          expect(@incident.data['age']).to eq(case_gbv.age)
        end

        it 'does not copy fields not specified in the default mapping from the case to the new incident' do
          expect(@incident.data['ethnicity']).to be_nil
        end

        it 'copies module_id from the case to the new incident' do
          expect(@incident.module_id).to eq(module_gbv.unique_id)
        end

        it 'copies ownership from the case to the new incident' do
          expect(@incident.data['owned_by']).to eq('user_gbv')
          expect(@incident.data['owned_by_full_name']).to eq('Test User GBV')
        end
      end
    end

    context 'when the module id is not specified' do
      context 'and the case module has a form mapping' do
        before do
          primero_module = module_cp # To trigger the let() above
          @incident = IncidentCreationService.incident_from_case(case_cp, {})
          @incident.save!
        end

        it 'copies fields specified in the mapping from the case to the new incident' do
          expect(@incident.data['ethnicity']).to eq(case_cp.ethnicity)
          expect(@incident.data['protection_concerns']).to eq(case_cp.protection_concerns)
        end

        it 'does not copy not specified in the mapping from the case to the new incident' do
          expect(@incident.data['sex']).to be_nil
        end

        it 'copies module id from the case to the new incident' do
          expect(@incident.module_id).to eq(module_cp.unique_id)
        end

        it 'copies ownership from the case to the new incident' do
          expect(@incident.data['owned_by']).to eq('user_cp')
          expect(@incident.data['owned_by_full_name']).to eq('Test User CP')
        end
      end

      context 'and the case module does not have a form mapping' do
        before do
          primero_module = module_gbv # To trigger the let() above
          @incident = IncidentCreationService.incident_from_case(case_gbv, {})
          @incident.save!
        end

        it 'copies fields specified in the default mapping from the case to the new incident' do
          expect(@incident.data['survivor_code']).to eq(case_gbv.survivor_code_no)
          expect(@incident.data['sex']).to eq(case_gbv.sex)
          expect(@incident.data['age']).to eq(case_gbv.age)
        end

        it 'does not copy fields not specified in the default mapping from the case to the new incident' do
          expect(@incident.data['ethnicity']).to be_nil
        end

        it 'copies module_id from the case to the new incident' do
          expect(@incident.module_id).to eq(module_gbv.unique_id)
        end

        it 'copies ownership from the case to the new incident' do
          expect(@incident.data['owned_by']).to eq('user_gbv')
          expect(@incident.data['owned_by_full_name']).to eq('Test User GBV')
        end
      end
    end
  end

  after { clean_data(Child, Incident, PrimeroModule, User, Role) }
end
