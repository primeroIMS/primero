# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe GenerateLocationFilesService do
  before :each do
    clean_data(Location, SystemSettings)
    SystemSettings.create!
    GenerateLocationFilesService.generate
  end

  let(:json) do
    JSON.parse(SystemSettings.current.location_file.download)
  end

  it 'generates a active storage file on SystemSettings' do
    expect(SystemSettings.current.location_file).to be_truthy
  end

  context 'no locations' do
    it 'contains an empty array' do

      expect(json).to eq('data' => [])
    end
  end

  context 'with locations' do
    before :each do
      Location.create!(
        placename_en: 'GHANA', location_code: 'GH', admin_level: 0,
        type: 'country', hierarchy_path: 'GH'
      )

      GenerateLocationFilesService.generate
    end

    it 'contains location JSON text' do
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['code']).to eq('GH')
    end
  end

  after :each do
    clean_data(Location, SystemSettings)
  end
end
