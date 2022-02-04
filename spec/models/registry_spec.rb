# frozen_string_literal: true

require 'rails_helper'

describe Registry do
  before do
    clean_data(Registry)
  end

  describe 'parent_form' do
    it 'returns registry' do
      expect(Registry.parent_form).to eq('registry')
    end
  end

  describe 'registry_types' do
    before do
      @default_registry_types = [Registry::REGISTRY_TYPE_FARMER, Registry::REGISTRY_TYPE_FOSTER_CARE,
                                 Registry::REGISTRY_TYPE_INDIVIDUAL]
    end
    context 'when there are no system_options in SystemSettings' do
      before do
        SystemSettings.stub(:current).and_return(
          SystemSettings.new(primary_age_range: 'primero')
        )
      end

      it 'returns default types from Registry' do
        expect(Registry.registry_types).to match_array(@default_registry_types)
      end
    end

    context 'when there are system_options in SystemSettings' do
      context 'and registry_types is blank' do
        before do
          SystemSettings.stub(:current).and_return(
            SystemSettings.new(primary_age_range: 'primero',
                               system_options: { show_alerts: true })
          )
        end

        it 'returns default types from Registry' do
          expect(Registry.registry_types).to match_array(@default_registry_types)
        end
      end

      context 'and registry_types is present' do
        before do
          @ss_registry_types = %w[teacher, girl, boy, dog]
          SystemSettings.stub(:current).and_return(
            SystemSettings.new(primary_age_range: 'primero',
                               system_options: { show_alerts: true,
                                                 registry_types: @ss_registry_types })
          )
        end

        it 'returns registry_types configured in SystemSettings' do
          expect(Registry.registry_types).to match_array(@ss_registry_types)
        end
      end
    end
  end

  after do
    clean_data(Registry)
  end
end