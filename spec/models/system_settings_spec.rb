require 'rails_helper'
describe SystemSettings do
  before :each do
    @system_settings = SystemSettings.create(primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  describe 'Validation' do
    describe 'reporting locations' do
      context 'without a reporting location config or reporting locations' do
        it 'is valid' do
          expect(@system_settings).to be_valid
        end
      end

      context 'with reporting_locations' do
        context 'and one is PRIMARY' do
          before do
            reporting_location = ReportingLocation.new(field_key: 'test', type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
            @system_settings.reporting_locations = [reporting_location]
          end

          it 'is valid' do
            expect(@system_settings).to be_valid
          end
        end

        context 'and none are PRIMARY' do
          before do
            reporting_location = ReportingLocation.new(field_key: 'test', type: ReportingLocation::SECONDARY_REPORTING_LOCATION)
            @system_settings.reporting_locations = [reporting_location]
          end

          it 'is not valid' do
            expect(@system_settings).not_to be_valid
            expect(@system_settings.errors[:locales]).to include("Reporting Locations should have 1 Primary Reporting Location")
          end
        end

        context 'and multiple are PRIMARY' do
          before do
            reporting_location1 = ReportingLocation.new(field_key: 'test', type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
            reporting_location2 = ReportingLocation.new(field_key: 'test2', type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
            @system_settings.reporting_locations = [reporting_location1, reporting_location2]
          end

          it 'is not valid' do
            expect(@system_settings).not_to be_valid
            expect(@system_settings.errors[:locales]).to include("Reporting Locations should have only 1 Primary Reporting Location")
          end
        end
      end

      context 'with a reporting_location_config' do
        before do
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
    end

    context 'with a default_locale' do
      context 'and locale is English' do
        before do
          @system_settings.default_locale = Primero::Application::LOCALE_ENGLISH
        end

        it 'is valid' do
          expect(@system_settings).to be_valid
        end
      end

      context 'and locale is not English' do
        before do
          @system_settings.default_locale = Primero::Application::LOCALE_ARABIC
        end

        it 'is valid' do
          expect(@system_settings).to be_valid
        end
      end
    end

    context 'with locales' do
      context 'and English is one of the locales' do
        before do
          @system_settings.locales = [Primero::Application::LOCALE_ENGLISH, Primero::Application::LOCALE_ARABIC]
        end

        it 'is valid' do
          expect(@system_settings).to be_valid
        end
      end

      context 'and English is not one of the locales' do
        before do
          @system_settings.locales = [Primero::Application::LOCALE_FRENCH, Primero::Application::LOCALE_ARABIC]
        end

        it 'is not valid' do
          expect(@system_settings).not_to be_valid
          expect(@system_settings.errors[:locales]).to include("English must be available as a System Locale")
        end
      end
    end

    context 'without locales' do
      before do
        @system_settings.locales = []
      end

      #TODO - for now, empty locales is valid for backwards compatibility
      # If / when that changes, add back this test
      # it 'is not valid' do
      #   expect(@system_settings).not_to be_valid
      #   expect(@system_settings.errors[:locales]).to include("English must be available as a System Locale")
      # end

      it 'is valid' do
        expect(@system_settings).to be_valid
      end
    end
  end

  describe '#get_reporting_location' do
    context 'with reporting_locations' do
      context 'which contains only 1 Primary Reporting Location' do
        before do
          @primary_reporting_location = ReportingLocation.new(field_key: 'test_primary', label_key: 'district',
                                                              admin_level: 2, type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
          @system_settings.reporting_locations = [@primary_reporting_location]
        end

        context 'and no admin level is passed in' do
          it 'returns the Primary Reporting Location' do
            expect(@system_settings.get_reporting_location(nil)).to eq(@primary_reporting_location)
          end
        end

        context 'and admin level is passed in' do
          context 'which matches the admin level of the primary reporting location' do
            it 'returns the Primary Reporting Location' do
              expect(@system_settings.get_reporting_location(2)).to eq(@primary_reporting_location)
            end
          end

          context 'which does not match the admin level of the primary reporting location' do
            it 'returns nil' do
              expect(@system_settings.get_reporting_location(1)).to be_nil
            end
          end
        end
      end

      context 'which contains a Primary and a Secondary Reporting Location' do
        before do
          @primary_reporting_location = ReportingLocation.new(field_key: 'test_primary', label_key: 'district',
                                                              admin_level: 2, type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
          @secondary_reporting_location = ReportingLocation.new(field_key: 'test_secondary', label_key: 'governorate',
                                                                admin_level: 1, type: ReportingLocation::SECONDARY_REPORTING_LOCATION)
          @system_settings.reporting_locations = [@primary_reporting_location, @secondary_reporting_location]
        end

        context 'and no admin level is passed in' do
          it 'returns the Primary Reporting Location' do
            expect(@system_settings.get_reporting_location(nil)).to eq(@primary_reporting_location)
          end
        end

        context 'and admin level is passed in' do
          context 'which matches the admin level of the primary reporting location' do
            it 'returns the Primary Reporting Location' do
              expect(@system_settings.get_reporting_location(2)).to eq(@primary_reporting_location)
            end
          end

          context 'which matches the admin level of the secondary reporting location' do
            it 'returns the Secondary Reporting Location' do
              expect(@system_settings.get_reporting_location(1)).to eq(@secondary_reporting_location)
            end
          end

          context 'which does not match the admin level of either reporting location' do
            it 'returns nil' do
              expect(@system_settings.get_reporting_location(0)).to be_nil
            end
          end
        end
      end
    end

    context 'with reporting_location_config' do
      before do
        @config_reporting_location = ReportingLocation.new(field_key: 'test_reporting_location_config', label_key: 'district',
                                                           admin_level: 2)
        @system_settings.reporting_location_config = @config_reporting_location
      end

      context 'and reporting_locations' do
        before do
          @primary_reporting_location = ReportingLocation.new(field_key: 'test_primary', label_key: 'district',
                                                              admin_level: 2, type: ReportingLocation::PRIMARY_REPORTING_LOCATION)
          @system_settings.reporting_locations = [@primary_reporting_location]
        end

        it 'returns the Primary Reporting Location, not the config reporting location' do
          expect(@system_settings.get_reporting_location(nil)).to eq(@primary_reporting_location)
        end
      end

      context 'and no reporting_locations' do
        before do
          @system_settings.reporting_locations = []
        end

        it 'returns the the config reporting location' do
          expect(@system_settings.get_reporting_location(nil)).to eq(@config_reporting_location)
        end
      end
    end
  end

end