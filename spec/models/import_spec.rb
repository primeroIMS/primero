# frozen_string_literal: true

require 'rails_helper'

describe Import do
  describe 'import locations' do
    before(:each) do
      clean_data(Location)
    end

    context 'when input contains valid rows' do
      before do
        importer = Importers::CsvHxlLocationImporter
        data_base64 = attachment_base64('hxl_location_sample.csv')
        @import = Import.new(importer: importer, data_base64: data_base64, content_type: nil, file_name: nil)
      end

      it 'imports locations' do
        @import.run
        expect(@import.failures).to be_empty
        expect(@import.total).to eq(294)
        expect(@import.success_total).to eq(294)
        expect(@import.failure_total).to eq(0)
        expect(Location.count).to eq(414)
      end
    end

    after do
      clean_data(Location)
    end
  end
end
