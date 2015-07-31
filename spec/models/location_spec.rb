require 'spec_helper'

describe Location do

  before do
    Location.all.each &:destroy

    @country = create :location
    @province1 = create :location, hierarchy: [@country.placename]
    @province2 = create :location, hierarchy: [@country.placename]
    @province3 = create :location, hierarchy: [@country.placename]
    @town1 = create :location, hierarchy: [@country.placename, @province1.placename]
    @town2 = create :location, hierarchy: [@country.placename, @province1.placename]
    @town3 = create :location, hierarchy: [@country.placename, @province2.placename]

  end

  it '#hierarchical_name' do
    expect(@town1.hierarchical_name).to eq("#{@country.placename}::#{@province1.placename}::#{@town1.placename}")
  end

  it '#name' do
    expect(@town1.name).to eq(@town1.hierarchical_name)
  end

  it 'returns all names' do
    expect(Location.all_names).to eq([@country.name, @province1.name, @province2.name, @province3.name, @town1.name, @town2.name, @town3.name])
  end

  it 'sets the #name to #hierarchical_name when saving' do
    @town1.placename = "Pawtucket"
    expect(@town1['name']).to_not eq(@town1.hierarchical_name)
    expect(@town1.name).to eq(@town1.hierarchical_name)
    @town1.save
    expect(@town1['name']).to eq(@town1.hierarchical_name)
    expect(@town1.name).to eq(@town1.hierarchical_name)
  end

  it "returns all descendants" do
    expect(@province1.descendants).to match_array [@town1, @town2]
    expect(@province2.descendants).to match_array [@town3]
    expect(@country.descendants).to match_array [@province1, @province2, @province3, @town1, @town2, @town3]
  end

  it "makes a single couchdb query to fetch a multi-level hierarchy" do
    expect(Location).to receive(:by_parent).once
    expect(Location).to_not receive(:get)
    expect(Location).to_not receive(:by_name)
    @country.descendants
  end

  it "adds location as a parent" do
    location1 = create :location
    location2 = create :location

    location1.set_parent(location2)

    expect(location2.descendants).to match_array [location1]
  end

  it "should only allow unique location hierachies" do
    country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country')
    country1.save

    state1 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy: [country1.placename])
    state1.save

    state2 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy: [country1.placename])
    state2.save
    state2.should_not be_valid
    state2.errors[:name].should == ["A Location with that name already exists, please enter a different name"]
  end

  it "should allow locations with same placename but different hierachies" do
    country1 = Location.new(placename: 'USA', location_code: 'US', type: 'country')
    country1.save
    country2 = Location.new(placename: 'Canada', location_code: 'CA', type: 'country')
    country2.save

    state1 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy: [country1.placename])
    state1.save

    state2 = Location.new(placename: 'North Carolina', location_code: 'NC', type: 'state', hierarchy: [country2.placename])
    state2.save
    state2.should be_valid
  end

  it "should not be valid if placename is empty" do
    location = Location.new(:location_code => "abc123")
    location.should_not be_valid
    location.errors[:name].should == ["must not be blank"]
  end

  it "should not be valid if location code is empty" do
    location = Location.new(:placename => "test_location")
    location.should_not be_valid
    location.errors[:location_code].should == ["must not be blank"]
  end
end
