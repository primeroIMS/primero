# frozen_string_literal: true

require 'rails_helper'
describe SystemSettings do
  before :each do
    @system_settings = SystemSettings.create(primary_age_range: 'primary',
                                             age_ranges: { 'primary' => [1..2, 3..4] },
                                             reporting_location_config: { field_key: 'owned_by_location',
                                                                          admin_level: 2,
                                                                          admin_level_map: { '1' => ['region'],
                                                                                             '2' => ['district'] } })
  end

  describe 'Validation' do
    context 'with a reporting location' do
      before :each do
        @system_settings.reporting_location_config = ReportingLocation.new(field_key: 'test')
      end

      context 'which is valid' do
        before :each do
          @system_settings.reporting_location_config.admin_level = 2
        end

        it 'is valid' do
          expect(@system_settings).to be_valid
        end
      end
    end

    context 'without a reporting location' do
      it 'is valid' do
        expect(@system_settings).to be_valid
      end
    end
  end
end
