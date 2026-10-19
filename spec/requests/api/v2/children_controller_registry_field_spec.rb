# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::ChildrenController, type: :request do
  before :each do
    clean_data(
      RegistryAssociation, Child, RegistryRecord, Field, FormSection
    )
  end

  let!(:form) do
    services = FormSection.create_or_update!(
      unique_id: 'services_section',
      name_all: 'Services',
      parent_form: 'case',
      fields: [
        Field.new(name: 'service_type', type: Field::TEXT_FIELD, display_name: 'Service Type'),
        Field.new(name: 'service_provider', type: Field::REGISTRY, display_name: 'Service Provider')
      ]
    )
    FormSection.create_or_update!(
      unique_id: 'registration',
      name_all: 'Registration',
      parent_form: 'case',
      fields: [
        Field.new(name: 'name', type: Field::TEXT_FIELD, display_name: 'Name'),
        Field.new(name: 'farm_cooperative', type: Field::REGISTRY, display_name: 'Farm Cooperative'),
        Field.new(name: 'services_section', type: Field::SUBFORM, display_name: 'Services', subform: services)
      ]
    )
  end
  let!(:case1) { Child.create!(name: 'Ric') }
  let!(:farm_cooperative) { RegistryRecord.create!(name: 'Farm Cooperative') }
  let!(:service_provider1) { RegistryRecord.create!(name: 'Service provider 1') }
  let!(:service_provider2) { RegistryRecord.create!(name: 'Service provider 2') }

  describe 'updating a registry type field on a record' do
    let(:params) do
      {
        data: {
          farm_cooperative: farm_cooperative.id,
          services_section: [
            {
              service_type: 'education', service_provider: service_provider1.id
            }
          ]
        }
      }
    end

    it 'updates a record with a registry association' do
      login_for_test(permitted_fields: FakeDeviseLogin::COMMON_PERMITTED_FIELDS + FakeDeviseLogin::SERVICE_FIELDS)
      patch "/api/v2/cases/#{case1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(case1.reload.registry_records.count).to eq(2)
      expect(case1.registry_records.map(&:id)).to include(farm_cooperative.id, service_provider1.id)
    end
  end
end
