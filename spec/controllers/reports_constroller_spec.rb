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


  describe "build report", search: true do
    before do
      Sunspot.remove_all!
      Sunspot.setup(Child) {string 'child_status', as: "child_status_sci".to_sym}

      Report.all.each &:destroy

      admin_report_permission = Permission.new(resource: Permission::REPORT, actions: [Permission::READ])
      admin_role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [admin_report_permission],
          :permitted_form_ids => ["form_section_test_1"]
      )

      report_permission = Permission.new(resource: Permission::REPORT, actions: [Permission::GROUP_READ])
      role = Role.new(
          :id=> "role-test", :name => "Test Role", :description => "Test Role",
          :group_permission => [],
          :permissions_list => [report_permission],
          :permitted_form_ids => ["form_section_test_1"]
      )

      @owner = create :user, module_ids: [@primero_module.id], user_name: 'bobby', role_ids: [admin_role.id], user_group_ids: ['Test2']
      @owner.stub(:roles).and_return([admin_role])

      @owner2 = create :user, module_ids: [@primero_module.id], user_name: 'fred', role_ids: [role.id]
      @owner2.stub(:roles).and_return([role])

      User.stub(:find_by_user_name).and_return(@owner)
      @case1 = build :child, owned_by: @owner.user_name
      @case2 = build :child, owned_by: @owner.user_name
      @case1.save
      @case2.save

      User.stub(:find_by_user_name).and_return(@owner2)
      @case3 = build :child, owned_by: @owner2.user_name
      @case3.save

      Sunspot.commit

      @report = Report.new(
          id: 'testid',
          name: 'test report',
          module_ids: [@primero_module.id],
          record_type: 'case',
          aggregate_by: ['owned_by'],
          add_default_filters: true
      )
      @report.apply_default_filters
      @report.save!
    end

    it "should build a report for admin" do
      expected_results = {
          ["bobby"] => 2,
          ["fred"] =>1 ,
          [""] => nil
      }
      session = fake_login @owner
      get :show, id: @report.id
      assigns[:report].has_data?.should eq(true)
      assigns[:report].data[:values].should eq(expected_results)
    end

    it "should build a report for group member" do
      expected_results = {
          ["fred"] => 1 ,
          ["bobby"] => 0,
          [""] => nil
      }
      session = fake_login @owner2
      get :show, id: @report.id
      assigns[:report].has_data?.should eq(true)
      assigns[:report].data[:values].should eq(expected_results)
    end
  end

  describe "permitted_fields_list" do
    before :each do
      controller.should_receive(:authorize!).with(:read_reports, Report).and_return(true)
    end

    it "returns all fields for writeable users" do
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
      role = Role.new(
        :id=> "role-test", :name => "Test Role", :description => "Test Role",
        :group_permission => [],
        :permissions_list => [case_permission],
        :permitted_form_ids => ["form_section_test_1"]
      )
      user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.id], :role_ids => [role.id])
      session = fake_admin_login user
      #This is important to override some stub done in the fake_admin_login method.
      user.stub(:roles).and_return([role])
      #Mark the user as readonly.
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
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      role = Role.new(
        :id=> "role-test", :name => "Test Role", :description => "Test Role",
        :group_permission => [],
        :permissions_list => [case_permission],
        :permitted_form_ids => ["form_section_test_1"]
      )
      user = User.new(:user_name => 'fakeadmin', :module_ids => [@primero_module.id], :role_ids => [role.id])
      session = fake_admin_login user
      #This is important to override some stub done in the fake_admin_login method.
      user.stub(:roles).and_return([role])
      #Mark the user as readonly.
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
