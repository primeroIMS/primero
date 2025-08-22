# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'
describe SystemSettings do
  before :each do
    clean_data(SystemSettings, Attachment, Child)
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

    context 'maximum_attachments_space' do
      it 'is valid when blank' do
        @system_settings.maximum_attachments_space = nil
        expect(@system_settings).to be_valid
      end

      it 'is valid when a positive integer' do
        @system_settings.maximum_attachments_space = 100
        expect(@system_settings).to be_valid
      end

      it 'is invalid when a non-integer' do
        @system_settings.maximum_attachments_space = 'abc'
        expect(@system_settings).not_to be_valid
        expect(@system_settings.errors[:maximum_attachments_space])
          .to include('errors.models.system_setting.allocated_space_integer')
      end

      it 'is invalid when zero or negative' do
        @system_settings.maximum_attachments_space = 0
        expect(@system_settings).not_to be_valid

        @system_settings.maximum_attachments_space = -5
        expect(@system_settings).not_to be_valid
      end
    end

    context 'maximum_attachments_space_warning' do
      it 'is valid when blank' do
        @system_settings.maximum_attachments_space_warning = nil
        expect(@system_settings).to be_valid
      end

      it 'is valid when a positive integer' do
        @system_settings.maximum_attachments_space_warning = 50
        expect(@system_settings).to be_valid
      end

      it 'is invalid when non-integer' do
        @system_settings.maximum_attachments_space_warning = 'oops'
        expect(@system_settings).not_to be_valid
        expect(@system_settings.errors[:maximum_attachments_space_warning])
          .to include('errors.models.system_setting.allocated_space_integer')
      end

      it 'is invalid when zero or negative' do
        @system_settings.maximum_attachments_space_warning = 0
        expect(@system_settings).not_to be_valid

        @system_settings.maximum_attachments_space_warning = -10
        expect(@system_settings).not_to be_valid
      end
    end

    context 'when both fields present' do
      it 'is valid if hard limit >= warning limit' do
        @system_settings.maximum_attachments_space = 200
        @system_settings.maximum_attachments_space_warning = 100
        expect(@system_settings).to be_valid
      end

      it 'is invalid if warning > hard limit' do
        @system_settings.maximum_attachments_space = 100
        @system_settings.maximum_attachments_space_warning = 200
        expect(@system_settings).not_to be_valid
        expect(@system_settings.errors[:base])
          .to include('errors.models.system_setting.allocated_space_warning_greater_than_hard_limit')
      end
    end

    describe '#total_attachment_file_size' do
      before do
        Rails.cache.clear
      end

      let(:user) { fake_user(user_name: 'test_user') }

      let(:child) do
        child = Child.new_with_user(user, name: 'Test')
        child.save! && child
      end

      it 'returns 0 when no attachments exist' do
        expect(@system_settings.total_attachment_file_size).to eq(0)
      end

      it 'sums byte_size of all attachments' do
        Attachment.new(
          record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
          file_name: 'logo.jpg', attachment: logo_base64
        ).attach!

        expect(SystemSettings.total_attachment_file_size).to eq(16_061)
      end
    end
  end
end
