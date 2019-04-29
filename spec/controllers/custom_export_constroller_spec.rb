require 'rails_helper'

describe CustomExportsController do

  before :each do
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
    @form = FormSection.new(
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
    @form.save!

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
    @form2 = FormSection.new(
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
    @form2.save!

    fields = [
      Field.new({"name" => "field_name_6",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 6"
                })
    ]
    @form3 = FormSection.new(
      :unique_id => "form_section_test_3",
      :parent_form=>"case",
      "visible" => false,
      :order_form_group => 52,
      :order => 17,
      :order_subform => 0,
      "editable" => true,
      "name_all" => "Form Section Test 3",
      "description_all" => "Form Section Test 3",
      :fields => fields
    )
    @form3.save!

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
    @form4 = FormSection.new(
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
    @form4.save!

    fields = [
      Field.new({"name" => "field_name_8",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 8"
                })
    ]
    @form5 = FormSection.new(
      :unique_id => "form_section_test_5",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 52,
      :order => 19,
      :order_subform => 0,
      "editable" => true,
      "name_all" => "Form Section Test 5",
      "description_all" => "Form Section Test 5",
      :fields => fields
    )
    @form5.save!

    @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["form_section_test_1", "form_section_test_2", "form_section_test_3", "form_section_test_4", "form_section_test_5"],
        associated_record_types: ['case']
    )

    Child.refresh_form_properties

  end

  after :each do
    Child.remove_form_properties
  end

  describe "Custom Exports" do

    describe "permitted_forms_list" do

      it "returns only permitted forms per user" do
        user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.unique_id])
        session = fake_admin_login user
        #This is important to override some stub done in the fake_admin_login method.
        user.stub(:roles).and_return([])
        #Form Section Test 3 is not visible, so will not be in the output.
        expected_forms_sections = [
          {"name"=>"Form Section Test 1", "id"=>"form_section_test_1"},
          {"name"=>"Form Section Test 2", "id"=>"form_section_test_2"},
          {"name"=>"Form Section Test 5", "id"=>"form_section_test_5"},
          {"name"=>"Form Section Test 4", "id"=>"form_section_test_4"}
        ]
        params = {"record_type"=>"case", "module"=>"primeromodule-cp", "only_parent"=>"true"}
        get :permitted_forms_list, params: params
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(expected_forms_sections)
      end

      it "returns only permitted forms per user per role" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::EXPORT_CUSTOM])
        tracing_request_permission = Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::EXPORT_CUSTOM])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => Permission::ALL,
          :permissions_list => [case_permission, tracing_request_permission],
          #Define the forms the user is able to see.
          :form_sections => [@form, @form5]
        )
        user = User.new(
          :user_name => 'fakeadmin',
          :module_ids => [@primero_module.unique_id], :role_ids => [role.id]
        )
        session = fake_admin_login user
        #This is important to override some stub done in the fake_admin_login method.
        user.stub(:roles).and_return([role])
        #Per role definition this is the only forms that user can access.
        expected_forms_sections = [
          {"name"=>"Form Section Test 1", "id"=>"form_section_test_1"},
          {"name"=>"Form Section Test 5", "id"=>"form_section_test_5"}
        ]
        params = {"record_type"=>"case", "module"=>"primeromodule-cp", "only_parent"=>"true"}
        get :permitted_forms_list, params: params
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(expected_forms_sections)
      end

    end

    describe "permitted_fields_list" do

      it "returns only permitted fields per user" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::EXPORT_CUSTOM])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [case_permission],
          :form_sections => [@form, @form2, @form3, @form4]
        )
        user = User.new(:user_name => 'fakeadmin',
                        :module_ids => [@primero_module.unique_id],
                        :role_ids => [role.id])
        session = fake_admin_login user
        #This is important to override some stub done in the fake_admin_login method.
        user.stub(:roles).and_return([role])
        #Form Section Test 3 is not visible, so will not be in the output.
        #Form Section Test 5 is visible, but is not in the permitted list of forms, so will not be in the output.
        expected_forms_sections = [
          #field_name_3 is not visible.
          #field_name_33 is hide on view page, but for this user should be in the list.
          ["Form Section Test 1 (CP)", [["Field Name 1", "field_name_1", "text_field"], ["Field Name 2", "field_name_2", "text_field"],
                                        ["Field Name 33", "field_name_33", "text_field"]]],
          ["Form Section Test 2 (CP)", [["Field Name 5", "field_name_5", "text_field"]]],
          #Subforms and fields.
          #field_name_44 is hide on view page, but for this user should be in the list.
          ["Form Section Test 2:Subform Section 1 (CP)", [["Field Name 4", "subform_section_1:field_name_4", "text_field"],
                                                          ["Field Name 44", "subform_section_1:field_name_44", "text_field"]]],
          #Subforms and fields.
          ["Form Section Test 4:Subform Section 2 (CP)", [["Field Name 7", "subform_section_2:field_name_7", "text_field"]]],
          ["Form Section Test 4:Subform Section Other Test (CP)",
            #field_name_10 is not visible, so will not be in the output.
            [["Field Name 8", "subform_section_other_test:field_name_8", "text_field"],
             ["Field Name 9", "subform_section_other_test:field_name_9", "text_field"]]]
        ]
        params = {"record_type"=>"case", "module"=>"primeromodule-cp"}
        get :permitted_fields_list, params: params
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(expected_forms_sections)
      end

      it "returns only permitted fields for writeable users" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::EXPORT_CUSTOM])
        tracing_request_permission = Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::EXPORT_CUSTOM])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => Permission::ALL,
          :permissions_list => [case_permission, tracing_request_permission],
          #Define the forms the user is able to see.
          :form_sections => [@form, @form2, @form3, @form4, @form5]
        )
        user = User.new(
          :user_name => 'fakeadmin',
          :module_ids => [@primero_module.unique_id], :role_ids => [role.id]
        )
        session = fake_admin_login user
        #This is important to override some stub done in the fake_admin_login method.
        user.stub(:roles).and_return([role])
        #Form Section Test 3 is not visible, so will not be in the output.
        expected_forms_sections = [
          #field_name_3 is not visible.
          #field_name_33 is hide on view page, but for writeable user should be in the list.
          ["Form Section Test 1 (CP)", [["Field Name 1", "field_name_1", "text_field"], ["Field Name 2", "field_name_2", "text_field"],
                                        ["Field Name 33", "field_name_33", "text_field"]]],
          ["Form Section Test 2 (CP)", [["Field Name 5", "field_name_5", "text_field"]]],
          #Subforms and fields.
          #field_name_44 is hide on view page, but for writeable user should be in the list.
          ["Form Section Test 2:Subform Section 1 (CP)", [["Field Name 4", "subform_section_1:field_name_4", "text_field"],
                                                          ["Field Name 44", "subform_section_1:field_name_44", "text_field"]]],
          ["Form Section Test 5 (CP)", [["Field Name 8", "field_name_8", "text_field"]]],
          #Subforms and fields.
          ["Form Section Test 4:Subform Section 2 (CP)", [["Field Name 7", "subform_section_2:field_name_7", "text_field"]]],
          ["Form Section Test 4:Subform Section Other Test (CP)",
            #field_name_10 is not visible, so will not be in the output.
            [["Field Name 8", "subform_section_other_test:field_name_8", "text_field"],
             ["Field Name 9", "subform_section_other_test:field_name_9", "text_field"]]]
        ]
        params = {"record_type"=>"case", "module"=>"primeromodule-cp"}
        get :permitted_fields_list, params: params
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(expected_forms_sections)
      end

      it "returns only permitted fields for readonly users" do
        case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::EXPORT_CUSTOM])
        role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [case_permission],
          :form_sections => [@form, @form2, @form3, @form4, @form5]
        )
        user = User.new(
          :user_name => 'fakeadmin',
          :module_ids => [@primero_module.unique_id], :role_ids => [role.id]
        )
        session = fake_admin_login user
        #This is important to override some stub done in the fake_admin_login method.
        user.stub(:roles).and_return([role])
        #Form Section Test 3 is not visible, so will not be in the output.
        expected_forms_sections = [
          #field_name_3 is not visible.
          #field_name_33 is hide on view page, for readonly users should not be in the list
          ["Form Section Test 1 (CP)", [["Field Name 1", "field_name_1", "text_field"], ["Field Name 2", "field_name_2", "text_field"]]],
          ["Form Section Test 2 (CP)", [["Field Name 5", "field_name_5", "text_field"]]],
          #Subforms and fields.
          #field_name_44 is hide on view page, for readonly users should not be in the list
          ["Form Section Test 2:Subform Section 1 (CP)", [["Field Name 4", "subform_section_1:field_name_4", "text_field"]]],
          ["Form Section Test 5 (CP)", [["Field Name 8", "field_name_8", "text_field"]]],
          #Subforms and fields.
          ["Form Section Test 4:Subform Section 2 (CP)", [["Field Name 7", "subform_section_2:field_name_7", "text_field"]]],
          ["Form Section Test 4:Subform Section Other Test (CP)",
            #field_name_10 is not visible, so will not be in the output.
            [["Field Name 8", "subform_section_other_test:field_name_8", "text_field"],
             ["Field Name 9", "subform_section_other_test:field_name_9", "text_field"]]]
        ]
        params = {"record_type"=>"case", "module"=>"primeromodule-cp"}
        get :permitted_fields_list, params: params
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(expected_forms_sections)
      end

    end

  end

end
