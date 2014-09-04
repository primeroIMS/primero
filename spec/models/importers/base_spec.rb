require 'spec_helper'
require 'models/importers/base'

module Importers
  describe Importers do
    before :each do
      csv_io = StringIO.new('name, age, family[1]name, family[1]relation, family[2]name, family[2]relation')
    end

    it "converts 2D array to nested hashes" do
      rows = [
        %w[name age family[1]name family[1]relation family[2]name family[2]relation],
        %w[Joe  15     Bob           father            Mary             mother],
        %w[Larry 10    Roy           father           Polly             mother]
      ]
      hash_data = Importers.flat_to_nested(rows)

      hash_data.should == [
        {
          'name' => 'Joe',
          'age' => '15',
          'family' => [
            { 'name' => 'Bob', 'relation' => 'father' },
            { 'name' => 'Mary', 'relation' => 'mother' }
          ]
        },
        {
          'name' => 'Larry',
          'age' => '10',
          'family' => [
            { 'name' => 'Roy', 'relation' => 'father' },
            { 'name' => 'Polly', 'relation' => 'mother' }
          ]
        }
      ]
    end
  end
end
