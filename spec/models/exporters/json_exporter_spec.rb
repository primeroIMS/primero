require 'rails_helper'

module Exporters
  describe JSONExporter do
    it "converts models to JSON format" do
      models = [build(:child, name: 'Test', reunited: false)]
      properties = Child.properties.select {|p| ['name', 'reunited'].include?(p.name) }
      data_hash = JSON.parse(JSONExporter.export(models, properties))

      data_hash.should == [
        {
          'name' => 'Test',
          'reunited' => false,
          'model_type' => 'Child',
          '_id' => models[0].id,
        }
      ]
    end
  end

  describe "convert_model_to_hash" do
    before :each do
      @exporter = Exporters::JSONExporter.new
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

    it "should handled nested data" do
      hash = @exporter.convert_model_to_hash(@instance,
                                            [@model_class.properties_by_name['family_members']])

      hash.should == {
      'family_members' => [
        {'name' => 'John', 'relationship' => 'father', 'module_id' => 'primeromodule-cp'},
        {'name' => 'Mary', 'relationship' => 'mother', 'module_id' => 'primeromodule-cp'}
      ],
      'model_type' => @model_class.name,
      '_id' => @instance.id}

    end

    it "should exclude unlisted properties" do
      hash = @exporter.convert_model_to_hash(@instance,
                                            [@model_class.properties_by_name['survivor_code']])

      hash.keys.should == ['survivor_code', 'model_type', '_id']
    end
  end

  describe "convert_model_to_hash with hidden_name in true or false on Child Model" do

    before :each do
      @exporter = Exporters::JSONExporter.new
      @child = build(:child, name: 'Test name')
      @child_properties = Child.properties.select {|p| ['name'].include?(p.name) }
    end

    #TODO - Fix... RON   Need to create form sections
    it "should be not return name" do
      @child.hidden_name = true
      hash = @exporter.convert_model_to_hash(@child, @child_properties)
      hash.should == {"model_type"=>"Child", "_id"=>@child.id}
    end

    it "should be return name field" do
      @child.hidden_name = false
      hash = @exporter.convert_model_to_hash(@child, @child_properties)
      hash.should == {"name"=>"Test name", "model_type"=>"Child", "_id"=>@child.id}
    end

  end

end
