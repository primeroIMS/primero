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

  it 'sets the #name to #hierarchical_name when saving' do
    @town1.placename = "Pawtucket"
    expect(@town1['name']).to_not eq(@town1.hierarchical_name)
    expect(@town1.name).to eq(@town1.hierarchical_name)
    @town1.save
    expect(@town1['name']).to eq(@town1.hierarchical_name)
    expect(@town1.name).to eq(@town1.hierarchical_name)
  end


  #TODO - Primero-443 Need to fix
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

  #TODO - Primero-443 Need to fix
  it "adds location as a parent" do
    location1 = create :location
    location2 = create :location

    location1.set_parent(location2)

    expect(location2.descendants).to match_array [location1]
  end


end



