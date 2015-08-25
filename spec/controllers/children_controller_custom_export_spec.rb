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

    primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        associated_form_ids: ["form_section_test_1", "form_section_test_2", "form_section_test_3", "form_section_test_4"],
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

    describe "Select Format: Form and individual fields" do

      it "should left one instance of shared fields across forms sections" do
        childs = [build(:child), build(:child)]
        filters = {"child_status" => {:type => "list", :value => ["Open?scope[child_status]=list", "Open"]}}

        controller.should_receive(:retrieve_records_and_total).with(filters).and_return([childs, 2])
        controller.should_receive(:export_filename).with(childs, Exporters::ExcelExporter).and_return("test_filename")
        controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', "123456").and_return(true)
        controller.stub :render
        
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
        Exporters::ExcelExporter.should_receive(:export).with(childs, expected_forms_sections, @user).and_return('data')

        params = {
          "scope" => {"child_status" => "list||Open?scope[child_status]=list||Open"},
          "custom_export_file_name" => "",
          "password" => "123456",
          "selected_records" => "",
          "custom_exports"=> {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
              "fields" => ["birth_date", "shared_field", "location_field"], "model_class" => "Child"
            },
          "page" => "all", "per_page" => "all", "format" => "xls"
        }
        get :index, params
      end

    end

  end

end
