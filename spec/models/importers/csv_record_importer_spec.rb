# frozen_string_literal: true

require 'rails_helper'

module Importers
  describe CsvRecordImporter do
    before do
      clean_data(RegistryRecord, Agency, Role, User)
      role = Role.create!(
        name: 'Test Role 1',
        unique_id: 'test-role-1',
        permissions: [
          Permission.new(
            resource: Permission::REGISTRY_RECORD,
            actions: [Permission::MANAGE]
          )
        ]
      )
      @agency_a = Agency.create!(
        unique_id: 'agency_1',
        agency_code: 'agency1',
        order: 1,
        telephone: '12565742',
        logo_enabled: false,
        disabled: false,
        services: %w[services_a services_b],
        name_i18n: { en: 'Nationality', es: 'Nacionalidad' },
        description_i18n: { en: 'Nationality', es: 'Nacionalidad' }
      )
      @user_a = User.create!(
        full_name: 'Test User 1',
        user_name: 'test_user_1',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'test_user_1@localhost.com',
        agency_id: @agency_a.id,
        role: role
      )
      @user_b = User.create!(
        full_name: 'Test User 2',
        user_name: 'test_user_2',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'test_user_2@localhost.com',
        agency_id: @agency_a.id,
        role: role
      )
    end

    context 'when input file exists' do
      context 'and record type is RegistryRecord' do
        context 'and file contains valid rows' do
          before do
            @file_path = spec_resource_path('registry_sample.csv')
          end

          it 'imports registry records' do
            importer = Importers::CsvRecordImporter.new(record_class: RegistryRecord, file_path: @file_path,
                                                        created_by: @user_a.user_name, owned_by: @user_b.user_name)
            importer.import
            expect(importer.errors).to be_empty
            expect(importer.failures).to be_empty
            expect(importer.total).to eq(7)
            expect(importer.success_total).to eq(7)
            expect(importer.failure_total).to eq(0)
            expect(RegistryRecord.count).to eq(7)
          end
        end

        context 'and file contains some blank headers' do
          before do
            @file_path = spec_resource_path('registry_blanks.csv')
          end

          it 'imports registry records' do
            importer = Importers::CsvRecordImporter.new(record_class: RegistryRecord, file_path: @file_path,
                                                        created_by: @user_a.user_name, owned_by: @user_b.user_name)
            importer.import
            expect(importer.errors).to be_empty
            expect(importer.failures).to be_empty
            expect(importer.total).to eq(7)
            expect(importer.success_total).to eq(7)
            expect(importer.failure_total).to eq(0)
            expect(RegistryRecord.count).to eq(7)
          end
        end

        context 'and file is empty' do
          before do
            @file_path = spec_resource_path('registry_empty.csv')
          end

          it 'returns an error' do
            importer = Importers::CsvRecordImporter.new(record_class: RegistryRecord, file_path: @file_path,
                                                        created_by: @user_a.user_name, owned_by: @user_b.user_name)
            importer.import
            expect(importer.errors.size).to eq(1)
            expect(importer.errors.first).to eq('Import Not Processed: No data passed in')
          end
        end

        context 'and file does not exist' do
          before do
            @file_path = spec_resource_path('does_not_exist.csv')
          end

          it 'returns an error' do
            importer = Importers::CsvRecordImporter.new(record_class: RegistryRecord, file_path: @file_path,
                                                        created_by: @user_a.user_name, owned_by: @user_b.user_name)
            importer.import
            expect(importer.errors.size).to eq(1)
            expect(importer.errors.first).to eq('Import Not Processed: File does not exist')
          end
        end

        context 'and file name is blank' do
          before do
            @file_path = nil
          end

          it 'returns an error' do
            importer = Importers::CsvRecordImporter.new(record_class: RegistryRecord, file_path: @file_path,
                                                        created_by: @user_a.user_name, owned_by: @user_b.user_name)
            importer.import
            expect(importer.errors.size).to eq(1)
            expect(importer.errors.first).to eq('Import Not Processed: No data passed in')
          end
        end
      end

      # TODO: test other record types
    end

    after do
      clean_data(RegistryRecord, Agency, Role, User)
    end
  end
end
