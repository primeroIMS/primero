# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Import do
  describe 'import locations' do
    before(:each) do
      clean_data(Location, SystemSettings)
      SystemSettings.create!
    end

    context 'when input contains valid rows' do
      before do
        importer = Importers::CsvHxlLocationImporter
        data_base64 = attachment_base64('hxl_location_sample.csv')
        @import = Import.new(importer:, data_base64:, content_type: nil, file_name: nil)
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
      clean_data(Location, SystemSettings)
    end
  end
end
