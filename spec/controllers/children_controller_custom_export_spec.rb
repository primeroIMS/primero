require 'spec_helper'

describe ChildrenController do

  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    fields = [
      Field.new({"name" => "child_status",
                 "type" => "text_field",
                 "display_name_all" => "Child Status"
                }),
      Field.new({"name" => "birth_date",
                 "type" => "text_field",
                 "display_name_all" => "Birth Date"
                }),
      ## Shared field ##
      Field.new({"name" => "shared_field",
                 "type" => "text_field",
                 "display_name_all" => "Shared Field"
                }),
      ## Will hide for readonly users.
      Field.new({"name" => "age",
                 "type" => "text_field",
                 "display_name_all" => "age",
                 "hide_on_view_page" => true
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_1",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 50,
      :order => 15,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 1",
      "description_all" => "Form Section Test 1",
      :fields => fields
    )
    form.save!

    fields = [
      Field.new({"name" => "place_birth",
                 "type" => "text_field",
                 "display_name_all" => "Place of birth"
                }),
      ## Shared field ##
      Field.new({"name" => "shared_field",
                 "type" => "text_field",
                 "display_name_all" => "Shared Field"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_2",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 51,
      :order => 16,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 2",
      "description_all" => "Form Section Test 2",
      :fields => fields
    )
    form.save!

    fields = [
      ## Shared field ##
      Field.new({"name" => "shared_field",
                 "type" => "text_field",
                 "display_name_all" => "Shared Field"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_3",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 52,
      :order => 17,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 3",
      "description_all" => "Form Section Test 3",
      :fields => fields
    )
    form.save!

    fields = [
      Field.new({"name" => "location_field",
                 "type" => "text_field",
                 "display_name_all" => "Location Field"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_4",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 53,
      :order => 18,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 4",
      "description_all" => "Form Section Test 4",
      :fields => fields
    )
    form.save!

    fields_subform = [
      Field.new({"name" => "field_name_4",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 4"
               }),
      Field.new({"name" => "field_name_9",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 9"
               })
    ]
    subform_section = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 1,
        :unique_id=>"subform_section_1",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 1",
        "description_all" => "Details Nested Subform Section 1"
    })
    subform_section.save!
    fields = [
      Field.new({"name" => "field_name_5",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 5"
                }),
      Field.new({"name" => "subform_section_1",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "Subform Section 1"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_5",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 54,
      :order => 20,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 5",
      "description_all" => "Form Section Test 5",
      :fields => fields
    )
    form.save!

    fields_subform = [
      Field.new({"name" => "field_name_6",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 6"
               }),
      Field.new({"name" => "field_name_7",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 7"
               }),
      Field.new({"name" => "field_name_8",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 8"
               })
    ]
    subform_section = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 1,
        :unique_id=>"subform_section_3",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 3",
        "description_all" => "Details Nested Subform Section 3"
    })
    subform_section.save!
    fields = [
      Field.new({"name" => "subform_section_3",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "Subform Section 3"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_6",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 54,
      :order => 20,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 6",
      "description_all" => "Form Section Test 6",
      :fields => fields
    )
    form.save!

    primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        associated_form_ids: ["form_section_test_1", "form_section_test_2", "form_section_test_3", "form_section_test_4",
                              "form_section_test_5", "form_section_test_6"],
        associated_record_types: ['case']
    )

    Child.refresh_form_properties

    @user = User.new(:user_name => 'fakeadmin', module_ids: [primero_module.id])
    @session = fake_admin_login @user
  end

  after :each do
    Child.remove_form_properties
  end

  describe "Custom Exports" do

    before :each do
      @childs = [build(:child), build(:child)]
      filters = {"child_status" => {:type => "list", :value => ["Open"]}, "module_id" => {:type => "list", :value => ["primeromodule-cp"]}}

      controller.should_receive(:retrieve_records_and_total).with(filters).and_return([@childs, 2])
      controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', "123456").and_return(true)
      controller.stub :render
    end

    describe "Select Format 'Form'" do
      before :each do
        controller.should_receive(:export_filename).with(@childs, Exporters::ExcelExporter).and_return("test_filename")
      end

      it "should left one instance of shared fields across forms sections" do
        #Main part of the test:
        #Filter out shared field from others sections, the "shared_field" appears on forms sections
        #form_section_test_1, form_section_test_2 and form_section_test_3, so the code should filter out
        #the forms sections form_section_test_2 and form_section_test_3 from the list.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "Form Section Test 4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "Form Section Test 5" => {"subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first},
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::ExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "shared_field", "location_field", "subform_section_1"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

      it "Should export Forms with regular fields and Subforms" do
        #Main part of the test:
        #Expected in the list of fields regular fields and subforms.
        #Also there is some Forms that contains only subforms those should be in result as well.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 5" => {
                "field_name_5" => Child.properties.select{|p| p.name == "field_name_5"}.first,
                "subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first
            },
            "Form Section Test 6" => {
                "subform_section_3" => Child.properties.select{|p| p.name == "subform_section_3"}.first
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::ExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "forms" => ["Form Section Test 5", "Form Section Test 6"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

      it "Should export selected subforms 'Fields'" do
        #Main part of the test:
        #For subforms will export selected fields.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "Form Section Test 4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "Form Section Test 5" => {
              #A few fields of the subforms will be exported.
              "subform_section_1" => 
                  Child.properties.select{|p| p.name == "subform_section_1"}.first.
                  type.properties.select{|p| p.name == "field_name_9"}.
                  map{|p| [p.name, p]}.to_h
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::ExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
                #Select only field_name_9 for subform_section_1.
              "fields" => ["birth_date", "shared_field", "location_field", "subform_section_1:field_name_9"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

      it "Should export forms field that are hide on view page" do
        #Main part of the test:
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => {
              "child_status" => Child.properties.select{|p| p.name == "child_status"}.first,
              "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
              "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first,
              #This field is hidden on the view page, but for this user will be exportable.
              "age" => Child.properties.select{|p| p.name == "age"}.first
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::ExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')
      
        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "forms" => ["Form Section Test 1"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

      it "Should not export forms field that are hide on view page" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [case_permission],
          :permitted_form_ids => ["form_section_test_1"]
        )
        @user.stub(:roles).and_return([role])
        #Main part of the test:
        expected_forms_sections = {
          "primeromodule-cp"=> {
            #Age field is hide on view page and for readonly users should not be exportable.
            "Form Section Test 1" => {
              "child_status" => Child.properties.select{|p| p.name == "child_status"}.first,
              "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
              "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first,
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }

        Exporters::ExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "forms" => ["Form Section Test 1"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

    end

    describe "Select Format 'Fields'" do
      before :each do
        controller.should_receive(:export_filename).with(@childs, Exporters::SelectedFieldsExcelExporter).and_return("test_filename")
      end

      it "should left one instance of shared fields across forms sections" do
        #Main part of the test:
        #Filter out shared field from others sections, the "shared_field" appears on forms sections
        #form_section_test_1, form_section_test_2 and form_section_test_3, so the code should filter out
        #the forms sections form_section_test_2 and form_section_test_3 from the list.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => { 
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "Form Section Test 4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::SelectedFieldsExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "shared_field", "location_field"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "selected_xls"
        }
        get :index, params
      end

      it "Should export Subforms" do
        #Main part of the test:
        #Selected subforms should exported.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first
            },
            "Form Section Test 5" => {
                "subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first
            },
            "Form Section Test 6" => {
                "subform_section_3" => Child.properties.select{|p| p.name == "subform_section_3"}.first
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::SelectedFieldsExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "subform_section_1", "subform_section_3"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "selected_xls"
        }
        get :index, params
      end

      it "Should export select subforms fields" do
        #Main part of the test:
        #Selected subforms fields should exported.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first
            },
            "Form Section Test 5" => {
                "field_name_5" => Child.properties.select{|p| p.name == "field_name_5"}.first,
                "subform_section_1" =>
                    Child.properties.select{|p| p.name == "subform_section_1"}.first.
                    type.properties.select{|p| p.name == "field_name_4"}.
                    map{|p| [p.name, p]}.to_h
            },
            "Form Section Test 6" => {
              "subform_section_3" =>
                    Child.properties.select{|p| p.name == "subform_section_3"}.first.
                    type.properties.select{|p| p.name == "field_name_6" || p.name == "field_name_7"}.
                    map{|p| [p.name, p]}.to_h
            },
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::SelectedFieldsExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "field_name_5",
                           "subform_section_1:field_name_4",
                           "subform_section_3:field_name_6",
                           "subform_section_3:field_name_7"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "selected_xls"
        }
        get :index, params
      end

      it "Should export forms field that are hide on view page" do
        #Main part of the test:
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "Form Section Test 1" => { 
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                #This field is hidden on the view page, but for this user will be exportable.
                "age" => Child.properties.select{|p| p.name == "age"}.first
            },
            "Form Section Test 4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }
        Exporters::SelectedFieldsExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "age", "location_field"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "selected_xls"
        }
        get :index, params
      end

      it "Should not export forms field that are hide on view page" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [case_permission],
          :permitted_form_ids => ["form_section_test_1", "form_section_test_4"]
        )
        @user.stub(:roles).and_return([role])
        #Main part of the test:
        expected_forms_sections = {
          "primeromodule-cp"=> {
            #Age field is hide on view page and for readonly users should not be exportable.
            "Form Section Test 1" => { 
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first
            },
            "Form Section Test 4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "__record__"=> {
              "created_organization" => Child.properties.select{|p| p.name == "created_organization"}.first,
              "created_by_full_name" => Child.properties.select{|p| p.name == "created_by_full_name"}.first,
              "last_updated_at" => Child.properties.select{|p| p.name == "last_updated_at"}.first,
              "last_updated_by" => Child.properties.select{|p| p.name == "last_updated_by"}.first,
              "last_updated_by_full_name" => Child.properties.select{|p| p.name == "last_updated_by_full_name"}.first,
              "posted_at" => Child.properties.select{|p| p.name == "posted_at"}.first,
              "unique_identifier" => Child.properties.select{|p| p.name == "unique_identifier"}.first,
              "record_state" => Child.properties.select{|p| p.name == "record_state"}.first,
              "hidden_name" => Child.properties.select{|p| p.name == "hidden_name"}.first,
              "owned_by_full_name" => Child.properties.select{|p| p.name == "owned_by_full_name"}.first,
              "previously_owned_by_full_name" => Child.properties.select{|p| p.name == "previously_owned_by_full_name"}.first,
              "duplicate" => Child.properties.select{|p| p.name == "duplicate"}.first,
              "duplicate_of" => Child.properties.select{|p| p.name == "duplicate_of"}.first
            }
          }
        }

        Exporters::SelectedFieldsExcelExporter.should_receive(:export).with(@childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "age", "location_field"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "selected_xls"
        }
        get :index, params
      end

    end

  end

end
