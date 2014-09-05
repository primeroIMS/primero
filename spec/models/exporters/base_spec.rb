require 'spec_helper'
require 'models/exporters/base'

module Exporters
  describe Exporters do
    before :each do
      @model_class = Child.dup
      @model_class.class_eval do
        property :survivor_code, String
        property :date_last_seen, Date
        property :family_members, [Class.new do
            include CouchRest::Model::Embeddable
            property :name, String
            property :relationship, String
          end]
      end

      @instance = @model_class.new
      @instance.family_members = [
        {:name => 'John', :relationship => 'father'},
        {:name => 'Mary', :relationship => 'mother'},
      ]
    end

    describe "to_2D_array" do
      it "converts simple models to 2D array" do
        child = build(:child, :name => 'John Doe')
        arr = []
        Exporters.to_2D_array([ child ], Child.properties) do |row|
          arr << row
        end

        arr.length.should == 2
        expect(arr[0]).to include("name")
        arr[1][arr[0].index("name")].should == 'John Doe'
      end

      it "flattens out nested forms" do
        arr = []
        Exporters.to_2D_array([ @instance ], [@model_class.properties_by_name['family_members']]) do |row|
          arr << row
        end

        arr.length.should == 2
        expect(arr[0]).to include("family_members[1]name")
        expect(arr[0]).to include("family_members[1]relationship")
        expect(arr[0]).to include("family_members[2]name")
        expect(arr[0]).to include("family_members[2]relationship")

        arr[1][arr[0].index("family_members[1]name")].should == 'John'
        arr[1][arr[0].index("family_members[2]name")].should == 'Mary'
        arr[1][arr[0].index("family_members[1]relationship")].should == 'father'
        arr[1][arr[0].index("family_members[2]relationship")].should == 'mother'
      end
    end

    describe "convert_model_to_hash" do
      it "should handled nested data" do
        hash = Exporters.convert_model_to_hash(@instance,
                                               [@model_class.properties_by_name['family_members']])
        hash.should == {'family_members' => [
          {'name' => 'John', 'relationship' => 'father'},
          {'name' => 'Mary', 'relationship' => 'mother'},
        ]}
      end

      it "should exclude unlisted properties" do
        hash = Exporters.convert_model_to_hash(@instance,
                                               [@model_class.properties_by_name['survivor_code']])

        hash.keys.should == ['survivor_code']
      end
    end
  end
end
