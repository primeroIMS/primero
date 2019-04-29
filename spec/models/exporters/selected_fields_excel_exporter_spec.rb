require 'rails_helper'

require 'spreadsheet'

module Exporters
  describe SelectedFieldsExcelExporter do
    before :each do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(:name => "cases_test_subform_2", :parent_form => "case", "visible" => false, "is_nested"=>true,
                                :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_subform_2",
                                :unique_id => "cases_test_subform_2")
      subform.fields << Field.new(:name => "field_3", :type => Field::TEXT_FIELD, :display_name => "field_3")
      subform.fields << Field.new(:name => "field_4", :type => Field::TEXT_FIELD, :display_name => "field_4")
      subform.save!

      form = FormSection.new(:name => "cases_test_form_3", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_3",
                             :unique_id => "cases_test_form_3")
      form.fields << Field.new(:name => "subform_field_2", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.unique_id)
      form.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with none subforms fields ######
      form = FormSection.new(:name => "cases_test_form_2", :parent_form => "case", "visible" => true,
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_2",
                             :unique_id => "cases_test_form_2")
      form.fields << Field.new(:name => "relationship", :type => Field::TEXT_FIELD, :display_name => "relationship")
      form.fields << Field.new(:name => "array_field", :type => Field::SELECT_BOX, :display_name => "array_field", :multi_select => true,
                               :option_strings_text_all => ["Option1", "Option2", "Option5", "Option4"])

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
                             :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "cases_test_form_1",
                             :unique_id => "cases_test_form_1")
      form.fields << Field.new(:name => "first_name", :type => Field::TEXT_FIELD, :display_name => "first_name")
      form.fields << Field.new(:name => "last_name", :type => Field::TEXT_FIELD, :display_name => "last_name")
      form.fields << Field.new(:name => "subform_field_1", :type => Field::SUBFORM, :display_name => "subform field", "subform_section_id" => subform.unique_id)
      form.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      Child.refresh_form_properties

      @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: FormSection.all.map(&:unique_id),
        associated_record_types: ['case']
      )

      @properties_by_module = {"primeromodule-cp" => Child.properties_by_form }

      @records = [Child.new("module_id" => "primeromodule-cp", "first_name" => "John", "last_name" => "Doe",
                           "_id" => "00000000001",
                           "relationship"=>"Mother", "array_field"=> ["option1", "option2"],
                           "subform_field_1" => [{"unique_id" =>"1", "field_1" => "field_1 value", "field_2" => "field_2 value"},
                                                 {"unique_id" =>"11", "field_1" => "field_11 value", "field_2" => "field_22 value"},
                                                 {"unique_id" =>"12", "field_1" => "field_12 value", "field_2" => "field_23 value"}],
                           "subform_field_2" => [{"unique_id" =>"2", "field_3" => "field_3 value", "field_4" => "field_4 value"},
                                                 {"unique_id" =>"21", "field_3" => "field_33 value", "field_4" => "field_44 value"}]),
                 Child.new("module_id" => "primeromodule-cp", "first_name" => "Jane", "last_name" => "Doe Doe",
                           "_id" => "00000000002",
                           "relationship"=>"Father", "array_field"=> ["option4", "option5"],
                           "subform_field_2" => [{"unique_id" =>"21", "field_3" => "field_31 value", "field_4" => "field_41 value"},
                                                 {"unique_id" =>"211", "field_3" => "field_331 value", "field_4" => "field_441 value"}]),
                 Child.new("module_id" => "primeromodule-cp", "first_name" => "Jimmy", "last_name" => "James", "_id" => "00000000003"),
                 Child.new("module_id" => "primeromodule-cp", "first_name" => "Timmy", "last_name" => "Tom", "_id" => "00000000004"),
                 Child.new("module_id" => "primeromodule-cp", "first_name" => "Charlie", "last_name" => "Sheen", "_id" => "00000000005",
                           "subform_field_1" => [{"unique_id" =>"21"}]),
                 Child.new("module_id" => "primeromodule-cp", "first_name" => "Emilio", "last_name" => "Steves", "_id" => "00000000006",
                           "subform_field_1" => [{"unique_id" =>"99"}], "subform_field_2" => [{"unique_id" =>"66"}])]
      @user = User.new(:user_name => 'fakeadmin', module_ids: ['primeromodule-cp'])
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
      PrimeroModule.all.each &:destroy
    end

    it "converts data to Excel format" do
      data = SelectedFieldsExcelExporter.export(@records, @properties_by_module, @user, {})
      book = Spreadsheet.open(StringIO.new(data))
      sheet = book.worksheets[0]
      sheet.row(0).to_a.should == ["_id", "model_type", "first_name", "last_name",
                                   "subform_field_1:field_1", "subform_field_1:field_2",
                                   "relationship", "array_field",
                                   "subform_field_2:field_3", "subform_field_2:field_4"]
      sheet.row(1).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_1 value" , "field_2 value",
                                    "Mother", "Option1 ||| Option2",
                                    "field_3 value", "field_4 value"]
      sheet.row(2).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_11 value", "field_22 value",
                                    "Mother", "Option1 ||| Option2",
                                    "field_33 value", "field_44 value"]
      sheet.row(3).to_a.should == ["00000000001", "Case", "John", "Doe",
                                    "field_12 value", "field_23 value",
                                    "Mother", "Option1 ||| Option2"]
      sheet.row(4).to_a.should == ["00000000002", "Case", "Jane", "Doe Doe",
                                    nil, nil,
                                    "Father", "Option4 ||| Option5",
                                    "field_31 value", "field_41 value"]
      sheet.row(5).to_a.should == ["00000000002", "Case", "Jane", "Doe Doe",
                                    nil, nil,
                                    "Father", "Option4 ||| Option5",
                                    "field_331 value", "field_441 value"]
      sheet.row(6).to_a.should == ["00000000003", "Case", "Jimmy", "James"]
      sheet.row(7).to_a.should == ["00000000004", "Case", "Timmy", "Tom"]
      sheet.row(8).to_a.should == ["00000000005", "Case", "Charlie", "Sheen"]
      sheet.row(9).to_a.should == ["00000000006", "Case", "Emilio", "Steves"]
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

      data = SelectedFieldsExcelExporter.export(@records, @properties_by_module, @user, {})
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
