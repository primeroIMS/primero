require 'spec_helper'

describe Location do

  before do
    Location.all.each &:destroy

    @country = create :location
    @province1 = create :location, hierarchy: [@country.name]
    @province2 = create :location, hierarchy: [@country.name]
    @province3 = create :location, hierarchy: [@country.name]
    @town1 = create :location, hierarchy: [@country.name, @province1.name]
    @town2 = create :location, hierarchy: [@country.name, @province1.name]
    @town3 = create :location, hierarchy: [@country.name, @province2.name]

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


end



