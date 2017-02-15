require 'spec_helper'
describe SystemSettings do
  before :each do
    @system_settings = SystemSettings.create(default_locale: "en",
      primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  describe 'Validation' do
    context 'with a reporting location' do
      before :each do
        @system_settings.reporting_location_config = ReportingLocation.new(field_key: 'test')
      end

      context 'which is valid' do
        before :each do
          @system_settings.reporting_location_config.label_key = 'district'
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