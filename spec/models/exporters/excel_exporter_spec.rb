require 'rails_helper'

require 'spreadsheet'

module Exporters
  describe ExcelExporter do
    before :each do
      [Role, UserGroup, User, Agency, Field, FormSection, PrimeroProgram, PrimeroModule, Child].each(&:destroy_all)
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_2", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 2, :order => 0, :order_subform => 0, :form_group_id => "Case Form 3",
                                :unique_id => "cases_test_subform_2")
      subform.fields << Field.new(:name => "field_3", :type => Field::TEXT_FIELD, :display_name => "field_3")
      subform.fields << Field.new(:name => "field_4", :type => Field::TEXT_FIELD, :display_name => "field_4")
      subform.save!

      form_a = FormSection.new(:name => "cases_test_form_3", :parent_form => "case", "visible" => true,
                               :order_form_group => 2, :order => 0, :order_subform => 0, :form_group_id => "Case Form 3",
                               :unique_id => "cases_test_form_3")

      form_a.fields << Field.new(:name => "subform_field_2", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.id)
      form_a.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with none subforms fields ######
      form_b = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                               :order_form_group => 1, :order => 0, :order_subform => 0, :form_group_id => "Case Form 2",
                               :unique_id => "cases_test_form_2")
      form_b.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form_b.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true,
                                 :option_strings_text => [{ id: 'option_1', display_text: "Option 1" },
                                                          { id: 'option_2', display_text: "Option 2" }].map(&:with_indifferent_access))

      form_b.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform_1 = FormSection.new(:name => "cases_test_subform_1", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "Case Form 1",
                                :unique_id => "cases_test_subform_1")
      subform_1.fields << Field.new(:name => "field_1", :type => Field::TEXT_FIELD, :display_name => "field_1")
      subform_1.fields << Field.new(:name => "field_2", :type => Field::TEXT_FIELD, :display_name => "field_2")
      subform_1.save!
      #### Build Form Section with subforms fields only ######
      subform_3 = FormSection.new(:name => "cases_test_subform_3", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "Case Form 1",
                                :unique_id => "cases_test_subform_3")
      subform_3.fields << Field.new(:name => "field_5", :type => Field::TEXT_FIELD, :display_name => "field_5")
      subform_3.fields << Field.new(:name => "field_6", :type => Field::TEXT_FIELD, :display_name => "field_6")
      subform_3.save!

      form_c = FormSection.new(:name => "cases_test_form_1", :parent_form => "case", "visible" => true,
                               :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "Case Form 1",
                               :unique_id => "cases_test_form_1")
      form_c.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form_c.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form_c.fields << Field.new(:name => "subform_field_1", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform_1.id)
      form_c.fields << Field.new(:name => "subform_field_3", :type => Field::SUBFORM, :display_name => "subform 3 field", "subform_section_id" => subform_3.id)
      form_c.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      #### Build Form Section with Arabic characters in the form name ######
      form_d = FormSection.new(:name => "Test Arabic فاكيا قد به،. بـ حتى", :parent_form => "case", "visible" => true,
                               :order_form_group => 3, :order => 3, :order_subform => 0, :form_group_id => "Test Arabic")
      form_d.fields << Field.new(:name => "arabic_text", :type => Field::TEXT_FIELD, :display_name => "arabic text")
      form_d.fields << Field.new(:name => "arabic_array", :type => Field::SELECT_BOX, :display_name => "arabic array", :multi_select => true,
                                 :option_strings_text => [{ id: 'option_1', display_text: "عقبت 1" },
                                                          { id: 'option_2', display_text: "لدّفاع 2" }].map(&:with_indifferent_access))
      form_d.save!

      @primero_module = create(:primero_module, unique_id: "primeromodule-cp",
                                                name: "CP",
                                                form_sections: [form_a, form_b, form_c, form_d, subform, subform_1, subform_3])
      @role = create(:role, form_sections: [form_a, form_b, form_c, form_d, subform, subform_1, subform_3], modules: [@primero_module])
      @user = create(:user, :user_name => 'fakeadmin', role: @role)
      @records = [create(:child, "id" => "1234", "first_name" => "John", "last_name" => "Doe", "relationship"=>"Mother",
                                 "array_field"=> ["option_1", "option_2"],
                                 "arabic_text" => "لدّفاع", "arabic_array" => ["النفط", "المشتّتون"],
                                 "subform_field_1" => [{"unique_id" =>"1", "field_1" => "field_1 value", "field_2" => "field_2 value"}],
                                 "subform_field_2" => [{"unique_id" =>"2", "field_3" => "field_3 value", "field_4" => "field_4 value"}],
                                 "subform_field_3" => [{"unique_id" =>"3", "field_5" => "field_5 value", "field_6" => "field_6 value"}])]
      @record_id = Child.last.id
    end

    it "converts data to Excel format" do
      @properties = ExcelExporter.permitted_fields_to_export(@user, "case")
      data = ExcelExporter.export(@records, @properties, @user, nil)
      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]

      sheet.row(0).to_a.should == ["id", "model_type", "field_3", "field_4"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_3 value", "field_4 value"]

      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [@record_id, "Case", "Mother", "Option 1 ||| Option 2"]

      sheet = book.worksheets[2]
      sheet.row(0).to_a.should == ["id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [@record_id, "Case", "John", "Doe"]

      sheet = book.worksheets[3]
      sheet.row(0).to_a.should == ["id", "model_type", "field_1", "field_2"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_1 value", "field_2 value"]

      sheet = book.worksheets[4]
      sheet.row(0).to_a.should == ["id", "model_type", "field_5", "field_6"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_5 value", "field_6 value"]

      #Arabic form.
      sheet = book.worksheets[5]
      sheet.row(0).to_a.should == ["id", "model_type", "arabic_text", "arabic_array"]
    end

    it "converts data to Excel format - subforms selected fields" do
      #Will export a few fields.
      @properties = ExcelExporter.permitted_fields_to_export(@user, "case")
      Field.where(name: %w(field_1 field_3 field_5)).destroy_all

      data = ExcelExporter.export(@records, @properties, @user, nil)

      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["id", "model_type", "field_4"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_4 value"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[1]
      sheet.row(0).to_a.should == ["id", "model_type", "relationship", "array_field"]
      sheet.row(1).to_a.should == [@record_id, "Case", "Mother", "Option 1 ||| Option 2"]

      #Subform "cases_test_form_1" create this sheet because the subform.
      sheet = book.worksheets[2]
      sheet.row(0).to_a.should == ["id", "model_type", "first_name", "last_name"]
      sheet.row(1).to_a.should == [@record_id, "Case", "John", "Doe"]

      sheet = book.worksheets[3]
      sheet.row(0).to_a.should == ["id", "model_type", "field_2"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_2 value"]

      #Subform "cases_test_form_3" create this sheet because the subform.
      sheet = book.worksheets[4]
      sheet.row(0).to_a.should == ["id", "model_type", "field_6"]
      sheet.row(1).to_a.should == [@record_id, "Case", "field_6 value"]
    end

  end

end
