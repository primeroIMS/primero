require 'rails_helper'

module Importers
  describe JSONImporter do
    it "should convert a JSON file object to a ruby array" do
      file_obj = StringIO.new(%q([{"name": "Larry", "survivor_code": "123"}]))
      JSONImporter.import(file_obj).should == [
        {
          "name" => "Larry",
          "survivor_code" => "123"
        }
      ]
    end
  end
end
