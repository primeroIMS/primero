require 'rails_helper'
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
        # TODO: 5 organizations here are due to a hack on longest_array in base exporter
        arr[0][2..-1].should == ['organizations[1]', 'organizations[2]', 'organizations[3]', 'organizations[4]', 'organizations[5]']
        arr[1][2..-1].should == [@instance.organizations[0], @instance.organizations[1], @instance.organizations[2], nil, nil]
      end
    end

    describe "include_metadata_properties" do
      it "attaches core metadata properties to the end of each case properties list" do
        props = {
          'primeromodule-cp' => {
            'Form1' => {},
            'Form2' => {}
          },
          'primeromodule-gbv' => {
            'Form3' => {},
            'Form4' => {}
          }
        }

        props_with_metadata = BaseExporter.include_metadata_properties(props, Child)

        expect(props_with_metadata['primeromodule-cp'].keys.last).to eq('__record__')
        expect(props_with_metadata['primeromodule-cp']['__record__'].present?).to be_truthy
        expect(props_with_metadata['primeromodule-cp']['__record__'].values.first).to be_an(CouchRest::Model::Property)


        expect(props_with_metadata['primeromodule-gbv'].keys.last).to eq('__record__')
        expect(props_with_metadata['primeromodule-gbv']['__record__'].present?).to be_truthy
        expect(props_with_metadata['primeromodule-gbv']['__record__'].values.first).to be_an(CouchRest::Model::Property)
      end
    end

  end
end
