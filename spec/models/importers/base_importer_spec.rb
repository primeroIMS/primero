require 'rails_helper'

module Importers
  describe BaseImporter do
    before :each do
      csv_io = StringIO.new('name, age, family[1]name, family[1]relation, family[2]name, family[2]relation')
    end

    it "converts 2D array to nested hashes" do
      rows = [
        %w[name age family[1]name family[1]relation family[2]name family[2]relation],
        %w[Joe  15     Bob           father            Mary             mother],
        %w[Larry 10    Roy           father           Polly             mother]
      ]
      hash_data = Importers::BaseImporter.flat_to_nested(rows)

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

    it "handles empty nested hash values" do
      rows = [
        %w[name     age    family[1]name family[1]relation family[2]name family[2]relation],
        %w[Joe      15     Bob           father            Mary          mother],
          ['Larry', '10',  nil,          'father',         'Polly',      'mother']
      ]
      hash_data = Importers::BaseImporter.flat_to_nested(rows)
      expect(hash_data).to eq(
        [
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
              { 'relation' => 'father' },
              { 'name' => 'Polly', 'relation' => 'mother' }
            ]
          }
        ]
      )
    end

    it "handles multi-column array representation" do
      rows = [
        ['name',  'age', 'relative[1]', 'relative[2]', 'relative[3]', 'relative[4]'],
        ['Joe',   '15',  'Bob',         'Bobette',     'Bellin',       nil         ],
        ['Larry', '10',  'Roy',         'Rick',        nil,            'Randi']
      ]

      hash_data = Importers::BaseImporter.flat_to_nested(rows)
      expect(hash_data).to eq(
        [
          {
            "name" => "Joe",
            "age" => "15",
            "relative" => ["Bob", "Bobette", "Bellin"]
          },
          {
            "name" => "Larry",
            "age" => "10",
            "relative" => ["Roy", "Rick", nil, "Randi"]
          }
        ]
      )
    end
  end
end
