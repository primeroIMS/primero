# frozen_string_literal: true

require 'rails_helper'

describe InsertAllService do
  let(:locations) do
    [
      {
        'location_code' => 'XX', 'type' => 'country', 'admin_level' => 0,
        'name_i18n' => { 'en' => 'Country 1' }
      },
      {
        'location_code' => 'XX01', 'type' => 'province', 'admin_level' => 1,
        'name_i18n' => { 'en' => 'Country 1::Province 1' }
      },
      {
        'location_code' => 'XX0101', 'type' => 'district', 'admin_level' => 2,
        'name_i18n' => { 'en' => 'Country 1::Province 1::District 1' }
      },
      {
        'location_code' => 'XX0102', 'type' => 'district', 'admin_level' => 2,
        'name_i18n' => { 'en' => 'Country 1::Province 1::District 2' }
      }
    ]
  end

  before(:each) { clean_data(Location) }
  after(:each) { clean_data(Location) }

  describe '.insert_all' do
    let(:location) { Location.find_by(location_code: 'XX0102') }

    it 'creates locations' do
      expect(Location.count).to eq(0)
      InsertAllService.insert_all(Location, locations, 'location_code')
      expect(Location.count).to eq(4)
      expect(location.name('en')).to eq('Country 1::Province 1::District 2')
    end

    it 'overwrites the records currently in the database' do
      Location.create!(
        'location_code' => 'XX0102', 'type' => 'district', 'admin_level' => 2,
        'placename_i18n' => { 'en' => 'Country 1::Province 1::District ZZZ' }
      )

      InsertAllService.insert_all(Location, locations, 'location_code')
      expect(Location.count).to eq(4)
      expect(location.name('en')).to eq('Country 1::Province 1::District 2')
    end
  end
end
