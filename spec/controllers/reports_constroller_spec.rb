require 'spec_helper'

describe ReportsController do

  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    User.all.each &:destroy
    Role.all.each &:destroy
    fields = [
      Field.new({"name" => "field_name_1",
                 "type" => "numeric_field",
                 "display_name_all" => "Field Name 1"
                }),
      Field.new({"name" => "field_name_2",
                 "type" => "numeric_field",
                 "display_name_all" => "Field Name 2"
                }),
      Field.new({"name" => "field_name_3",
                 "type" => "numeric_field",
                 "display_name_all" => "Field Name 3",
                 "hide_on_view_page" => true
                }),
      Field.new({"name" => "field_name_4",
                 "type" => "numeric_field",
                 "display_name_all" => "Field Name 4",
                 "visible" => false
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

    @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        associated_form_ids: ["form_section_test_1"],
        associated_record_types: ['case']
    )

  end

  describe "permitted_fields_list" do
    before :each do
      controller.should_receive(:authorize!).with(:read, Report).and_return(true)
    end

    it "returns all fields for writeable users" do
      user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.id])
      session = fake_admin_login user
      #This is important to override some stub done in the fake_admin_login method.
      user.stub(:roles).and_return([])
      #Mark the user as readonly.
      controller.should_receive(:can?).with(:update, Child).and_return(true)
      expected_forms_sections = [
        #field_name_4 is hide on view page, for writeable users should be in the list.
        ["Form Section Test 1 (CP)", [["Field Name 1", "field_name_1", "numeric_field"],
                                      ["Field Name 2", "field_name_2", "numeric_field"],
                                      ["Field Name 3", "field_name_3", "numeric_field"],
                                      ["Field Name 4", "field_name_4", "numeric_field"]]],
      ]
      params = {"record_type"=>"case", "module_ids"=>["primeromodule-cp"]}
      get :permitted_field_list, params
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(expected_forms_sections)
    end

    it "returns only permitted fields for readonly users" do
      user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.id])
      session = fake_admin_login user
      #This is important to override some stub done in the fake_admin_login method.
      user.stub(:roles).and_return([])
      #Mark the user as readonly.
      controller.should_receive(:can?).with(:update, Child).and_return(false)
      controller.should_receive(:can?).with(:create, Child).and_return(false)
      expected_forms_sections = [
        #field_name_3 is not visible.
        #field_name_4 is hide on view page, for readonly users should not be in the list.
        ["Form Section Test 1 (CP)", [["Field Name 1", "field_name_1", "numeric_field"], 
                                      ["Field Name 2", "field_name_2", "numeric_field"],
                                      ["Field Name 4", "field_name_4", "numeric_field"]]],
      ]
      params = {"record_type"=>"case", "module_ids"=>["primeromodule-cp"]}
      get :permitted_field_list, params
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(expected_forms_sections)
    end

  end

end
