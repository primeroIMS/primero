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
          @data_io = attachment_as_io('hxl_location_sample.csv')
        end

        it 'imports locations' do
          importer = Importers::CsvHxlLocationImporter.new
          importer.import(@data_io)
          expect(importer.errors).to be_empty
          expect(importer.failures).to be_empty
          expect(importer.total).to eq(294)
          expect(importer.success_total).to eq(294)
          expect(importer.failure_total).to eq(0)
          expect(Location.count).to eq(414)
        end
      end

      context 'and file contains invalid rows' do
        before do
          @data_io = attachment_as_io('hxl_location_missing_pcodes.csv')
        end

        it 'logs errors for the invalid rows' do
          expected = ['Row 6 Not Processed: adm2+code blank', 'Row 11 Not Processed: adm1+code blank']
          importer = Importers::CsvHxlLocationImporter.new
          importer.import(@data_io)
          expect(importer.errors.size).to eq(2)
          expect(importer.errors).to match_array(expected)
          expect(Location.count).to eq(412)
        end
      end

      context 'and file contains invalid locales' do
        before do
          @data_io = attachment_as_io('hxl_location_invalid_locale.csv')
        end

        it 'logs errors for the invalid locales' do
          expected = ['Skipping #adm3+name+ar-XX: Locale invalid',
                      'Skipping #adm2+name+ar-XX: Locale invalid',
                      'Skipping #adm1+name+ar-XX: Locale invalid',
                      'Skipping #country+name+ar-XX: Locale invalid']
          importer = Importers::CsvHxlLocationImporter.new
          importer.import(@data_io)
          expect(importer.errors.size).to eq(4)
          expect(importer.errors).to match_array(expected)
          expect(Location.count).to eq(414)
        end
      end

      context 'and file is empty' do
        before do
          @data_io = attachment_as_io('hxl_location_empty.csv')
        end

        it 'returns an error' do
          importer = Importers::CsvHxlLocationImporter.new
          importer.import(@data_io)
          expect(importer.errors.size).to eq(1)
          expect(importer.errors.first).to eq('Import Not Processed: Error parsing CSV data')
        end
      end
    end

    context 'when input data is not passed in' do
      it 'returns an error' do
        importer = Importers::CsvHxlLocationImporter.new
        importer.import(nil)
        expect(importer.errors.size).to eq(1)
        expect(importer.errors.first).to eq('Import Not Processed: No data passed in')
      end
    end

    after do
      clean_data(Location)
    end
  end
end
