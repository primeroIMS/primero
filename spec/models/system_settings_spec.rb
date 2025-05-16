# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

    describe 'with maximum_users' do
      it 'is valid' do
        @system_settings.maximum_users = 50
        expect(@system_settings).to be_valid
      end

      context 'when maximum_users_warning is set' do
        context 'and maximum_users_warning is greater than maximum_users' do
          it 'is invalid' do
            @system_settings.maximum_users = 50
            @system_settings.maximum_users_warning = 55
            expect(@system_settings).to be_invalid
          end
        end

        context 'and maximum_users_warning is equal to maximum_users' do
          it 'is valid' do
            @system_settings.maximum_users = 57
            @system_settings.maximum_users_warning = 55
            expect(@system_settings).to be_valid
          end
        end

        context 'when maximum_users is not a string' do
          it 'is invalid' do
            @system_settings.maximum_users = '57'
            expect(@system_settings).to be_invalid
          end
        end
      end
    end

    context 'without maximum_users' do
      it 'is valid' do
        expect(@system_settings).to be_valid
      end
    end

    context '#maximum_attachments_per_record' do
      it 'when is not defined return default value' do
        expect(@system_settings.maximum_attachments_per_record).to eq(Attachment::DEFAULT_MAX_ATTACHMENTS)
      end
    end

    describe '#primero_promote_config' do
      context 'when primero_promote_config is not defined ' do
        it 'return default value' do
          expect(@system_settings.primero_promote_config).to match_array([])
        end
      end

      context 'when primero_promote_config is defined ' do
        it 'return value' do
          @system_settings.primero_promote_config = [
            {
              tls: 'true', host: 'foo.bar', port: '443', basic_auth_secret: 'PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH'
            }.with_indifferent_access
          ]
          @system_settings.save!

          expect(@system_settings.primero_promote_config.length).to eq(1)
          expect(@system_settings.primero_promote_config.first['host']).to eq('foo.bar')
        end
      end
    end

    describe 'incident_reporting_location_config' do
      it 'return default value' do
        expect(@system_settings.reporting_location_config).to be_present
      end
    end
  end
end
