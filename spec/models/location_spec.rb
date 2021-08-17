# frozen_string_literal: true

require 'rails_helper'

describe Location do
  before :each do
    clean_data(Location)
    allow(I18n).to receive(:available_locales) { %i[en fr] }

    @country = create(
      :location, placename_all: 'MyCountry', type: 'country', location_code: 'MC01'
    )
    @province1 = create(
      :location, hierarchy_path: "#{@country.location_code}.PR01",
                 type: 'province', location_code: 'PR01',
                 placename_i18n: { en: 'Province 1', fr: 'La Province 1' }
    )
    @province2 = create(
      :location, hierarchy_path: "#{@country.location_code}.PR02", type: 'state', location_code: 'PR02'
    )
    @province3 = create(
      :location, hierarchy_path: "#{@country.location_code}.PR03", type: 'province', location_code: 'PR03'
    )
    @town1 = create(
      :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW01",
                 placename_all: 'Town 1', type: 'city', location_code: 'TW01'
    )
    @town2 = create(
      :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW02",
                 type: 'city', disabled: false, location_code: 'TW02'
    )
    @town3 = create(
      :location, parent_code: @province2.location_code, type: 'city', location_code: 'TW03'
    )
    @disabled1 = create(
      :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.D01",
                 disabled: true, location_code: 'D01'
    )
    @disabled2 = create(
      :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.D02",
                 disabled: true, location_code: 'D02'
    )
  end

  describe 'Location creation' do
    describe 'hierarchy' do
      it 'is calculated from the hierarchy path' do
        expect(@town1.hierarchy).to eq(%w[MC01 PR01 TW01])
      end

      it 'is calculated from the parent if the parent is provided' do
        expect(@town3.hierarchy).to eq(%w[MC01 PR02 TW03])
      end

      it 'is defaulted to the current location code for admin 0' do
        expect(@country.hierarchy).to eq(%w[MC01])
      end
    end

    describe 'admin level' do
      it 'is calculated from the hierarchy' do
        expect(@town1.admin_level).to eq(2)
      end

      it 'indicates a country if it is 0' do
        expect(@country.country?).to be_truthy
        expect(@town1.country?).to be_falsey
      end
    end

    describe 'name' do
      it 'is defaulted to placename for countries' do
        expect(@country.name).to eq(@country.placename)
      end

      it 'is calculated from the hierarchy' do
        expect(@town1.name).to eq('MyCountry::Province 1::Town 1')
      end

      it 'is localized' do
        expect(@town1.name('fr')).to eq('MyCountry::La Province 1::Town 1')
      end
    end
  end

  describe 'Location update' do
    describe 'descendent names' do
      it 'updates the names of all of the descendents if the placename has changed' do
        @country.placename = 'MyCountryXYZ'
        @country.save!

        expect(@country.reload.name).to eq('MyCountryXYZ')
        expect(@town1.reload.name).to eq('MyCountryXYZ::Province 1::Town 1')
      end

      it 'does not attempt to update the names of the descendents if the type change' do
        expect(@country).not_to receive(:update_descendent_names)
        @country.type = 'unrecognized'
        @country.save!
      end

      it 'changes its own name when the placename changes' do
        @town1.placename = 'Pawtucket'
        expect(@town1.name).to_not eq('MyCountry::Province 1::Pawtucket')
        @town1.save
        expect(@town1.name).to eq('MyCountry::Province 1::Pawtucket')
      end
    end

    describe 'field updates' do
      it 'rejects updates on admin_level, heirarchy, location_code' do
        @country.update(admin_level: 1, hierarchy_path: 'MC01.PR08', location_code: 'PR08')
        expect(@country.reload.admin_level).to eq(0)
        expect(@country.reload.hierarchy_path).to eq('MC01')
        expect(@country.reload.location_code).to eq('MC01')
      end
    end
  end

  describe '.create_or_update!' do
    let(:location) do
      Location.create!(
        placename_en: 'MyCountry', type: 'country', location_code: 'MC01', hierarchy_path: 'MC01'
      )
    end

    let(:location_configuration_hash) do
      {
        'placename_i18n' => { 'en' => 'MyCountry2' }, 'type' => 'country',
        'location_code' => 'MC01', 'hierarchy_path' => 'MC01'
      }
    end

    before(:each) do
      clean_data(Location)
      location
    end

    it 'creates a new location from a configuration hash' do
      location_configuration_hash2 = location_configuration_hash.clone
      location_configuration_hash2['location_code'] = 'MC02'
      location_configuration_hash2['hierarchy_path'] = 'MC02'

      new_location = Location.create_or_update!(location_configuration_hash2)
      expect(new_location.configuration_hash).to include(location_configuration_hash2)
      expect(new_location.id).not_to eq(location.id)
    end

    it 'updates an existing location from a configuration hash' do
      location_configuration_hash2 = location_configuration_hash.clone
      location_configuration_hash2['placename_i18n']['en'] = 'MyCountry3'

      location2 = Location.create_or_update!(location_configuration_hash2)
      expect(location2.id).to eq(location.id)
      expect(location2.name('en')).to eq('MyCountry3')
    end
  end

  it 'returns all descendents' do
    expect(@province1.descendents).to match_array [@town1, @town2]
    expect(@province2.descendents).to match_array [@town3, @disabled1, @disabled2]
    expect(@country.descendents).to match_array(
      [@province1, @province2, @province3, @town1, @town2, @town3, @disabled1, @disabled2]
    )
  end

  describe 'Location validation' do
    it 'should only allow unique location codes' do
      country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country', admin_level: 0)
      country1.save

      state1 = Location.new(
        placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy_path: "#{country1.location_code}.NC"
      )
      state1.save

      state2 = Location.new(
        placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy_path: "#{country1.location_code}.NC"
      )
      state2.save
      expect(state2.valid?).to be_falsey
      expect(state2.errors[:location_code]).to eq(
        ['A Location with that location code already exists, please enter a different location code']
      )
    end

    it 'should allow locations with same placename but different hierachies' do
      country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country', admin_level: 0)
      country1.save
      country2 = Location.new(placename: 'Canada', location_code: 'CA', type: 'country', admin_level: 0)
      country2.save

      state1 = Location.new(
        placename: 'North Carolina', location_code: 'USNC', type: 'state',
        hierarchy_path: "#{country1.location_code}.USNC"
      )
      state1.save

      state2 = Location.new(
        placename: 'North Carolina', location_code: 'CANC', type: 'state',
        hierarchy_path: "#{country2.location_code}.CANC"
      )
      state2.save
      state2.should be_valid
    end

    it 'should not be valid if placename is empty' do
      location = Location.new(location_code: 'abc123')
      location.should_not be_valid
      location.errors[:placename].should == ['must not be blank']
    end

    it 'should not be valid if location code is empty' do
      location = Location.new(placename: 'test_location')
      location.should_not be_valid
      location.errors[:location_code].should == ['must not be blank']
    end
  end

  describe 'ancestors' do
    describe '.ancestors' do
      it 'returns all ancestor locations' do
        expect(@town1.ancestors.map(&:location_code)).to match_array(%w[MC01 PR01 TW01])
      end
      it 'returns the ancestor in asc order' do
        ancestors_location_code = @town1.ancestors.map(&:location_code)
        expect(ancestors_location_code[0]).to eq('MC01')
        expect(ancestors_location_code[1]).to eq('PR01')
        expect(ancestors_location_code[2]).to eq('TW01')
      end
    end

    describe '.ancestor_by_type' do
      it 'returns the ancestor for a given type' do
        expect(@town1.ancestor_by_type('country').location_code).to eq(@country.location_code)
      end
    end

    describe '.ancestor' do
      it 'returns the ancestor for a given admin level' do
        expect(@town1.ancestor(1).location_code).to eq(@province1.location_code)
      end
    end
  end
end
