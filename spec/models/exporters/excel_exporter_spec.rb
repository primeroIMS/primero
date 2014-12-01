require 'spec_helper'
require 'spreadsheet'

module Exporters
  describe ExcelExporter do
    before :each do
      FormSection.all.all.each {|form| form.destroy}
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_2", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_subform_2",
                                :unique_id => "cases_test_subform_2")
      subform.fields << Field.new(:name => "field_3", :type => Field::TEXT_FIELD, :display_name => "field_3")
      subform.fields << Field.new(:name => "field_4", :type => Field::TEXT_FIELD, :display_name => "field_4")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_3", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_3")
      form.fields << Field.new(:name => "subform_field_2", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.unique_id)
      form.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with none subforms fields ######
      form = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_2")
      form.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true, 
                               :option_strings_text => ["Option1", "Option2"])
      form.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform = FormSection.new(:name => "cases_test_subform_1", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_subform_1",
                                :unique_id => "cases_test_subform_1")
      subform.fields << Field.new(:name => "field_1", :type => Field::TEXT_FIELD, :display_name => "field_1")
      subform.fields << Field.new(:name => "field_2", :type => Field::TEXT_FIELD, :display_name => "field_2")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_1", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_1")
      form.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form.fields << Field.new(:name => "subform_field_1", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.unique_id)
      form.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      Child.refresh_form_properties

      @properties_by_module = {"primeromodule-cp" => Child.properties_by_form }
    end

    after :each do
      # TODO: Change this for a better approach. This is a work arround.
      # Custom validators are registered for the subforms when saved, 
      #they keep registered in the execution of the rspecs and some test breaks up because 
      #the subforms are no longer available (which is ok, they shouldn't be).
      # Should the validators be registered on Child when a Child with subform is saved?
      FormSection.all.all.map{|f| f.fields}
        .flatten.select{|f| f.type == Field::SUBFORM}
        .map{|f| f.name}.each do |key|
        # Remove the validator for the subforms used only on this test.
        Child._validators.delete key.to_sym if Child._validators[key.to_sym]
        Child.form_properties_by_name.delete key
      end
      FormSection.all.all.each { |form| form.destroy }
    end

    it "converts data to Excel format" do
      records = [Child.new("module_id" => "primeromodule-cp", "first_name" => "John", "last_name" => "Doe",
                           "relationship"=>"Mother", "array_field"=> ["Option1", "Option2"],
                           "subform_field_1" => [{"unique_id" =>"1", "field_1" => "field_1 value", "field_2" => "field_2 value"}],
                           "subform_field_2" => [{"unique_id" =>"2", "field_3" => "field_3 value", "field_4" => "field_4 value"}])]
      data = ExcelExporter.export(records, @properties_by_module)

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [nil, "Child", "John", "Doe"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["_id", "model_type", "unique_id", "field_1", "field_2"]
      sheet.row(1).to_a.should == [nil, "Child", "1", "field_1 value", "field_2 value"]

      sheet = book.worksheets[2]
      sheet.row(0).to_a.should == ["_id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [nil, "Child", "Mother", "Option1 ||| Option2"]

      #Subform "cases_test_form_3" create this sheet because the subform.
      sheet = book.worksheets[3]
      sheet.row(0).to_a.should == ["_id", "model_type", "unique_id", "field_3", "field_4"]
      sheet.row(1).to_a.should == [nil, "Child", "2", "field_3 value", "field_4 value"]
    end
  end

end
