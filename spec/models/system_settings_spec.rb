require 'rails_helper'
describe SystemSettings do
  before :each do
    @system_settings = SystemSettings.create(primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
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
          expect(@system_settings.errors[:locales]).to include("errors.models.system_settings.locales")
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

end
