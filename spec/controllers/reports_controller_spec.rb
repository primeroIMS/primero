require 'rails_helper'

describe ReportsController do
  before do
    SystemSettings.all.each &:destroy
    @system_settings = SystemSettings.create(default_locale: "en",
                                             primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    User.all.each &:destroy
    Role.all.each &:destroy
    Agency.all.each &:destroy
    Location.all.each &:destroy
    Lookup.all.each &:destroy

    @agency = Agency.create(name_en: 'My English Agency', name_fr: 'My French Agency', name_es: 'My Spanish Agency',
                            name_ar: 'My Arabic Agency', description_en: 'English Description', description_fr: 'French Description',
                            description_es: 'Spanish Description', description_ar: 'Arabic Description', agency_code: 'xyz000')
    @agency2 = Agency.create(name_en: 'My Other English Agency', name_fr: 'My Other French Agency', name_es: 'My Other Spanish Agency',
                            name_ar: 'My Other Arabic Agency', description_en: 'English Description Other', description_fr: 'French Description Other',
                            description_es: 'Spanish Description Other', description_ar: 'Arabic Description Other', agency_code: 'abc999')

    @country = Location.create(admin_level: 0, placename: 'MyCountry', type: 'country', location_code: 'MC01')
    @province1 = Location.create(hierarchy: [@country.location_code], placename: 'Province 1', type: 'province', location_code: 'PR01')
    @town1 = Location.create(hierarchy: [@country.location_code, @province1.location_code], placename: 'Town 1', type: 'city', location_code: 'TWN01')

    @lookup = Lookup.create!(id: "my_lookup", name: "My Lookup",
                             lookup_values: [{id: "display_1", display_text: "Display One"},
                                             {id: "display_2", display_text: "Display Two"},
                                             {id: "display_3", display_text: "Display Three"},
                                             {id: "display_4", display_text: "Display Four"}])

    fields = [
      Field.new(name: "field_name_1", type: "numeric_field", display_name_all: "Field Name 1"),
      Field.new(name: "field_name_2", type: "numeric_field", display_name_all: "Field Name 2"),
      Field.new(name: "field_name_3", type: "numeric_field", display_name_all: "Field Name 3", hide_on_view_page: true),
      Field.new(name: "field_name_4", type: "numeric_field", display_name_all: "Field Name 4", visible: false),
      Field.new(name: "field_lookup", type: Field::SELECT_BOX, display_name: "My Lookup", option_strings_source: "lookup my_lookup"),
      Field.new(name: "field_location", type: Field::SELECT_BOX, display_name: "My Location", option_strings_source: "Location"),
      Field.new(name: "field_other_agency", type: Field::SELECT_BOX, display_name: "My Agency", option_strings_source: "Agency")
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

      @owner = create :user, module_ids: [@primero_module.id], user_name: 'bobby', role_ids: [admin_role.id],
                      user_group_ids: ['Test2'], organization: 'agency-xyz000', location: @town1.location_code

      @owner.stub(:roles).and_return([admin_role])

      @owner2 = create :user, module_ids: [@primero_module.id], user_name: 'fred', role_ids: [role.id],
                       organization: 'agency-abc999', location: @town1.location_code
      @owner2.stub(:roles).and_return([role])

      User.stub(:find_by_user_name).and_return(@owner)
      @case1 = build :child, owned_by: @owner.user_name, field_location: @town1.location_code, field_lookup: 'display_2',
                     field_other_agency: @agency2.id
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

      @report2 = Report.new(
          id: 'testid2',
          name: 'test report 2',
          module_ids: [@primero_module.id],
          record_type: 'case',
          aggregate_by: ['owned_by_location'],
          add_default_filters: true
      )
      @report2.apply_default_filters
      @report2.save!
    end

    #TODO add i18n tests
    it "should build a report for admin" do
      expected_results = {
          ["bobby"] => 2,
          ["fred"] =>1 ,
          ["Total"] => 3,
          [""] => nil
      }
      session = fake_login @owner
      get :show, params: {id: @report.id}
      expect(assigns[:report].has_data?).to be true
      expect(assigns[:report].data[:values]).to eq(expected_results)
    end

    it "should build a report for group member" do
      expected_results = {
          ["fred"] => 1 ,
          ["bobby"] => 0,
          ["Total"] => 1,
          [""] => nil
      }
      session = fake_login @owner2
      get :show, params: {id: @report.id}
      expect(assigns[:report].has_data?).to be true
      expect(assigns[:report].data[:values]).to eq(expected_results)
    end
  end

  describe "permitted_fields_list" do
    before :each do
      controller.should_receive(:authorize!).with(:read_reports, Report).and_return(true)
    end

    it "returns all fields for writeable users" do
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
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
                                     ["Field Name 4", "field_name_4", "numeric_field"],
                                     ["My Lookup", "field_lookup", "select_box"],
                                     ["My Location - Country - ADM 0", "field_location0", "select_box"],
                                     ["My Location - Province - ADM 1", "field_location1", "select_box"],
                                     ["My Location - City - ADM 2", "field_location2", "select_box"],
                                     ["My Agency", "field_other_agency", "select_box"]]]
      ]

      params = {"record_type"=>"case", "module_ids"=>["primeromodule-cp"]}
      get :permitted_field_list, params: params
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
                                      ["Field Name 4", "field_name_4", "numeric_field"],
                                      ["My Lookup", "field_lookup", "select_box"],
                                      ["My Location - Country - ADM 0", "field_location0", "select_box"],
                                      ["My Location - Province - ADM 1", "field_location1", "select_box"],
                                      ["My Location - City - ADM 2", "field_location2", "select_box"],
                                      ["My Agency", "field_other_agency", "select_box"]]]
      ]
      params = {"record_type"=>"case", "module_ids"=>["primeromodule-cp"]}
      get :permitted_field_list, params: params
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(expected_forms_sections)
    end

  end

  describe 'index' do
    before :each do
      controller.should_receive(:authorize!).with(:read_reports, Report).and_return(true)
      permission_list = [
        Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE]),
        Permission.new(resource: Permission::REPORT, actions: [Permission::GROUP_READ])
      ]

      role = Role.new(id: 'role-test',
                      name: 'District Case Coordinator',
                      description: 'District Case Coordinator',
                      group_permission: Permission::GROUP,
                      permissions_list: permission_list)

      user = User.new(user_name: 'fakeadmin',
                      module_ids: [@primero_module.id],
                      role_ids: [role.id])

      session = fake_admin_login(user)
      get :index
    end

    it 'renders index template' do
      expect(response).to render_template(:index)
    end

    it 'has status code ok' do
      expect(response.status).to eq(200)
    end

    describe 'instance variables' do

      before :each do
        Report.all.each(&:destroy)
        @case_load_summary_report = Report.new(
          id: 'case-load-summary',
          name_all: 'Caseload Summary',
          description_all: 'Number of cases for each case worker',
          module_ids: [@primero_module.id],
          record_type: 'case',
          aggregate_by: ['owned_by'],
          add_default_filters: true,
          is_graph: true,
          editable: false
        )
        @case_load_summary_report.save!

        @case_status_report = Report.new(
          id: 'case-status',
          name: 'Case status by case worker',
          module_ids: [@primero_module.id],
          record_type: 'case',
          aggregate_by: ['owned_by_location'],
          add_default_filters: true,
          is_graph: true,
          editable: false
        )
        @case_status_report.save!
      end

      it "assigns the @current_modules" do
        expect(assigns(:current_modules)).to be_nil
      end
      it "assigns the @total_records" do
        expect(assigns(:total_records)).to eq(2)
      end
      it "assigns the @per" do
        expect(assigns(:per)).to eq(20)
      end
      it "assigns the @reports" do
        expect(assigns(:reports)).to include(@case_load_summary_report, @case_status_report)
      end
    end
  end

  describe 'show', search: true do
    before :each do
      controller.should_receive(:authorize!).with(:read_reports, Report).and_return(true)

      Sunspot.remove_all!
      Sunspot.setup(Child) {string 'child_status', as: "child_status_sci".to_sym}

      manager_role = Role.new(id: 'role-manager',
                              name: 'District Case Coordinator',
                              description: 'District Case Coordinator',
                              group_permission: Permission::GROUP,
                              permissions_list: [Permission.new(resource: Permission::REPORT, actions: [Permission::GROUP_READ])])
      case_worker_role = Role.new(id: 'role-case_worker',
                                  name: 'Case Worker',
                                  description: 'Case Worker',
                                  permissions_list: [Permission.new(resource: Permission::REPORT, actions: [Permission::GROUP_READ])])

      Report.all.each(&:destroy)

      # USERS
      # Same user group
      @manager = create :user, module_ids: [@primero_module.id],
                               user_name: 'manager_1',
                               role_ids: [manager_role.id],
                               user_group_ids: ['test-user-group'],
                               organization: 'agency-unicef',
                               location: @town1.location_code

      @manager.stub(:roles).and_return([manager_role])

      @case_worker_1 = create :user, module_ids: [@primero_module.id],
                                     user_name: 'case_worker_1',
                                     role_ids: [case_worker_role.id],
                                     user_group_ids: ['test-user-group'],
                                     organization: 'agency-unicef',
                                     location: @town1.location_code

      @case_worker_2 = create :user, module_ids: [@primero_module.id],
                                     user_name: 'case_worker_2',
                                     role_ids: [case_worker_role.id],
                                     user_group_ids: ['test-user-group'],
                                     organization: 'agency-unicef',
                                     location: @town1.location_code
      # Different user group
      @case_worker_3 = create :user, module_ids: [@primero_module.id],
                                     user_name: 'case_worker_3',
                                     role_ids: [case_worker_role.id],
                                     user_group_ids: ['test-user-different-group'],
                                     organization: 'agency-unicef',
                                     location: @town1.location_code
      @case_worker_1.stub(:roles).and_return([case_worker_role])
      @case_worker_2.stub(:roles).and_return([case_worker_role])
      @case_worker_3.stub(:roles).and_return([case_worker_role])

      # CASES
      @case_1 = build :child, owned_by: @case_worker_1.user_name,
                              field_location: @town1.location_code,
                              field_lookup: 'display_2',
                              field_other_agency: @agency2.id
      @case_2 = build :child, owned_by: @case_worker_1.user_name
      @case_3 = build :child, owned_by: @case_worker_2.user_name
      @case_4 = build :child, owned_by: @case_worker_3.user_name

      [@case_1, @case_2, @case_3, @case_4].each(&:save)

      Sunspot.commit

      default_case_filters = [
        {'attribute' => 'child_status', 'value' => [Record::STATUS_OPEN]},
        {'attribute' => 'record_state', 'value' => ['true']}
      ]
      @report = Report.create_or_update({
        id: 'case-load-summary',
        name_all: 'Caseload Summary',
        description_all: 'Number of cases for each case worker',
        module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
        record_type: 'case',
        aggregate_by: ['owned_by'],
        filters: default_case_filters,
        is_graph: true,
        editable: false
      })

      session = fake_login(@manager)
    end

    it 'renders show template' do
      get :show, params: { id: 'case-load-summary' }
      expect(response).to render_template(:show)
    end

    it 'has status code ok' do
      get :show, params: { id: 'case-load-summary' }
      expect(response.status).to eq(200)
    end

    it 'should have data' do
      get :show, params: { id: 'case-load-summary' }
      expect(assigns[:report].has_data?).to be(true)
    end

    it 'should display empty rows, because exclude_empty_rows flag is not added' do
      get :show, params: { id: 'case-load-summary' }
      expected_report = {
        ['case_worker_1'] => 2,
        ['case_worker_2'] => 1,
        ['case_worker_3'] => 0,
        ['Total'] => 3,
        [''] => nil
      }
      expect(assigns[:report].data[:values]).to eq(expected_report)
    end

    it 'should not display empty rows, because exclude_empty_rows flag is added' do
      # Setting flag
      @report.exclude_empty_rows = true
      @report.save
      get :show, params: { id: 'case-load-summary' }
      expected_report = {
        ['case_worker_1'] => 2,
        ['case_worker_2'] => 1,
        ['Total'] => 3,
        [''] => nil
      }
      expect(assigns[:report].data[:values]).to eq(expected_report)
    end

  end

end
