require 'rails_helper'

describe Location do

  before do
    Location.delete_all
    Primero::Application.stub :locales => [ Primero::Application::LOCALE_ENGLISH, Primero::Application::LOCALE_FRENCH]
    Primero::Application.stub :default_locale => Primero::Application::LOCALE_ENGLISH

    @country = create :location, admin_level: 0, placename_all: 'MyCountry', type: 'country', location_code: 'MC01', hierarchy_path: 'MC01'
    @province1 = create :location, hierarchy_path: "#{@country.location_code}.PR01", placename_all: 'Province 1', type: 'province', location_code: 'PR01'
    @province2 = create :location, hierarchy_path: "#{@country.location_code}.PR02", type: 'state', location_code: 'PR02'
    @province3 = create :location, hierarchy_path: "#{@country.location_code}.PR03", type: 'province', location_code: 'PR03'
    @town1 = create :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW01", placename_all: 'Town 1', type: 'city', location_code: 'TW01'
    @town2 = create :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW02", type: 'city', disabled: false, location_code: 'TW02'
    @town3 = create :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.TW03", type: 'city', location_code: 'TW03'
    @disabled1 = create :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.D01", disabled: true, location_code: 'D01'
    @disabled2 = create :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.D02", disabled: true, location_code: 'D02'
  end

  describe '#set_name_from_hierarchy_placenames' do
    before do
      @district1 = Location.new(hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.#{@town1.location_code}.DI01",
                                placename_en: 'District 1', placename_fr: 'French District 1', type: 'district', location_code: 'DI01')
      @district1.set_name_from_hierarchy_placenames
    end
    it 'populates the names defined in the locales' do
      expect(@district1.name_en).to eq('MyCountry::Province 1::Town 1::District 1')
      expect(@district1.name_fr).to eq('MyCountry::Province 1::Town 1::French District 1')
    end

    it 'does not populate the name fields not defined in the locales' do
      expect(@district1.try(:name_ar)).to be_nil
    end
  end

  #TODO - add i18n tests
  it '#generate_hierarchy_placenames' do
    expect(@town1.generate_hierarchy_placenames([Primero::Application::LOCALE_ENGLISH])).to include("en"=>["MyCountry", "Province 1", "Town 1"])
  end

  it '#name' do
    expect(@town1.name).to eq("MyCountry::Province 1::Town 1")
  end

  describe 'all names' do
    it 'returns names for enabled locations' do
      expect(Location.all_names.count).to eq(7)
      expect(Location.all_names).to include({'id' => @country.location_code, 'display_text' => @country.name},
                                             {'id' => @province1.location_code, 'display_text' => @province1.name},
                                             {'id' => @province2.location_code, 'display_text' => @province2.name},
                                             {'id' => @province3.location_code, 'display_text' => @province3.name},
                                             {'id' => @town1.location_code, 'display_text' => @town1.name},
                                             {'id' => @town2.location_code, 'display_text' => @town2.name},
                                             {'id' => @town3.location_code, 'display_text' => @town3.name})
    end

    it 'does not return names for disabled locations' do
      expect(Location.all_names).not_to include(@disabled1.name, @disabled2.name)
    end
  end
  it 'returns all names' do
    expect(Location.all_names).to eq([{'id' => @country.location_code, 'display_text' => @country.name},
                                      {'id' => @province1.location_code, 'display_text' => @province1.name},
                                      {'id' => @province2.location_code, 'display_text' => @province2.name},
                                      {'id' => @province3.location_code, 'display_text' => @province3.name},
                                      {'id' => @town1.location_code, 'display_text' => @town1.name},
                                      {'id' => @town2.location_code, 'display_text' => @town2.name},
                                      {'id' => @town3.location_code, 'display_text' => @town3.name}])
  end

  it 'sets the #name to #hierarchical_name when saving' do
    @town1.placename = "Pawtucket"
    expect(@town1.name).to_not eq("MyCountry::Province 1::Pawtucket")
    @town1.save
    expect(@town1.name).to eq("MyCountry::Province 1::Pawtucket")
  end

  it "returns all descendants" do
    expect(@province1.descendants).to match_array [@town1, @town2]
    expect(@province2.descendants).to match_array [@town3, @disabled1, @disabled2]
    expect(@country.descendants).to match_array [@province1, @province2, @province3, @town1, @town2, @town3, @disabled1, @disabled2]
  end

  it "adds location as a parent" do
    location1 = create :location, admin_level: 1
    location2 = create :location, admin_level: 0

    location1.set_parent(location2)

    expect(location2.descendants).to match_array [location1]
  end

  it "should only allow unique location codes" do
    country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country', admin_level: 0)
    country1.save

    state1 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy_path: "#{country1.location_code}.NC")
    state1.save

    state2 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy_path: "#{country1.location_code}.NC")
    state2.save
    state2.should_not be_valid
    state2.errors[:location_code].should == ["A Location with that location code already exists, please enter a different location code"]
  end

  it "should allow locations with same placename but different hierachies" do
    country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country', admin_level: 0)
    country1.save
    country2 = Location.new(placename: 'Canada', location_code: 'CA', type: 'country', admin_level: 0)
    country2.save

    state1 = Location.new(placename: 'North Carolina', location_code: 'USNC', type: 'state', hierarchy_path: "#{country1.location_code}.USNC")
    state1.save

    state2 = Location.new(placename: 'North Carolina', location_code: 'CANC', type: 'state', hierarchy_path: "#{country2.location_code}.CANC")
    state2.save
    state2.should be_valid
  end

  it "should not be valid if placename is empty" do
    location = Location.new(:location_code => "abc123")
    location.should_not be_valid
    location.errors[:placename].should == ["must not be blank"]
  end

  describe 'type by admin level' do
    context 'when admin level is 0' do
      it 'returns location type' do
        expect(Location.type_by_admin_level(0)).to include('country')
      end
    end

    context 'when admin level is 1' do
      it 'returns location type' do
        expect(Location.type_by_admin_level(1)).to include('province', 'state')
      end
    end

    context 'when admin level is 2' do
      it 'returns location type' do
        expect(Location.type_by_admin_level(2)).to include('city')
      end
    end

    context 'when there are no locations for an admin level' do
      it 'returns an empty array' do
        expect(Location.type_by_admin_level(3)).to eq([])
      end
    end
  end

  describe 'ancestor by admin level' do
    context 'when admin level is 0' do
      it 'returns the ancestor' do
        expect(@town3.ancestor_by_admin_level(0)).to eq(@country)
      end
    end

    context 'when admin level is 1' do
      it 'returns the ancestor' do
        expect(@town3.ancestor_by_admin_level(1)).to eq(@province2)
      end
    end

    context 'when admin level is the same as the current locations admin level' do
      it 'it return itself' do
        expect(@town3.ancestor_by_admin_level(2)).to eq(@town3)
      end
    end

    context 'when admin level is greater than the current locations admin level' do
      it 'does not return an ancestor' do
        expect(@town3.ancestor_by_admin_level(3)).to be_nil
      end
    end

    context 'when admin level is not in the valid range of admin levels' do
      it 'does not return an ancestor' do
        expect(@town3.ancestor_by_admin_level(99)).to be_nil
      end
    end
  end

  # describe 'ancestor placename by name and admin level' do
  #   context 'when admin level is 0' do
  #     it 'returns the ancestor' do
  #       expect(Location.ancestor_placename_by_name_and_admin_level(@town3.name, 0)).to eq(@country.placename)
  #     end
  #   end
  #
  #   context 'when admin level is 1' do
  #     it 'returns the ancestor' do
  #       expect(Location.ancestor_placename_by_name_and_admin_level(@town3.name, 1)).to eq(@province2.placename)
  #     end
  #   end
  #
  #   context 'when admin level is the same as the current locations admin level' do
  #     it 'returns this locations placename' do
  #       expect(Location.ancestor_placename_by_name_and_admin_level(@town3.name, 2)).to eq(@town3.placename)
  #     end
  #   end
  #
  #   context 'when admin level is greater than the current locations admin level' do
  #     it 'does not return an ancestor' do
  #       expect(Location.ancestor_placename_by_name_and_admin_level(@town3.name, 3)).to be_nil
  #     end
  #   end
  #
  #   context 'when admin level is not in the valid range of admin levels' do
  #     it 'does not return an ancestor' do
  #       expect(Location.ancestor_placename_by_name_and_admin_level(@town3.name, 99)).to be_empty
  #     end
  #   end
  # end

  describe 'admin level' do
    context 'when location has a parent' do
      before :each do
        @location = Location.new(placename: 'MyTown', location_code: 'abc123', hierarchy_path: "#{@country.location_code}.abc123")
      end

      it 'calculates admin_level' do
        expect(@location.calculate_admin_level).to eq((@country.admin_level + 1))
        expect(@location.admin_level).to eq((@country.admin_level + 1))
      end

      context 'and admin_level is empty' do
        it "is valid" do
          expect(@location).to be_valid
        end
      end

      context 'and admin_level is present' do
        before :each do
          @location[:admin_level] = 1
        end
        it "is valid" do
          expect(@location).to be_valid
        end
      end

      context 'and parents admin_level is equal to the max admin_level' do
        before :each do
          @country_max = create :location, admin_level: Location::ADMIN_LEVELS.last, placename: 'MaxCountry'
          @location[:hierarchy_path] = "#{@country_max.location_code}.abc123"
        end

        it 'calculates admin_level as out of range' do
          expect(@location.calculate_admin_level).to eq(Location::ADMIN_LEVEL_OUT_OF_RANGE)
          expect(@location.admin_level).to eq(Location::ADMIN_LEVEL_OUT_OF_RANGE)
        end
      end
    end

    context 'when location does not have a parent' do
      before :each do
        @location = Location.new(placename: 'MyTown', location_code: 'abc123', )
      end

      context 'and admin_level is empty' do
        it "is not valid" do
          expect(@location).not_to be_valid
          expect(@location.errors[:admin_level]).to eq(['must not be blank'])
        end

        it 'does not calculate admin_level' do
          orig_admin_level = @location.admin_level
          expect(@location.calculate_admin_level).to be_nil
          expect(@location.admin_level).to eq(orig_admin_level)
        end
      end

      context 'and admin_level is present' do
        before :each do
          @location[:admin_level] = 1
        end
        it "is valid" do
          expect(@location).to be_valid
        end

        it 'does not calculate admin_level' do
          orig_admin_level = @location.admin_level
          expect(@location.calculate_admin_level).to be_nil
          expect(@location.admin_level).to eq(orig_admin_level)
        end
      end
    end
  end

  describe 'find_names_by_admin_level_enabled' do
    before do
      @another_country = create :location, admin_level: 0, placename: 'Another Country', type: 'country'
      @another_province = create :location, hierarchy_path: "#{@another_country.location_code}.AP01", type: 'province', location_code: 'AP01'
      @another_town1 = create :location, hierarchy_path: "#{@another_country.location_code}.#{@another_province.location_code}.ATW01", type: 'city', location_code: 'ATW01'
      @another_town2 = create :location, hierarchy_path: "#{@another_country.location_code}.#{@another_province.location_code}.ATW02", type: 'city', location_code: 'ATW02'
    end

    context 'when filter is not present' do
      it 'finds all location names for admin level' do
        expected = [{"id"=>@town1.location_code, "hierarchy_path"=>"#{@country.location_code}.#{@province1.location_code}.#{@town1.location_code}", "display_text"=>@town1.placename},
                    {"id"=>@town2.location_code, "hierarchy_path"=>"#{@country.location_code}.#{@province1.location_code}.#{@town2.location_code}", "display_text"=>@town2.placename},
                    {"id"=>@town3.location_code, "hierarchy_path"=>"#{@country.location_code}.#{@province2.location_code}.#{@town3.location_code}", "display_text"=>@town3.placename},
                    {"id"=>@another_town1.location_code, "hierarchy_path"=>"#{@another_country.location_code}.#{@another_province.location_code}.ATW01", "display_text"=>@another_town1.placename},
                    {"id"=>@another_town2.location_code, "hierarchy_path"=>"#{@another_country.location_code}.#{@another_province.location_code}.ATW02", "display_text"=>@another_town2.placename}]
        expect(Location.find_names_by_admin_level_enabled(2)).to match_array(expected)
      end
    end

    context 'when filter is present' do
      #TODO - i18n - this method has changed for i18n.  Verify if this test case is still needed.
      xit 'finds all location names for admin level matching filter' do
        expect(Location.find_names_by_admin_level_enabled(2, @another_country.placename)).to match_array([@another_town1.name, @another_town2.name])
      end
    end
  end

  it "should not be valid if location code is empty" do
    location = Location.new(:placename => "test_location")
    location.should_not be_valid
    location.errors[:location_code].should == ["must not be blank"]
  end

  describe "Batch processing" do
    before do
      Location.all.each { |location| location.destroy }
    end

    it "should process in two batches" do
      country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country', admin_level: 0)
      country1.save!

      country2 = Location.new(placename: 'Canada', location_code: 'CA', type: 'country', admin_level: 0)
      country2.save!

      state1 = Location.new(placename: 'North Carolina', location_code: 'USNC', type: 'state', hierarchy_path: "#{country1.location_code}.USNC")
      state1.save!

      state2 = Location.new(placename: 'North Carolina', location_code: 'CANC', type: 'state', hierarchy_path: "#{country2.location_code}.CANC")
      state2.save!

      expect(Location.all.paginate(:page => 1, :per_page => 3)).to include(country1, country2, state1)
      expect(Location.all.paginate(:page => 2, :per_page => 3)).to include(state2)
      Location.should_receive(:all).exactly(1).times.and_call_original

      records = []
      Location.each_slice(3) do |locations|
        locations.each{|l| records << l.placename}
      end

      records.should eq(['USA', 'Canada','North Carolina', 'North Carolina'])
    end

    it "should process in 0 batches" do
      Location.should_receive(:all).exactly(1).times.and_call_original
      records = []
      Location.each_slice(3) do |location|
        locations.each{|l| records << l.placename}
      end
      records.should eq([])
    end

  end

  describe "hierarchy_path_from_parent_code" do
    before do
      @district1 = Location.create(hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.#{@town1.location_code}.DI01",
        placename_en: 'District 1',
        placename_fr: 'French District 1',
        type: 'district',
        location_code: 'DI01')
    end
    it "expect the hierarchy_path generated" do
      expect(Location.hierarchy_path_from_parent_code(@town1.location_code, 'DI01')).to eql(@district1.hierarchy_path)
    end
  end

  describe "hierarchy" do
    before do
      @district1 = Location.create(hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.#{@town1.location_code}.DI01",
        placename_en: 'District 1',
        placename_fr: 'French District 1',
        type: 'district',
        location_code: 'DI01')
    end
    it 'should print an array of hierarchy' do
      expect(@district1.hierarchy).to eq(["MC01", "PR01", "TW01"])
    end
  end

end
