require 'spec_helper'

module Exporters
  describe Exporters do
    before :each do
    end

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

    describe "nested form conversion" do
      before :each do
        @model_class = Child.dup
        @model_class.class_eval do
          property :family_members, [Class.new do
              include CouchRest::Model::Embeddable
              property :name, String
              property :relationship, String
            end]
        end
      end

      it "flattens out nested forms" do
        instance = @model_class.new
        instance.family_members = [
          {:name => 'John', :relationship => 'father'},
          {:name => 'Mary', :relationship => 'mother'},
        ]

        arr = []
        Exporters.to_2D_array([ instance ], [@model_class.properties_by_name['family_members']]) do |row|
          arr << row
        end

        arr.length.should == 2
        expect(arr[0]).to include("family_members_1_name")
        expect(arr[0]).to include("family_members_1_relationship")
        expect(arr[0]).to include("family_members_2_name")
        expect(arr[0]).to include("family_members_2_relationship")

        arr[1][arr[0].index("family_members_1_name")].should == 'John'
        arr[1][arr[0].index("family_members_2_name")].should == 'Mary'
        arr[1][arr[0].index("family_members_1_relationship")].should == 'father'
        arr[1][arr[0].index("family_members_2_relationship")].should == 'mother'
      end
    end
  end
end
