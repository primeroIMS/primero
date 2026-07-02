# frozen_string_literal: true

require 'rails_helper'

describe RegistryAssociable do
  describe 'Registry associations' do
    before(:each) { clean_data(RegistryAssociation, Child, RegistryRecord, Field, FormSection) }

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

    it 'creates a registry association for a top level field' do
      case1.data['farm_cooperative'] = farm_cooperative.id
      case1.save!

      expect(case1.registry_records.count).to eq(1)
      expect(case1.registry_records.first.id).to eq(farm_cooperative.id)
    end

    it 'creates registry associations for subform level fields' do
      case1.data['services_section'] = [
        { 'service_type' => 'education_service', 'service_provider' => service_provider1.id },
        { 'service_type' => 'education_service', 'service_provider' => service_provider2.id }
      ]
      case1.save!

      expect(case1.registry_records.count).to eq(2)
      expect(case1.registry_records.map(&:id)).to include(service_provider1.id, service_provider2.id)
    end

    it 'removes registry associations for top level fields' do
      case1.data['farm_cooperative'] = farm_cooperative.id
      case1.save!
      case1.data['farm_cooperative'] = nil
      case1.save!

      expect(case1.registry_records.count).to eq(0)
    end

    it 'removes registry associations for subform level fields on row delete' do
      case1.data['services_section'] = [
        { 'service_type' => 'education_service', 'service_provider' => service_provider1.id },
        { 'service_type' => 'education_service', 'service_provider' => service_provider2.id }
      ]
      case1.save!

      case1.data['services_section'].delete_if { |row| row['service_provider'] == service_provider2.id }
      case1.save!
      expect(case1.registry_records.count).to eq(1)
      expect(case1.registry_records.first.id).to eq(service_provider1.id)
    end

    it 'removes registry associations for subform level fields on clearing out the registry field' do
      case1.data['services_section'] = [
        { 'service_type' => 'education_service', 'service_provider' => service_provider1.id },
        { 'service_type' => 'education_service', 'service_provider' => service_provider2.id }
      ]
      case1.save!

      case1.data['services_section'] = [
        { 'service_type' => 'education_service', 'service_provider' => service_provider1.id },
        { 'service_type' => 'education_service', 'service_provider' => nil }
      ]
      case1.save!

      expect(case1.registry_records.count).to eq(1)
      expect(case1.registry_records.first.id).to eq(service_provider1.id)
    end

    it "doesn't creates a registry association if the field is not defined" do
      clean_data(Field, FormSection)
      case1.data['farm_cooperative'] = farm_cooperative.id
      case1.save!

      expect(case1.registry_records.count).to eq(0)
    end
  end
end
