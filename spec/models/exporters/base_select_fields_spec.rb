require 'rails_helper'

describe Exporters::BaseSelectFields do

  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    fields = [
      Field.new({"name" => "status",
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
                 "subform_section_id" => subform_section.id,
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
                 "subform_section_id" => subform_section.id,
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
      "editable" => true,
      "name_all" => "Form Section Test 6",
      "description_all" => "Form Section Test 6",
      :fields => fields
    )
    form.save!

    @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["form_section_test_1", "form_section_test_2", "form_section_test_3", "form_section_test_4",
                              "form_section_test_5", "form_section_test_6"],
        associated_record_types: ['case']
    )

    Child.refresh_form_properties

    @user = User.new(:user_name => 'fakeadmin', module_ids: [@primero_module.unique_id])
    @permitted_properties = Child.get_properties_by_module(@user, [@primero_module])
  end

  after :each do
    Child.remove_form_properties
  end

  describe "Custom Exports" do

    describe "Select Format 'Form'" do

      it "should leave one instance of shared fields across forms sections" do
        #Main part of the test:
        #Filter out shared field from others sections, the "shared_field" appears on forms sections
        #form_section_test_1, form_section_test_2 and form_section_test_3, so the code should filter out
        #the forms sections form_section_test_2 and form_section_test_3 from the list.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "form_section_test_4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "form_section_test_5" => {"subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first},
          }
        }

        custom_export_params = {
          "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
          "fields" => ["birth_date", "shared_field", "location_field", "subform_section_1"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)
      end

      it "Should export Forms with regular fields and Subforms" do
        #Main part of the test:
        #Expected in the list of fields regular fields and subforms.
        #Also there is some Forms that contains only subforms those should be in result as well.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_5" => {
                "field_name_5" => Child.properties.select{|p| p.name == "field_name_5"}.first,
                "subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first
            },
            "form_section_test_6" => {
                "subform_section_3" => Child.properties.select{|p| p.name == "subform_section_3"}.first
            },
          }
        }

        custom_export_params = {
          "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
          "forms" => ["form_section_test_5", "form_section_test_6"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)
      end

      it "Should export selected subforms 'Fields'" do
        #Main part of the test:
        #For subforms will export selected fields.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "form_section_test_4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
            "form_section_test_5" => {
              #A few fields of the subforms will be exported.
              "subform_section_1" =>
                  Child.properties.select{|p| p.name == "subform_section_1"}.first.
                  type.properties.select{|p| p.name == "field_name_9"}.
                  map{|p| [p.name, p]}.to_h
            },
          }
        }
        custom_export_params = {
              "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
                #Select only field_name_9 for subform_section_1.
              "fields" => ["birth_date", "shared_field", "location_field", "subform_section_1:field_name_9"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)

      end

    end

    describe "Select Format 'Fields'" do
      it "should left one instance of shared fields across forms sections" do
        #Main part of the test:
        #Filter out shared field from others sections, the "shared_field" appears on forms sections
        #form_section_test_1, form_section_test_2 and form_section_test_3, so the code should filter out
        #the forms sections form_section_test_2 and form_section_test_3 from the list.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first,
                "shared_field" => Child.properties.select{|p| p.name == "shared_field"}.first
            },
            "form_section_test_4" => {"location_field" => Child.properties.select{|p| p.name == "location_field"}.first},
          }
        }

        custom_export_params = {
          "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
          "fields" => ["birth_date", "shared_field", "location_field"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)
      end

      it "Should export Subforms" do
        #Main part of the test:
        #Selected subforms should exported.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first
            },
            "form_section_test_5" => {
                "subform_section_1" => Child.properties.select{|p| p.name == "subform_section_1"}.first
            },
            "form_section_test_6" => {
                "subform_section_3" => Child.properties.select{|p| p.name == "subform_section_3"}.first
            },
          }
        }

        custom_export_params = {
          "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
          "fields" => ["birth_date", "subform_section_1", "subform_section_3"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)
      end

      it "Should export select subforms fields" do
        #Main part of the test:
        #Selected subforms fields should exported.
        expected_forms_sections = {
          "primeromodule-cp"=> {
            "form_section_test_1" => {
                "birth_date" => Child.properties.select{|p| p.name == "birth_date"}.first
            },
            "form_section_test_5" => {
                "field_name_5" => Child.properties.select{|p| p.name == "field_name_5"}.first,
                "subform_section_1" =>
                    Child.properties.select{|p| p.name == "subform_section_1"}.first.
                    type.properties.select{|p| p.name == "field_name_4"}.
                    map{|p| [p.name, p]}.to_h
            },
            "form_section_test_6" => {
              "subform_section_3" =>
                    Child.properties.select{|p| p.name == "subform_section_3"}.first.
                    type.properties.select{|p| p.name == "field_name_6" || p.name == "field_name_7"}.
                    map{|p| [p.name, p]}.to_h
            },
          }
        }

        custom_export_params = {
          "record_id" => "", "record_type" => "case", "module" => "primeromodule-cp",
          "fields" => ["birth_date", "field_name_5",
                       "subform_section_1:field_name_4",
                       "subform_section_3:field_name_6",
                       "subform_section_3:field_name_7"], "model_class" => "Child"
        }.with_indifferent_access

        filtered_fields = Exporters::BaseSelectFields.filter_custom_exports(@permitted_properties, custom_export_params)
        expect(filtered_fields).to eq(expected_forms_sections)
      end

    end

  end

end
