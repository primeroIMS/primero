# frozen_string_literal: true

require 'rails_helper'

describe IncidentCreationService do
  before(:each) { clean_data(Child, PrimeroModule) }
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
  let(:case_cp) do
    Child.create!(
      name: 'Niall McPherson', age: 12, sex: 'male',
      protection_concerns: %w[unaccompanied separated], ethnicity: 'other',
      module_id: 'primeromodule-cp'
    )
  end
  let(:case_gbv) do
    Child.create!(
      name: 'Niall McPherson', age: 12, sex: 'male',
      survivor_code_no: 'abc123',
      module_id: 'primeromodule-gbv'
    )
  end

  describe 'incident_from_case' do
    it 'instantiates a new incident based on the mapping when the module id is specified' do
      incident = IncidentCreationService.incident_from_case(case_cp, {}, module_cp.unique_id)
      expect(incident.data['ethnicity']).to eq(case_cp.ethnicity)
      expect(incident.data['protection_concerns']).to eq(case_cp.protection_concerns)
      expect(incident.data['sex']).to be_nil
      expect(incident.module_id).to eq(module_cp.unique_id)
    end

    it 'instantiates a new incident based on the mapping from the module of the case if a module is not specified' do
      incident = IncidentCreationService.incident_from_case(case_cp, {}, module_cp.unique_id)
      expect(incident.data['ethnicity']).to eq(case_cp.ethnicity)
      expect(incident.data['protection_concerns']).to eq(case_cp.protection_concerns)
      expect(incident.data['sex']).to be_nil
      expect(incident.module_id).to eq(module_cp.unique_id)
    end

    it 'instantiates a new incident based on the default mapping with the mapping is not specified on the module' do
      incident = IncidentCreationService.incident_from_case(case_gbv, {}, module_gbv.unique_id)
      expect(incident.data['sex']).to eq(case_gbv.sex)
      expect(incident.data['survivor_code']).to eq(case_gbv.survivor_code_no)
      expect(incident.module_id).to eq(module_gbv.unique_id)
    end
  end
end
