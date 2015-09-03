require 'spec_helper'
require 'models/exporters/base'

module Exporters
  describe BaseExporter do
    before :each do
      @model_class = Class.new(CouchRest::Model::Base) do
        property :name, String
        property :survivor_code, String
        property :date_last_seen, Date
        property :family_members, [Class.new do
            include CouchRest::Model::Embeddable
            property :name, String
            property :relationship, String
            property :module_id, String, :default => 'primeromodule-cp'
          end]
        property :organizations, [String]
        property :module_id, String, :default => 'primeromodule-cp'
      end

      @instance = @model_class.new
      @instance.family_members = [
        {:name => 'John', :relationship => 'father'},
        {:name => 'Mary', :relationship => 'mother'},
      ]
      @instance.organizations = ['Red Cross', 'UNICEF', 'Save the Children']
    end

    describe "to_2D_array" do
      it "converts simple models to 2D array" do
        child = @model_class.new
        child.name = 'John Doe'

        arr = []
        BaseExporter.to_2D_array([ child ], @model_class.properties) do |row|
          arr << row
        end

        arr.length.should == 2
        expect(arr[0]).to include("name")
        arr[1][arr[0].index("name")].should == 'John Doe'
      end

      it "flattens out nested forms" do
        arr = []
        BaseExporter.to_2D_array([ @instance ], [@model_class.properties_by_name['family_members']]) do |row|
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

      it "fills in nil for missing array slots" do
        second = @instance.clone
        second.family_members = [{:name => 'Larry', :relationship => 'father'}]

        arr = []
        BaseExporter.to_2D_array([ @instance, second ], [@model_class.properties_by_name['family_members']]) do |row|
          arr << row
        end

        arr.length.should == 3
        arr[2][arr[0].index("family_members[1]name")].should == 'Larry'
        arr[2][arr[0].index("family_members[1]relationship")].should == 'father'
        arr[2][arr[0].index("family_members[2]name")].should == nil
        arr[2][arr[0].index("family_members[2]relationship")].should == nil
      end

      it "handles normal arrays" do
        arr = []
        BaseExporter.to_2D_array([ @instance ], [@model_class.properties_by_name['organizations']]) do |row|
          arr << row
        end

        arr.length.should == 2
        arr[0][2..-1].should == ['organizations[1]', 'organizations[2]', 'organizations[3]']
        arr[1][2..-1].should == [@instance.organizations[0], @instance.organizations[1], @instance.organizations[2]]
      end
    end

    describe "convert_model_to_hash" do
      it "should handled nested data" do
        hash = BaseExporter.convert_model_to_hash(@instance,
                                               [@model_class.properties_by_name['family_members']])
        hash.should == {'family_members' => [
          {'name' => 'John', 'relationship' => 'father', 'module_id' => 'primeromodule-cp'},
          {'name' => 'Mary', 'relationship' => 'mother', 'module_id' => 'primeromodule-cp'},
        ],
        'model_type' => @model_class.name,
        '_id' => @instance.id}
      end

      it "should exclude unlisted properties" do
        hash = BaseExporter.convert_model_to_hash(@instance,
                                               [@model_class.properties_by_name['survivor_code']])

        hash.keys.should == ['survivor_code', 'model_type', '_id']
      end
    end
  end
end
