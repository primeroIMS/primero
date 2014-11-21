require 'spec_helper'
require 'spreadsheet'

module Exporters
  describe ExcelExporter do
    before :each do
      FormSection.all.all.each {|form| form.destroy}
      form = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_2")
      form.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true, 
                               :option_strings_text => ["Option1", "Option2"])
      form.save!

      form = FormSection.new(:name => "cases_test_form_1", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_1")
      form.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form.save!

      Child.refresh_form_properties
    end

    it "converts data to Excel format" do
      records = [Child.new("first_name" => "John", "last_name" => "Doe", 
                           "relationship"=>"Mother", "array_field"=> ["Option1", "Option2"])]
      data = ExcelExporter.export(records, Child.properties_by_form)

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [nil, "Child", "John", "Doe"]

      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["_id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [nil, "Child", "Mother", "Option1 ||| Option2"]
    end
  end

end
