# frozen_string_literal: true

require 'rails_helper'

module Importers
  describe CsvHxlLocationImporter do
    before(:each) do
      clean_data(Location)
    end

    context 'when input file exists' do
      context 'and file contains valid rows' do
        before do
          @import_file = spec_resource_path('hxl_location_sample.csv')&.to_s
        end

        it 'imports locations' do
          importer = Importers::CsvHxlLocationImporter.new(file_name: @import_file)
          importer.import
          expect(importer.errors).to be_empty
          expect(Location.count).to eq(414)
        end
      end

      context 'and file contains invalid rows' do
        before do
          @import_file = spec_resource_path('hxl_location_missing_pcodes.csv')&.to_s
        end

        it 'logs errors for the invalid rows' do
          expected = ["Row 6 Not Processed: adm2+code blank", "Row 11 Not Processed: adm1+code blank"]
          importer = Importers::CsvHxlLocationImporter.new(file_name: @import_file)
          importer.import
          expect(importer.errors.size).to eq(2)
          expect(importer.errors).to match_array(expected)
          expect(Location.count).to eq(412)
        end
      end

      context 'and file contains invalid locales' do
        before do
          @import_file = spec_resource_path('hxl_location_invalid_locale.csv')&.to_s
        end

        it 'logs errors for the invalid locales' do
          expected = ['Skipping #adm3+name+ar-XX: Locale invalid',
                      'Skipping #adm2+name+ar-XX: Locale invalid',
                      'Skipping #adm1+name+ar-XX: Locale invalid',
                      'Skipping #country+name+ar-XX: Locale invalid']
          importer = Importers::CsvHxlLocationImporter.new(file_name: @import_file)
          importer.import
          expect(importer.errors.size).to eq(4)
          expect(importer.errors).to match_array(expected)
          expect(Location.count).to eq(414)
        end
      end

      context 'and file is empty' do
        before do
          @import_file = spec_resource_path('hxl_location_empty.csv')&.to_s
        end

        it 'returns an error' do
          importer = Importers::CsvHxlLocationImporter.new(file_name: @import_file)
          importer.import
          expect(importer.errors.size).to eq(1)
          expect(importer.errors.first).to eq('Import not processed: No locations to create')
        end
      end
    end

    context 'when input file does not exist' do
      before do
        @import_file = spec_resource_path('file_does_not_exist.csv')
      end

      it 'returns an error' do
        importer = Importers::CsvHxlLocationImporter.new(file_name: @import_file)
        importer.import
        expect(importer.errors.size).to eq(1)
        expect(importer.errors.first).to eq("Import Not Processed: #{@import_file} does not exist")
      end
    end

    context 'when input file is not passed in' do
      it 'returns an error' do
        importer = Importers::CsvHxlLocationImporter.new()
        importer.import
        expect(importer.errors.size).to eq(1)
        expect(importer.errors.first).to eq('Import Not Processed: No file_name passed in')
      end
    end

    after do
      clean_data(Location)
    end
  end
end
