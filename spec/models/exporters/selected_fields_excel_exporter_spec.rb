require 'rails_helper'

require 'spreadsheet'

module Exporters
  describe SelectedFieldsExcelExporter do
    before :each do
      [Agency, Role, UserGroup, User, PrimeroProgram, Field, FormSection, PrimeroModule, Child].each(&:destroy_all)
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_2", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "cases_test_subform_2",
                                :unique_id => "cases_test_subform_2")
      subform.fields << Field.new(:name => "field_3", :type => Field::TEXT_FIELD, :display_name => "field_3")
      subform.fields << Field.new(:name => "field_4", :type => Field::TEXT_FIELD, :display_name => "field_4")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_3", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "cases_test_form_3",
                             :unique_id => "cases_test_form_3")
      form.fields << Field.new(:name => "subform_field_2", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.id)
      form.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with none subforms fields ######
      form = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "cases_test_form_2",
                             :unique_id => "cases_test_form_2")
      form.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true,
                               :option_strings_text => [{id: 'option1', display_text: 'Option1'}, {id: 'option2', display_text: 'Option2'},
                                                        {id: 'option5', display_text: 'Option5'}, {id: 'option4', display_text: 'Option4'}].map(&:with_indifferent_access))

      form.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform = FormSection.new(:name => "cases_test_subform_1", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "cases_test_subform_1",
                                :unique_id => "cases_test_subform_1")
      subform.fields << Field.new(:name => "field_1", :type => Field::TEXT_FIELD, :display_name => "field_1")
      subform.fields << Field.new(:name => "field_2", :type => Field::TEXT_FIELD, :display_name => "field_2")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_1", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => "cases_test_form_1",
                             :unique_id => "cases_test_form_1")
      form.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form.fields << Field.new(:name => "subform_field_1", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.id)
      form.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      @primero_module = create(:primero_module, name: "CP",
                                                description: "Child Protection",
                                                form_sections: FormSection.all,
                                                associated_record_types: ['case'])

      @records = [create(:child, "first_name" => "John", "last_name" => "Doe",
                           "id" => "00000000001",
                           "relationship"=>"Mother", "array_field"=> ["option1", "option2"],
                           "subform_field_1" => [{"unique_id" =>"1", "field_1" => "field_1 value", "field_2" => "field_2 value"},
                                                 {"unique_id" =>"11", "field_1" => "field_11 value", "field_2" => "field_22 value"},
                                                 {"unique_id" =>"12", "field_1" => "field_12 value", "field_2" => "field_23 value"}],
                           "subform_field_2" => [{"unique_id" =>"2", "field_3" => "field_3 value", "field_4" => "field_4 value"},
                                                 {"unique_id" =>"21", "field_3" => "field_33 value", "field_4" => "field_44 value"}]),
                 create(:child, "first_name" => "Jane", "last_name" => "Doe Doe",
                           "id" => "00000000002",
                           "relationship"=>"Father", "array_field"=> ["option4", "option5"],
                           "subform_field_2" => [{"unique_id" =>"21", "field_3" => "field_31 value", "field_4" => "field_41 value"},
                                                 {"unique_id" =>"211", "field_3" => "field_331 value", "field_4" => "field_441 value"}]),
                 create(:child, "first_name" => "Jimmy", "last_name" => "James", "_id" => "00000000003"),
                 create(:child, "first_name" => "Timmy", "last_name" => "Tom", "_id" => "00000000004"),
                 create(:child, "first_name" => "Charlie", "last_name" => "Sheen", "_id" => "00000000005",
                           "subform_field_1" => [{"unique_id" =>"21"}]),
                 create(:child, "first_name" => "Emilio", "last_name" => "Steves", "_id" => "00000000006",
                           "subform_field_1" => [{"unique_id" =>"99"}], "subform_field_2" => [{"unique_id" =>"66"}])]
      # @user = User.new(:user_name => 'fakeadmin', module_ids: ['primeromodule-cp'])
      @role = create(:role, form_sections: FormSection.all)
      @user = create(:user, :user_name => 'fakeadmin', role: @role, module_ids: [@primero_module.id])
    end

    it "converts data to Excel format" do
      @properties = SelectedFieldsExcelExporter.permitted_fields_to_export(@user, "case")
      data = SelectedFieldsExcelExporter.export(@records, @properties, @user, {})
      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      children = Child.all
      sheet.row(0).to_a.should == ["id", "field_3", "field_4", "subform_field_2:field_3",
                                   "subform_field_2:field_4", "relationship", "array_field",
                                   "field_1", "field_2", "first_name", "last_name",
                                   "subform_field_1:field_1", "subform_field_1:field_2"]
      sheet.row(1).to_a.should == [children[0].id, nil, nil, "field_3 value", "field_4 value",
                                   "Mother", "option1 ||| option2", nil, nil, "John", "Doe",
                                   "field_1 value", "field_2 value"]
      sheet.row(2).to_a.should == [children[0].id, nil, nil, "field_33 value", "field_44 value",
                                   "Mother", "option1 ||| option2", nil, nil, "John", "Doe",
                                   "field_11 value", "field_22 value"]
      sheet.row(3).to_a.should == [children[0].id, nil, nil, nil, nil, "Mother", "option1 ||| option2",
                                   nil, nil, "John", "Doe", "field_12 value", "field_23 value"]
      sheet.row(4).to_a.should == [children[1].id, nil, nil, "field_31 value", "field_41 value",
                                   "Father", "option4 ||| option5", nil, nil, "Jane", "Doe Doe"]
      sheet.row(5).to_a.should == [children[1].id, nil, nil, "field_331 value", "field_441 value",
                                   "Father", "option4 ||| option5", nil, nil, "Jane", "Doe Doe"]
      sheet.row(6).to_a.should == [children[2].id, nil, nil, nil, nil, nil, nil, nil, nil, "Jimmy", "James"]
      sheet.row(7).to_a.should == [children[3].id, nil, nil, nil, nil, nil, nil, nil, nil, "Timmy", "Tom"]
      sheet.row(8).to_a.should == [children[4].id, nil, nil, nil, nil, nil, nil, nil, nil, "Charlie", "Sheen"]
      sheet.row(9).to_a.should == [children[5].id, nil, nil, nil, nil, nil, nil, nil, nil, "Emilio", "Steves"]
      sheet.row(10).to_a.should == []
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

      @properties = SelectedFieldsExcelExporter.permitted_fields_to_export(@user, "case")
      data = SelectedFieldsExcelExporter.export(@records, @properties, @user, {})
      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name",
                                   "subform_field_1:field_2",
                                   "relationship", "array_field",
                                   "subform_field_2:field_4"]
      sheet.row(1).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_2 value",
                                    "Mother", "Option1 ||| Option2",
                                    "field_4 value"]
      sheet.row(2).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_22 value",
                                    "Mother", "Option1 ||| Option2",
                                    "field_44 value"]
      sheet.row(3).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_23 value",
                                    "Mother", "Option1 ||| Option2"]
      sheet.row(4).to_a.should == ["00000000002", "Case", "Jane", "Doe Doe",
                                    nil,
                                    "Father", "Option4 ||| Option5",
                                    "field_41 value"]
      sheet.row(5).to_a.should == ["00000000002", "Case", "Jane", "Doe Doe",
                                    nil,
                                    "Father", "Option4 ||| Option5",
                                    "field_441 value"]
      sheet.row(6).to_a.should == ["00000000003", "Case", "Jimmy", "James"]
      sheet.row(7).to_a.should == ["00000000004", "Case", "Timmy", "Tom"]
      sheet.row(8).to_a.should == ["00000000005", "Case", "Charlie", "Sheen"]
      sheet.row(9).to_a.should == ["00000000006", "Case", "Emilio", "Steves"]
      sheet.row(10).to_a.should == []
    end

  end

end
