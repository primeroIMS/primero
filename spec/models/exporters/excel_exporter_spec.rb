require 'spec_helper'
require 'spreadsheet'

module Exporters
  describe ExcelExporter do
    it "converts data to Excel format" do
      forms = {
        "primeromodule-cp" => {
          "test_form_section_1" => {"name"=>"Test Form Section 1", "fields"=>["first_name", "last_name"]},
          "test_form_section_2" => {"name"=>"Test Form Section 2", "fields"=>["relation", "module_id", "array_field"]}
        }
      }
      records = [Child.new("module_id" => "primeromodule-cp", "first_name" => "John", "last_name" => "Doe", 
                           "relation"=>"Mother", "array_field"=> ["Option1", "Option2"])]
      ExcelExporter.should_receive(:build_forms).with(records).and_return(forms)
      data = ExcelExporter.export(records, [])

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "module_id", "first_name", "last_name"]
      sheet.row(1).to_a.should == [nil, "Child", "primeromodule-cp", "John", "Doe"]

      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["_id", "model_type", "module_id", "relation", "array_field"]
      sheet.row(1).to_a.should == [nil, "Child", "primeromodule-cp", "Mother", "Option1 ||| Option2"]
    end
  end
end
