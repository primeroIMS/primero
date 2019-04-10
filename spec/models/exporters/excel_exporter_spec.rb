require 'rails_helper'

require 'spreadsheet'

module Exporters
  describe ExcelExporter do
    before :each do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_2", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 2, :order => 0, :order_subform => 0, :form_group_name => "Case Form 3",
                                :unique_id => "cases_test_subform_2")
      subform.fields << Field.new(:name => "field_3", :type => Field::TEXT_FIELD, :display_name => "field_3")
      subform.fields << Field.new(:name => "field_4", :type => Field::TEXT_FIELD, :display_name => "field_4")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_3", :parent_form => "case", "visible" => true,
                             :order_form_group => 2, :order => 0, :order_subform => 0, :form_group_name => "Case Form 3",
                             :unique_id => "cases_test_form_3")
      form.fields << Field.new(:name => "subform_field_2", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.unique_id)
      form.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with none subforms fields ######
      form = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                             :order_form_group => 1, :order => 0, :order_subform => 0, :form_group_name => "Case Form 2",
                             :unique_id => "cases_test_form_2")
      form.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true,
                               :option_strings_text => ["Option1", "Option2"])
      form.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform = FormSection.new(:name => "cases_test_subform_1", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "Case Form 1",
                                :unique_id => "cases_test_subform_1")
      subform.fields << Field.new(:name => "field_1", :type => Field::TEXT_FIELD, :display_name => "field_1")
      subform.fields << Field.new(:name => "field_2", :type => Field::TEXT_FIELD, :display_name => "field_2")
      subform.save!
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_3", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "Case Form 1",
                                :unique_id => "cases_test_subform_3")
      subform.fields << Field.new(:name => "field_5", :type => Field::TEXT_FIELD, :display_name => "field_5")
      subform.fields << Field.new(:name => "field_6", :type => Field::TEXT_FIELD, :display_name => "field_6")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_1", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "Case Form 1",
                             :unique_id => "cases_test_form_1")
      form.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form.fields << Field.new(:name => "subform_field_1", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => "cases_test_subform_1")
      form.fields << Field.new(:name => "subform_field_3", :type => Field::SUBFORM, :display_name => "subform 3 field", "subform_section_id" => "cases_test_subform_3")
      form.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      #### Build Form Section with Arabic characters in the form name ######
      form = FormSection.new(:name => "Test Arabic فاكيا قد به،. بـ حتى", :parent_form => "case", "visible" => true,
                             :order_form_group => 3, :order => 3, :order_subform => 0, :form_group_name => "Test Arabic")
      form.fields << Field.new(:name => "arabic_text", :type => Field::TEXT_FIELD, :display_name => "arabic text")
      form.fields << Field.new(:name => "arabic_array", :type => Field::SELECT_BOX, :display_name => "arabic array", :multi_select => true,
                               :option_strings_text => ["عقبت 1", "لدّفاع 2"])
      form.save!

      @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["cases_test_subform_2", "cases_test_form_3", "cases_test_form_2", "cases_test_subform_1",
                              "cases_test_subform_3", "cases_test_form_1"],
        associated_record_types: ['case']
      )

      Child.refresh_form_properties

      @properties_by_module = {"primeromodule-cp" => Child.properties_by_form }

      @user = User.new(:user_name => 'fakeadmin', module_ids: ['primeromodule-cp'])

      @records = [Child.new("module_id" => "primeromodule-cp", "first_name" => "John", "last_name" => "Doe",
                           "relationship"=>"Mother", "array_field"=> ["option1", "option2"],
                            "arabic_text" => "لدّفاع", "arabic_array" => ["النفط", "المشتّتون"],
                           "subform_field_1" => [{"unique_id" =>"1", "field_1" => "field_1 value", "field_2" => "field_2 value"}],
                           "subform_field_2" => [{"unique_id" =>"2", "field_3" => "field_3 value", "field_4" => "field_4 value"}],
                           "subform_field_3" => [{"unique_id" =>"3", "field_5" => "field_5 value", "field_6" => "field_6 value"}])]
    end

    after :each do
      # TODO: Change this for a better approach. This is a work arround.
      # Custom validators are registered for the subforms when saved,
      #they keep registered in the execution of the rspecs and some test breaks up because
      #the subforms are no longer available (which is ok, they shouldn't be).
      # Should the validators be registered on Child when a Child with subform is saved?
      FormSection.all.map{|f| f.fields}
        .flatten.select{|f| f.type == Field::SUBFORM}
        .map{|f| f.name}.each do |key|
        # Remove the validator for the subforms used only on this test.
        Child._validators.delete key.to_sym if Child._validators[key.to_sym]
        Child.form_properties_by_name.delete key
      end
      FormSection.all.each { |form| form.destroy }
      PrimeroModule.all.each { |fm| fm.destroy }
    end

    it "converts data to Excel format" do
      data = ExcelExporter.export(@records, @properties_by_module, @user, nil)

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [nil, "Case", "John", "Doe"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_1", "field_2"]
      sheet.row(1).to_a.should == [nil, "Case", "field_1 value", "field_2 value"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[2]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_5", "field_6"]
      sheet.row(1).to_a.should == [nil, "Case", "field_5 value", "field_6 value"]

      sheet = book.worksheets[3]
      sheet.row(0).to_a.should == ["_id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [nil, "Case", "Mother", "Option1 ||| Option2"]

      #Subform "cases_test_form_3" create this sheet because the subform.
      sheet = book.worksheets[4]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_3", "field_4"]
      sheet.row(1).to_a.should == [nil, "Case", "field_3 value", "field_4 value"]

      #Arabic form.
      sheet = book.worksheets[5]
      sheet.row(0).to_a.should == ["_id", "model_type", "arabic_text", "arabic_array"]
    end

    it "converts data to Excel format - subforms selected fields" do
      #Will export a few fields.
      subform = @properties_by_module["primeromodule-cp"]["cases_test_form_1"]["subform_field_1"]
      field = subform.type.properties.select{|p| p.name == "field_2"}.first
      @properties_by_module["primeromodule-cp"]["cases_test_form_1"]["subform_field_1"] = {field.name => field}

      #Will export a few fields.
      subform = @properties_by_module["primeromodule-cp"]["cases_test_form_3"]["subform_field_2"]
      field = subform.type.properties.select{|p| p.name == "field_4"}.first
      @properties_by_module["primeromodule-cp"]["cases_test_form_3"]["subform_field_2"] = {field.name => field}

      #Will export a few fields.
      subform = @properties_by_module["primeromodule-cp"]["cases_test_form_1"]["subform_field_3"]
      field = subform.type.properties.select{|p| p.name == "field_6"}.first
      @properties_by_module["primeromodule-cp"]["cases_test_form_1"]["subform_field_3"] = {field.name => field}

      data = ExcelExporter.export(@records, @properties_by_module, @user, nil)

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [nil, "Case", "John", "Doe"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_2"]
      sheet.row(1).to_a.should == [nil, "Case", "field_2 value"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[2]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_6"]
      sheet.row(1).to_a.should == [nil, "Case", "field_6 value"]

      sheet = book.worksheets[3]
      sheet.row(0).to_a.should == ["_id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [nil, "Case", "Mother", "Option1 ||| Option2"]

      #Subform "cases_test_form_3" create this sheet because the subform.
      sheet = book.worksheets[4]
      sheet.row(0).to_a.should == ["_id", "model_type", "field_4"]
      sheet.row(1).to_a.should == [nil, "Case", "field_4 value"]
    end

  end

end
