# frozen_string_literal: true

require 'rails_helper'

describe GenerateLocationFilesService do
  before :each do
    clean_data(Location)
  end

  let(:file) do
    GenerateLocationFilesService.generate
  end

  let(:json) do
    JSON.parse(File.read(file))
  end

  it 'generates a file' do
    expect(File.exist?(file)).to be_truthy
  end

  context 'no locations' do
    it 'contains an empty array' do
      expect(json).to eq([])
    end
  end

  context 'with locations' do
    before :each do
      Location.create!(
        placename_en: 'GHANA', location_code: 'GH', admin_level: 0,
        type: 'country', hierarchy_path: 'GH'
      )
    end

    it 'contains location JSON text' do
      expect(json.size).to eq(1)
      expect(json[0]['code']).to eq('GH')
    end
  end

  after :each do
    FileUtils.rm_f(file)
    clean_data(Location)
  end
end
