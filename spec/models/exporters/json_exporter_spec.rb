require 'spec_helper'

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
end
