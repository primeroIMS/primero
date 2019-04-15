require 'rails_helper'

describe ConfigurationBundleController, :type => :controller do

  before do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    User.all.each &:destroy
    Role.all.each &:destroy
    fields = [
      Field.new({"name" => "field_name_1",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 1"
                }),
      Field.new({"name" => "field_name_2",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 2"
                }),
      Field.new({"name" => "field_name_3",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 3",
                 "visible" => false
                }),
      Field.new({"name" => "field_name_33",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 33",
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

    fields_subform = [
      Field.new({"name" => "field_name_4",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 4"
               }),
      Field.new({"name" => "field_name_44",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 44",
                 "hide_on_view_page" => true
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
      Field.new({"name" => "field_name_6",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 6"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_3",
      :parent_form=>"case",
      "visible" => false,
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

    fields_subform = [
      Field.new({"name" => "field_name_7",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 7"
               })
    ]
    subform_section = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 1,
        :unique_id=>"subform_section_2",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 2",
        "description_all" => "Details Nested Subform Section 2"
    })
    subform_section.save!

    fields_subform_1 = [
      Field.new({"name" => "field_name_8",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 8"
               }),
      Field.new({"name" => "field_name_9",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 9"
               }),
      Field.new({"name" => "field_name_10",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 10",
                 "visible" => false
               })
    ]
    subform_section_1 = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 51,
        :order => 10,
        :order_subform => 2,
        :unique_id=>"subform_section_3",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform_1,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 3",
        "description_all" => "Details Nested Subform Section 3"
    })
    subform_section_1.save!

    fields = [
      Field.new({"name" => "subform_section_2",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "Subform Section 2"
                }),
      Field.new({"name" => "subform_section_other_test",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section_1.unique_id,
                 "display_name_all" => "Subform Section Other Test"
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

    fields = [
      Field.new({"name" => "field_name_8",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 8"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_5",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 52,
      :order => 19,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 5",
      "description_all" => "Form Section Test 5",
      :fields => fields
    )
    form.save!

    @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["form_section_test_1", "form_section_test_2", "form_section_test_3", "form_section_test_4", "form_section_test_5"],
        associated_record_types: ['case']
    )

    Child.refresh_form_properties

  end

  it "returns a 200 OK status" do
    user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.unique_id])
    session = fake_admin_login user

    get :export_bundle, params: {password: '12345'}
    expect(response).to have_http_status(:ok)
  end

end
