require 'rails_helper'

def inject_export_generator( fake_export_generator, child_data )
	ExportGenerator.stub(:new).with(child_data).and_return( fake_export_generator )
end

def stub_out_export_generator(child_data = [])
	inject_export_generator( stub_export_generator = stub(ExportGenerator) , child_data)
	stub_export_generator.stub(:child_photos).and_return('')
	stub_export_generator
end

def stub_out_child_get(mock_child = double(Child))
	Child.stub(:get).and_return( mock_child )
	mock_child
end

describe ChildrenController, :type => :controller do

  before do
    SystemSettings.all.each &:destroy
    @system_settings = SystemSettings.create(default_locale: "en",
      primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  before :each do |example|
    Child.any_instance.stub(:field_definitions).and_return([])
    Child.any_instance.stub(:permitted_properties).and_return(Child.properties)
    unless example.metadata[:skip_session]
      @user = User.new(:user_name => 'fakeadmin')
      @session = fake_admin_login @user
    end
  end

  def mock_child(stubs={})
    @mock_child ||= mock_model(Child, stubs).as_null_object
  end

  def stub_form(stubs={})
    form = stub_model(FormSection) do |form|
      form.fields = [stub_model(Field)]
    end
  end

  describe '#authorizations' do
    describe 'collection' do
      it "GET index" do
        Ability.any_instance.stub(:can?).with(anything, Child).and_return(false)
        Ability.any_instance.stub(:can?).with(anything, Dashboard).and_return(false)
        get :index
        expect(response).to be_forbidden
      end

      xit "GET search" do
        @controller.current_ability.should_receive(:can?).with(:index, Child).and_return(false)
        get :search
        response.status.should == 403
      end


      it "GET new" do
        @controller.stub(:get_form_sections).and_return({})
        @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false)
        get :new
        response.status.should == 403
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false)
        post :create
        response.status.should == 403
      end

    end

    describe 'member' do
      before :each do
        User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
        @child = Child.create('last_known_location' => "London", :short_id => 'short_id', :created_by => "uname")
        # @child_arg = hash_including("_id" => @child.id)
      end

      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @child).and_return(false)
         get :show, params: {id: @child.id}
         response.status.should == 403
      end

      it "PUT update" do
        @controller.current_ability.should_receive(:can?).with(:update, @child).and_return(false)
        put :update, params: {id: @child.id}
        response.status.should == 403
      end

      it "PUT edit_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child).and_return(false)
        put :edit_photo, params: {id: @child.id}
        response.status.should == 403
      end

      it "PUT update_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child).and_return(false)
        put :update_photo, params: {id: @child.id}
        response.status.should == 403
      end

      it "PUT select_primary_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child).and_return(false)
        put :select_primary_photo, params: {child_id: @child.id, photo_id: 0}
        response.status.should == 403
      end

    end
  end

  describe "GET index" do

    #TODO: We need a whole new test suite for the index. We need to test the following:
    #         * filters are being generated correctly from params.
    #         * Test that the default filtering is correctly initialized
    #         * right subset of data based on current user
    #         * definitely have tests for active/inactive
    #         * pagination
    #         * sorting


    #TODO: Leaving this code as a potential basis for future refactoring of controller tests
    shared_examples_for "viewing children by user with access to all data" do
      describe "when the signed in user has access all data" do
        before do
          fake_field_admin_login
          @options ||= {}
          @stubs ||= {}
        end

        it "should assign all children as @children" do
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          children = mock_child(@stubs)
          scope ||= {"child_status"=>"single||open"}
          children.stub(:paginate).and_return(children)
          Child.should_receive(:list_records).with({"child_status" => {:type => "single", :value => Record::STATUS_OPEN}}, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, ["fakefieldadmin"], nil, nil).and_return(children)

          get :index, params: {scope: scope}
          assigns[:children].should == children
        end
      end
    end

    #TODO: Leaving this test around for now
    context "viewing all children" do
      #before { @stubs = { :reunited? => false } }
      context "when status is passed for admin" do
        before { scope = {} }
        before {@options = {:startkey=>["all"], :endkey=>["all", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_name}}
        it_should_behave_like "viewing children by user with access to all data"
      end
    end

    describe "import_file" do
      it 'import zip password protected zip files' do
        permission_import = Permission.new(resource: Permission::CASE, actions: [Permission::IMPORT])
        Role.create(id: 'importer', name: 'importer', permissions_list: [permission_import], group_permission: Permission::GROUP)

        @user = User.new(:user_name => 'importing_user', :role_ids => ['importer'])
        @session = fake_login @user

        post :import_file, params: {import_file: uploadable_zip_file, password: 'password', import_type: 'guess'}
        expect(response).to redirect_to action: :index
        expect(flash[:notice]).to eq I18n.t('imports.successful')
      end
    end

    describe "export_filename" do
      before :each do
        @password = 's3cr3t'
        @session = fake_field_worker_login
        @child1 = Child.new(:id => "1", :unique_identifier=> "unique_identifier-1")
        @child2 = Child.new(:id => "2", :unique_identifier=> "unique_identifier-2")
      end

      context 'when there are multiple records' do
        before do
          Child.stub :list_records => double(:results => [ @child1, @child2 ], :total => 2)
        end

        it 'exports records' do
          get :index, format: :csv
          expect(response.header['Content-Type']).to include 'application/zip'
        end

        context 'when the file name is provided' do
          before do
            @custom_export_file_name = "user_file_name"
          end

          it 'exports using the file name provided' do
            get :index, params: {password: @password, custom_export_file_name: @custom_export_file_name}, format: :csv
            expect(response.header['Content-Type']).to include('application/zip')
            expect(response.header['Content-Disposition']).to include("#{@custom_export_file_name}.csv.zip")
          end
        end

        context 'when the file name is not provided' do
          it 'uses the user_name and model_name to create the file name' do
            get :index, params: {password: @password}, format: :csv
            expect(response.header['Content-Type']).to include('application/zip')
            expect(response.header['Content-Disposition']).to include("#{@session.user.user_name}-child.csv.zip")
          end
        end
      end

      context 'when there is only 1 record' do
        before do
          Child.stub :list_records => double(:results => [ @child1 ], :total => 1)
        end

        it 'exports records' do
          get :index, format: :csv
          expect(response.header['Content-Type']).to include 'application/zip'
        end

        context 'when the file name is provided' do
          before do
            @custom_export_file_name = "user_file_name"
          end

          it 'exports using the file name provided' do
            get :index, params: {password: @password, custom_export_file_name: @custom_export_file_name}, format: :csv
            expect(response.header['Content-Type']).to include('application/zip')
            expect(response.header['Content-Disposition']).to include("#{@custom_export_file_name}.csv.zip")
          end
        end

        context 'when the file name is not provided' do
          it 'uses the unique_identifier to create the file name' do
            get :index, params: {password: @password}, format: :csv
            expect(response.header['Content-Type']).to include('application/zip')
            expect(response.header['Content-Disposition']).to include("#{@child1.unique_identifier}.csv.zip")
          end
        end
      end
    end

    describe "permissions to view lists of case records", search: true, skip_session: true do

      before do

        Sunspot.setup(Child) {string 'child_status', as: "child_status_sci".to_sym}

        User.all.each{|u| u.destroy}
        Child.all.each{|c| c.destroy}
        Sunspot.remove_all!

        permission_case = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        roles = [Role.new(permissions_list: [permission_case])]

        Child.any_instance.stub(:child_status).and_return(Record::STATUS_OPEN)
        @case_worker1 = create(:user)
        @case_worker1.stub(:roles).and_return(roles)
        @case_worker2 = create(:user)
        @case_worker2.stub(:roles).and_return(roles)

        @case1 = create(:child, owned_by: @case_worker1.user_name)
        @case2 = create(:child, owned_by: @case_worker1.user_name)
        @case3 = create(:child, owned_by: @case_worker2.user_name)

        Sunspot.commit

      end


      it "loads only cases owned by or associated with this user" do
        session = fake_login @case_worker1
        get :index
        expect(assigns[:children]).to match_array([@case1, @case2])
      end

    end

    describe "phonetic search", search: true, skip_session: true do

      before do
        #TODO For some reason needs to reload the phonetic fields
        #     without those fields phonetic search will not work.
        #     When run only children_controller_spec the phonetic
        #     fields are there, but when run all the test cases
        #     phonetic fields are not there.
        Sunspot.setup(Child) do
          Child.searchable_phonetic_fields.each {|f| text f, as: "#{f}_ph".to_sym}
        end

        User.all.each{|u| u.destroy}
        Child.all.each{|c| c.destroy}
        Sunspot.remove_all!

        permission_case = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        roles = [Role.new(permissions_list: [permission_case])]
        @case_worker = create(:user)
        @case_worker.stub(:roles).and_return(roles)
      end

      context "when search query is the exact english name" do
        it "should find english name" do
          names = ["Kevin", "Albin", "Alder", "Michael", "Aubrey", "Christian"]
          @children_cases = []
          names.each do |c|
            child = create(:child, name: c, owned_by: @case_worker.user_name)
            @children_cases.push(child)
          end
          Sunspot.commit

          session = fake_login @case_worker
          get :index, params: {query: @children_cases.first.name}
          expect(assigns[:children]).to match_array([@children_cases.first])
        end
      end

      context "when search query is a shortcurt" do
        it "should find no name" do
          names = ["Kevin", "Albin", "Alder", "Michael", "Aubrey", "Christian"]
          @children_cases = []
          names.each do |c|
            child = create(:child, name: c, owned_by: @case_worker.user_name)
            @children_cases.push(child)
          end
          Sunspot.commit

          session = fake_login @case_worker

          get :index, params: {query: 'Chris'}
          expect(assigns[:children]).to match_array([])

          get :index, params: {query: 'Mike'}
          expect(assigns[:children]).to match_array([])
        end
      end

      context "when search query is a Mahmoud name variant" do
        it "should find all names" do
          names = ["Mahmoud", "Mahmud", "Mahmood"]

          @children_cases = []
          names.each do |c|
            child = create(:child, name: c, owned_by: @case_worker.user_name)
            @children_cases.push(child)
          end
          Sunspot.commit

          session = fake_login @case_worker
          get :index, params: {query: @children_cases.first.name}
          expect(assigns[:children]).to have(@children_cases.count).things
        end
      end

      context "when query search is Abdul prefix" do
        it "shoud find at least 20" do

          #29 arabic names with Abdul prefix
          names = ["Abdul-Baseer","Abdul-Basir", "Abdul-Basit", "Abdul-Batin", "Abdul-Dhahir", "Abdul-Fattah", "Abdul-Ghafaar", "Abdul-Ghaffar", "Abdul-Ghaffar", "Abdul-Ghafoor", "Abdul-Ghafur", "Abdul-Ghafur", "Abdul-Ghani", "Abdul-Ghani", "Abdul-Hadi", "Abdul-Hadi", "Abdul-Hafeedh", "Abdul-Hafeez", "Abdul-Hafiz", "Abdul-Hakam", "Abdul-Hakeem", "Abdul-Hakeem", "Abdul-Hakim", "Abdul-Haleem", "Abdul Haleem", "Abdul-Halim", "Abdul-Hameed", "Abdul-Hameed", "Abdul-Hamid"]

          @children_cases = []

          names.each do |c|
            child = create(:child, name: c, owned_by: @case_worker.user_name)
            @children_cases.push(child)
          end

          Sunspot.commit

          session = fake_login @case_worker

          get :index, params: {query: 'Abdool'}
          expect(assigns[:children]).to have_at_least(20).things
        end
      end

      context "when there is a compound name with space or dash" do
        it "shoud find compound name first and second name phonetically" do

          #29 arabic names with Abdul prefix
          names = ["Abdul Haseeb", "Abdul-Nasser"]

          @children_cases = []
          names.each do |c|
            child = create(:child, name: c, owned_by: @case_worker.user_name)
            @children_cases.push(child)
          end

          Sunspot.commit

          session = fake_login @case_worker

          get :index, params: {query: 'Abdool'}
          expect(assigns[:children]).to have(2).things

          get :index, params: {query: 'Hasib'}
          expect(assigns[:children]).to match_array([@children_cases.first])

          get :index, params: {query: 'Nassir'}
          expect(assigns[:children]).to match_array([@children_cases.last])

          get :index, params: {query: 'Abdool-Hasib'}
          expect(assigns[:children]).to match_array([@children_cases.first])

          get :index, params: {query: 'Abdool Nassir'}
          expect(assigns[:children]).to match_array([@children_cases.first, @children_cases.last])
        end
      end
    end

    describe "export all to PDF/CSV/CPIMS/Photo Wall" do
      before do
        fake_field_admin_login
        @params ||= {}
        controller.stub :paginated_collection => [], :render => true
      end
      it "should flash notice when exporting no records" do
        format = "unhcr_csv"
        #TODO - investigate this params.merge
        @params.merge!(:format => format)
        get :index, @params
        #flash[:notice].should == "No Records Available!"
        expect(flash[:notice]).to eq("Generating the export file: fakefieldadmin-child-UNHCR.csv")
      end
    end

    describe "Display manager information", skip_session: true do
      render_views

      it "should display information for user manager" do
        p_module = build :primero_module
        user = User.new(:user_name => 'fakeadmin', :is_manager => true)
        session = fake_admin_login user

        user.stub(:modules).and_return([p_module], [p_module], [p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should appears in the body if the user is a manager.
        response.body.should match(/<h3>Field\/Case\/Social Worker:<\/h3>/)
        response.body.should match(/<th\s+(.*)>\s*Social Worker\s*<\/th>/)

        #That header should not appears in the body if the user is a manager.
        response.body.should_not match(/<th\s+(.*)>\s*Name\s*<\/th>/)
        response.body.should_not match(/<th\s+(.*)>\s*Survivor Code\s*<\/th>/)
      end

      it "should not display information for user not manager" do
        p_module = build :primero_module
        user = User.new(:user_name => 'fakeadmin', :is_manager => false)
        session = fake_admin_login user
        user.stub(:modules).and_return([p_module], [p_module], [p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should not appears in the body if the user is not a manager.
        response.body.should_not match(/<h3>Field\/Case\/Social Worker:<\/h3>/)
        response.body.should_not match(/<th\s+(.*)>\s*Social Worker\s*<\/th>/)

        #That header should appears in the body if the user is not a manager.
        response.body.should match(/<th\s+(.*)>\s*Name\s*<\/th>/)
        response.body.should match(/<th\s+(.*)>\s*Survivor Code\s*<\/th>/)
      end
    end

    describe "Filter and Search", search: true, skip_session: true do

      before :each do
        @user = fake_admin_login User.new(:user_name => 'test_user')

        FormSection.all.each &:destroy
        fields = [
            Field.new({"name" => "child_status",
                       "type" => "text_field",
                       "display_name_all" => "Child Status"
                      }),
            Field.new({"name" => "marked_for_mobile",
                     "type" => "tick_box",
                     "tick_box_label_all" => "Yes",
                     "display_name_all" => "Marked for mobile?",
                     "create_property" => false
                    }),
            Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    })]
        form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
            )
        form.save!
        Child.any_instance.stub(:field_definitions).and_return(fields)
        Child.refresh_form_properties

        Sunspot.setup(Child) do
          string 'child_status', as: "child_status_sci".to_sym
          boolean 'marked_for_mobile', as: 'marked_for_mobile_b'.to_sym
          integer 'age', as: 'age_i'.to_sym
        end

        Child.all.each &:destroy

        Sunspot.remove_all!

        #TODO - remove owned_by_location_district references
        #TODO - create test like this in home controller for dashboard

        @child_1 = create(:child, name: "Name 1", child_status: Record::STATUS_OPEN, age: "5", case_id_display: "UN-TEST-0001",
                          approval_status_bia: "Approved", bia_approved_date: "25-Oct-2016")
        @child_age_7 = create(:child, name: "Name 2", child_status: Record::STATUS_OPEN, age: "7", owned_by_agency: 'agency-1',
                              owned_by_location: 'TEST::Bonthe', case_id_display: "UN-TEST-0002", approval_status_bia: "Approved", bia_approved_date: "30-Oct-2016")
        create(:child, name: "Name 3", child_status: Record::STATUS_CLOSED, age: "7", case_id_display: "UN-TEST-0003")
        @child_age_15 = create(:child, name: "Name 4", child_status: Record::STATUS_OPEN, age: "15", owned_by_agency: 'agency-1',
                               owned_by_location: 'TEST::Bonthe', case_id_display: "UN-TEST-0004", approval_status_bia: "Approved", bia_approved_date: "20-Oct-2016")
        create(:child, name: "Name 5", child_status: Record::STATUS_CLOSED, age: "15", case_id_display: "UN-TEST-0005")
        @child_age_21 = create(:child, name: "Name 6", child_status: Record::STATUS_OPEN, age: "21", owned_by_agency: 'agency-2',
                               owned_by_location: 'TEST::Port Loko', case_id_display: "UN-TEST-0006", approval_status_bia: "Approved", bia_approved_date: "30-Oct-2015")
        create(:child, name: "Name 7", child_status: Record::STATUS_CLOSED, age: "21", owned_by_agency: 'agency-3', owned_by_location: 'TEST::Port Loko', case_id_display: "UN-TEST-0007")
        create(:child, name: "Name 8", child_status: Record::STATUS_OPEN, marked_for_mobile: false, case_id_display: "UN-TEST-0008")
        create(:child, name: "Name 9", child_status: Record::STATUS_CLOSED, marked_for_mobile: true, case_id_display: "UN-TEST-0009")
        @child_mobile_10= create(:child, name: "Name 10", child_status: Record::STATUS_OPEN, marked_for_mobile: true, owned_by_agency: 'agency-4', case_id_display: "UN-TEST-0010")
        @child_mobile_11 = create(:child, name: "Name 11", child_status: Record::STATUS_OPEN, marked_for_mobile: true, owned_by_agency: 'agency-4', case_id_display: "UN-TEST-0011")

        Sunspot.commit
      end

      after :all do
        FormSection.all.each &:destroy
        Child.all.each &:destroy
        Sunspot.remove_all!
        Sunspot.commit
        Child.remove_form_properties
      end

      context "filter" do
        context "by age range" do
          it "should filter by one range" do
            get :index, params: {scope: {child_status: "list||#{Record::STATUS_OPEN}", age: "range||6-11"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["6", "11"]]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(1)
            expect(assigns[:children].first).to eq(@child_age_7)
          end

          it "should filter more than one range" do
            get :index, params: {scope: {child_status: "list||#{Record::STATUS_OPEN}", age: "range||6-11||12-17"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["6", "11"], ["12", "17"]]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(2)
            expect(assigns[:children]).to eq([@child_age_7, @child_age_15])
          end

          it "should filter with open range" do
            get :index, params: {"scope"=>{"child_status"=>"list||#{Record::STATUS_OPEN}", "age"=>"range||18 "}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["18 "]]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(1)
            expect(assigns[:children].first).to eq(@child_age_21)
          end
        end

        context "by mobile" do
          it "should filter by marked for mobile true" do
            get :index, params: {"scope" => {"child_status" => "list||#{Record::STATUS_OPEN}", "marked_for_mobile" => "single||true"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "marked_for_mobile"=>{:type=>"single", :value=>true}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(2)
            expect(assigns[:children]).to include(@child_mobile_10, @child_mobile_11)
          end
        end

        context "by agency" do
          it "should filter by agency agency_1" do
            get :index, params: {"scope"=>{"child_status"=>"list||#{Record::STATUS_OPEN}", "owned_by_agency"=>"list||agency-1"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "owned_by_agency"=>{:type=>"list", :value=>["agency-1"]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(2)
            expect(assigns[:children]).to include(@child_age_7, @child_age_15)
          end

          it "should filter by agency agency_1 and agency_4" do
            get :index, params: {"scope"=>{"child_status"=>"list||#{Record::STATUS_OPEN}", "owned_by_agency"=>"list||agency-1||agency-4"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "owned_by_agency"=>{:type=>"list", :value=>["agency-1", "agency-4"]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(4)
            expect(assigns[:children]).to include(@child_age_7, @child_age_15, @child_mobile_10, @child_mobile_11)
          end
        end

        #TODO - change district to reporting location
        context "by_district" do
          xit "should filter by district Bonthe" do
            get :index, params: {"scope"=>{"child_status"=>"list||#{Record::STATUS_OPEN}", "owned_by_location_district"=>"list||Bonthe"}}

            filters = {"child_status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "owned_by_location_district"=>{:type=>"list", :value=>["Bonthe"]}}
            expect(assigns[:filters]).to eq(filters)
            expect(assigns[:children].length).to eq(2)
            expect(assigns[:children]).to include(@child_age_7, @child_age_15)
          end
        end
      end
      context "search" do
        context "by case ID" do
          it "should find cases" do
            get :index, params: {"query"=> "UN-TEST-0002"}
            expect(assigns[:children].length).to eq(1)
            expect(assigns[:children].first).to eq(@child_age_7)
          end
        end
      end
      context "dasboard links" do
        it "should list BIA approvals within a date range" do
          get :index, params: {"scope" => {"child_status" => "list||#{Record::STATUS_OPEN}", "approval_status_bia" => "list||Approved",
                                           "bia_approved_date" => "date_range||22-10-2016.02-11-2016"}}
          expect(assigns[:children]).to match_array([@child_1, @child_age_7])
        end
      end
    end
  end

  describe "Search terms", search: true, skip_session: true do
    before :each do
      @user = fake_admin_login User.new(:user_name => 'test_user')
      Child.all.each &:destroy
      Sunspot.remove_all!
      @child1 = create(:child, name: "Jonh Smith", child_status: Record::STATUS_OPEN, owned_by: @user.user_name)
      @child2 = create(:child, name: "James Carter", child_status: Record::STATUS_OPEN, owned_by: @user.user_name)
      Sunspot.commit
    end

    after :all do
      Child.all.each &:destroy
      Sunspot.remove_all!
      Sunspot.commit
    end

    it "should treated as terms words separated by blank" do
      get :index, params: {"query"=> "Robert Smith"}
      expect(assigns[:children]).to match_array([@child1])

      get :index, params: {"query"=> "Robert Smith Jonathan Carter"}
      expect(assigns[:children]).to match_array([@child2, @child1])
    end

    it "should treated as phrase words double quoted" do
      get :index, params: {"query"=> "\"Robert Smith\""}
      expect(assigns[:children]).to match_array([])

      get :index, params: {"query"=> "\"Jonh Smith\" \"James Carter\""}
      expect(assigns[:children]).to match_array([@child2, @child1])
    end
  end

  describe "GET show" do
    it 'does not assign child name in page name' do
      child = build :child, :unique_identifier => "1234"
      controller.stub :render
      get :show, params: {id: child.id}
      assigns[:page_name].should == "View Case #{child.short_id}"
    end

    it "assigns the requested child" do
      Child.any_instance.stub(:allowed_formsections).and_return({})
      child = Child.new(:module_id => 'primeromodule-cp')
      Child.stub(:get).with("37").and_return(child)
      get :show, params: {id: '37'}
      assigns[:child].should equal(child)
    end

    it 'should not fail if primary_photo_id is not present' do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", :created_by => "uname")
      Child.stub(:get).with("37").and_return(child)
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

      controller.stub :render
      get :show, params: {format: 'csv', id: '37'}
    end

    it "should set current photo key as blank instead of nil" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", :created_by => "uname")
      Child.stub(:get).with("37").and_return(child)
      assigns[child[:current_photo_key]] == ""
      get :show, params: {format: 'json', id: '37'}
    end


    it "retrieves the grouped forms that are permitted to this user and child" do
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      child = mock_child({:module_id => 'primeromodule-cp'})
      Child.stub(:allowed_formsections).and_return(grouped_forms)
      Child.stub(:get).with("37").and_return(child)
      allow(child).to receive(:display_id).and_return('37')
      allow(child).to receive(:owned_by).and_return('test_owner')
      get :show, params: {id: '37'}
      assigns[:form_sections].should == grouped_forms
      #TODO: Do we need to test ordering of forms in the controller?
    end

    it "should flash an error and go to listing page if the resource is not found" do
      Child.stub(:get).with("invalid record").and_return(nil)
      get :show, params: {id: 'invalid record'}
      flash[:error].should == "Child with the given id is not found"
      response.should redirect_to(:action => :index)
    end

    #TODO - duplicates fetch commented out for performance reasons
    xit "should include duplicate records in the response" do
      child = mock_child({:module_id => 'primeromodule-cp'})
      Child.stub(:allowed_formsections).and_return({})
      Child.stub(:get).with("37").and_return(child)
      duplicates = [Child.new(:name => "duplicated")]
      Child.stub(:duplicates_of).with("37").and_return(duplicates)
      get :show, params: {id: '37'}
      assigns[:duplicates].should == duplicates
    end

    it 'logs a veiw message' do
      child = build :child, :unique_identifier => "1234"
      controller.stub :render
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with("Viewing case '#{child.case_id_display}' by user '#{@user.user_name}'")
      get :show, params: {id: child.id}
    end
  end

  describe "GET new" do
    it "assigns a new child as @child" do
      Child.stub(:allowed_formsections).and_return({})
      Child.stub(:new).and_return(mock_child)
      get :new
      assigns[:child].should equal(mock_child)
    end

    it "retrieves the grouped forms that are permitted to this user and child" do
      controller.stub(:make_new_record).and_return(mock_child)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      Child.should_receive(:allowed_formsections).and_return(grouped_forms)
      get :new, params: {id: '37'}
      assigns[:form_sections].should == grouped_forms
    end
  end

  describe "GET edit" do
    it "assigns the requested child as @child" do
      Child.stub(:allowed_formsections).and_return({})
      Child.stub(:get).with("37").and_return(mock_child)
      allow(@mock_child).to receive(:display_id).and_return('37')
      allow(@mock_child).to receive(:owned_by).and_return('test_owner')
      get :edit, params: {id: '37'}
      assigns[:child].should equal(mock_child)
    end

    it "retrieves the grouped forms that are permitted to this user and child" do
      Child.stub(:get).with("37").and_return(mock_child)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      Child.should_receive(:allowed_formsections).and_return(grouped_forms)
      allow(@mock_child).to receive(:display_id).and_return('37')
      allow(@mock_child).to receive(:owned_by).and_return('test_owner')
      get :edit, params: {id: '37'}
      assigns[:form_sections].should == grouped_forms
    end

    it 'logs an edit message' do
      child = build :child, :unique_identifier => "1234"
      controller.stub :render
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with("Editing case '#{child.case_id_display}' by user '#{@user.user_name}'")
      get :edit, params: {id: child.id}
    end
  end

  describe "PUT update" do
    before :each do
      Child.stub(:permitted_property_names).and_return(['name', 'unique_identifier', 'reunited', ])
    end

    it "should update child on a field and photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('name' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      put :update, params: {id: child.id, child: {name: "Manchester", photo: Rack::Test::UploadedFile.new(uploadable_photo_jeff)}}

      assigns[:child]['name'].should == "Manchester"
      assigns[:child]['_attachments'].size.should == 2
      assigns[:child]['_attachments']["jeff"]['data'].should_not be_blank
    end

    it "should update only non-photo fields when no photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('name' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      put :update, params: {id: child.id, child: {name: "Manchester", reunited: true}}

      assigns[:child]['name'].should == "Manchester"
      assigns[:child]['reunited'].should be_truthy
      assigns[:child]['_attachments'].size.should == 1
    end

    it "should allow a records ID to be specified to create a new record with a known id" do
      new_uuid = UUIDTools::UUID.random_create
      put :update, params: {id: new_uuid.to_s, child: {id: new_uuid.to_s, _id: new_uuid.to_s, name: "London", reunited: true}}
      Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end

    it "should update the last_updated_by_full_name field with the logged in user full name" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'existing child'})
      Child.stub(:get).with("123").and_return(child)
      subject.should_receive('current_user_full_name').and_return('Bill Clinton')

      put :update, params: {id: 123, child: {flag: true, flag_message: "Test"}}

      child.last_updated_by_full_name.should=='Bill Clinton'
    end

    it "should not set photo if photo is not passed" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, params: {id: '1', child: params_child}
      end

    it "should delete the audio if checked delete_child_audio checkbox" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, true, params_child)
      Child.stub(:get).and_return(child)
      put :update, params: {id: '1', child: params_child, delete_child_audio: "1"}
    end

    it "should redirect to redirect_url if it is present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, params: {id: '1', child: params_child, redirect_url: '/cases'}
      response.should redirect_to '/cases?follow=true'
    end

    it "should redirect to case page if redirect_url is not present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})

      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, params: {id: '1', child: params_child}
      response.should redirect_to "/cases/#{child.id}?follow=true"
    end

    it 'logs an update message' do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})

      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_child)
      Child.stub(:get).and_return(child)
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with("Updating case '#{child.case_id_display}' by user '#{@user.user_name}'")
      put :update, params: {id: '1', child: params_child}
    end

  end

  describe "GET id search", search: true, skip_session: true do
    before do
      User.all.each{|u| u.destroy}
      Child.all.each{|c| c.destroy}
      Sunspot.remove_all!

      permission_case1 = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      roles1 = [Role.new(permissions_list: [permission_case1])]

      permission_case2 = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SEARCH_OWNED_BY_OTHERS])
      roles2 = [Role.new(permissions_list: [permission_case2])]

      Child.any_instance.stub(:child_status).and_return(Record::STATUS_OPEN)
      @case_worker1 = create(:user)
      @case_worker1.stub(:roles).and_return(roles1)
      @case_worker2 = create(:user)
      @case_worker2.stub(:roles).and_return(roles2)

      @case1 = create(:child, owned_by: @case_worker1.user_name)
      @case2 = create(:child, owned_by: @case_worker1.user_name)
      @case3 = create(:child, owned_by: @case_worker2.user_name)

      Sunspot.commit
    end

    it "should query id and return correct case allowed by user" do
      session = fake_login @case_worker1
      get :index, params: {format: 'html', query: @case1.short_id, id_search: true}
      expect(assigns[:children]).to match_array([@case1])
    end

    it "should query id and return all cases matched with search owned by others permission active" do
      session = fake_login @case_worker2
      get :index, params: {format: 'html', query: @case1.short_id, id_search: true}
      expect(assigns[:children]).to match_array([@case1])
    end

    it "should go through and return no results if no results found" do
      session = fake_login @case_worker2
      get :index, params: {format: 'html', query: '0034952', id_search: true, module_id: 'test_module'}
      expect(assigns[:children]).to match_array([])
    end
  end

  describe "GET search" do
    it "should not render error by default" do
      get :search, params: {format: 'html'}
      assigns[:search].should be_nil
    end

    # TODO: full text searching not implemented yet.
    # it "should render error if search is invalid" do
    #   get(:search, :format => 'html', :query => '2'*160)
    #   search = assigns[:search]
    #   search.errors.should_not be_empty
    # end

    # TODO: full text searching not implemented yet.
    # it "should stay in the page if search is invalid" do
    #   get(:search, :format => 'html', :query => '1'*160)
    #   response.should render_template("search")
    # end

    # TODO: full text searching not implemented yet.
    # it "performs a search using the parameters passed to it" do
    #   search = double("search", :query => 'the child name', :valid? => true, :page => 1)
    #   Search.stub(:new).and_return(search)

    #   fake_results = ["fake_child","fake_child"]
    #   fake_full_results =  [:fake_child,:fake_child, :fake_child, :fake_child]
    #   Child.should_receive(:search).with(search, 1).and_return([fake_results, fake_full_results])
    #   get(:search, :format => 'html', :query => 'the child name')
    #   assigns[:results].should == fake_results
    # end

    describe "with no results" do
      before do
        get :search, params: {query: 'blah'}
      end

      xit 'asks view to not show csv export link if there are no results' do
        assigns[:results].size.should == 0
      end

      xit 'asks view to display a "No results found" message if there are no results' do
        assigns[:results].size.should == 0
      end

    end
  end

  describe '#respond_to_export' do
    before :each do
      @child1 = build :child
      @child2 = build :child
      controller.stub :paginated_collection => [ @child1, @child2 ], :render => true
      Child.stub :list_records => double(:results => [@child1, @child2 ], :total => 2)
    end

    context 'show' do
      it 'exports 1 record' do
        get :show, params: {id: @child1.id}, format: :csv
        expect(response.header['Content-Type']).to include 'application/zip'
        expect(response.header['Content-Disposition']).to include "#{@child1.unique_identifier}.csv.zip"
      end
    end

    context 'index' do
      it "should handle CSV" do
        Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything, anything).and_return('data')
        get :index, format: :csv
      end

      it "should encrypt result" do
        password = 's3cr3t'
        Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything, anything).and_return('data')
        # controller.should_receive(:export_filename).with([ @child1, @child2 ], Exporters::CSVExporter).and_return("test_filename")
        # controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', password).and_return(true)
        get :index, params: {password: password, custom_export_file_name: 'test_filename'}, format: :csv
        #TODO - what else to test?
        expect(response.header['Content-Type']).to include 'application/zip'
        expect(response.header['Content-Disposition']).to include "test_filename.csv.zip"
      end
    end
  end

  describe "PUT select_primary_photo" do
    before :each do
      @child = stub_model(Child, :id => "id")
      @photo_key = "key"
      @child.stub(:primary_photo_id=)
      @child.stub(:save)
      Child.stub(:get).with("id").and_return @child
    end

    it "set the primary photo on the child and save" do
      @child.should_receive(:primary_photo_id=).with(@photo_key)
      @child.should_receive(:save)

      put :select_primary_photo, params: {child_id: @child.id, photo_id: @photo_key}
    end

    it "should return success" do
      put :select_primary_photo, params: {child_id: @child.id, photo_id: @photo_key}
      response.should be_success
    end

    context "when setting new primary photo id errors" do
      before :each do
        @child.stub(:primary_photo_id=).and_raise("error")
      end

      it "should return error" do
        put :select_primary_photo, params: {child_id: @child.id, photo_id: @photo_key}
        response.should be_error
      end
    end
  end

  describe "POST request_approval" do
    before do
      #TODO: This FormSection setup will not be necessary once the approvable_subforms property in approvable concern is fixed
      FormSection.all.each &:destroy
      approvals_fields_subform = [
          Field.new({"name" => "approval_test",
                     "type" => "textarea",
                     "display_name_all" => "Approval Test"
                    })
      ]

      approvals_section = FormSection.create_or_update_form_section({
          "visible"=>false,
          "is_nested"=>true,
          :order_form_group => 999,
          :order => 999,
          :order_subform => 1,
          :unique_id=>"approval_subforms",
          :parent_form=>"case",
          "editable"=>true,
          :fields => approvals_fields_subform,
          :initial_subforms => 0,
          :hide_subform_placeholder => true,
          "name_all" => "Approval Subform",
          "description_all" => "Approval Subform"
      })

      fields = [
          Field.new({"name" => "approval_subforms",
                     "type" => "subform",
                     "editable" => false,
                     "subform_section_id" => approvals_section.unique_id,
                     "display_name_all" => "Approval"
                    }),
      ]
      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
      )
      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.refresh_form_properties

      User.all.each {|user| user.destroy}
      User.stub(:find_by_user_name).with('test_owner').and_return nil
      User.stub(:find_by_user_name).with('manager1').and_return nil
      @owner = create :user, user_name: 'test_owner', full_name: 'Test Owner', email: 'owner@primero.dev', organization: 'UNICEF'
      @manager1 = create :user, is_manager: true, email: 'manager1@primero.dev', send_mail: true, user_name: 'manager1'
      @child = Child.new_with_user_name @owner, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345'
      p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
      @child.stub(:module).and_return p_module
      @child.save
      User.stub(:get).with(@owner.id).and_return @owner
      User.stub(:get).with(@manager1.id).and_return @manager1
      @owner.stub(:managers).and_return [@manager1]
      ActiveJob::Base.queue_adapter = :inline
    end

    context 'when notification emails are enabled' do
      before do
        @system_settings.notification_email_enabled = true
        @system_settings.save
      end

      it 'sends a request approval email' do
        before_count = ActionMailer::Base.deliveries.count
        post :request_approval, params: {id: @child.id, child_id: @child.id, approval_type: 'case_plan', approval_status: 'pending', model_class: 'Child'}
        expect(ActionMailer::Base.deliveries.count).to eq(before_count + 1)
        expect(response).to be_success
      end
    end

    context 'when notification emails are disabled' do
      before do
        @system_settings.notification_email_enabled = false
        @system_settings.save
      end

      it 'does not send a request approval email' do
        before_count = ActionMailer::Base.deliveries.count
        post :request_approval, params: {id: @child.id, child_id: @child.id, approval_type: 'case_plan', approval_status: 'pending', model_class: 'Child'}
        expect(ActionMailer::Base.deliveries.count).to eq(before_count)
        expect(response).to be_success
      end
    end
  end

  describe "POST create" do
    before :each do
      Child.stub(:permitted_property_names).and_return(['name', 'unique_identifier', 'age', 'nickname'])
    end

    it "should update the child record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'old name'})
      child.save
      fake_admin_login
      controller.stub(:authorize!)
      post :create, params: {child: {:unique_identifier => child.unique_identifier, :name => 'new name'}}
      updated_child = Child.by_short_id(:key => child.short_id)
      updated_child.all.size.should == 1
      updated_child.first.name.should == 'new name'
    end

    it "should not update fields that were only changed in previous conflicting merge" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save

      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: new_name}}
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: original_name}}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == new_name
    end

    it "should update fields that were not changed in previous conflicting merge" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: 'Johnny'}}
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: new_name}}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == new_name
    end

    it "should take the last update if there are two new changes" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      newer_name = 'Juan Rodriguez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: new_name}}
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: newer_name}}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == newer_name
    end

    it 'logs a create message' do
      child = build :child, :unique_identifier => "1234"
      new_name = 'Juan Lopez'
      allow(Rails.logger).to receive(:info)
      expect(Rails.logger).to receive(:info).with("Creating case by user '#{@user.user_name}'")
      post :create, params: {child: {unique_identifier: child.unique_identifier, base_revision: child._rev, name: new_name}}
    end

  end

  describe 'API' do
    it 'creates a GBV case' do
      gbv_case = {owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                   previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker", previously_owned_by_agency: "agency-unicef",
                   module_id: "primeromodule-gbv", created_organization: "agency-unicef", created_by: "primero_gbv",
                   created_by_full_name: "GBV Worker", record_state: true, marked_for_mobile: false, consent_for_services: false,
                   child_status: Record::STATUS_OPEN, name: "Joe Tester", name_first: "Joe", name_last: "Tester", name_nickname: "",
                   name_given_post_separation: "No", registration_date: "01-Feb-2007", sex: "Male", age: 10,
                   estimated: false, address_is_permanent: false, system_generated_followup: false,
                   family_details_section: [
                       {relation_name: "Another Tester", relation: "Father", relation_is_caregiver: false,
                        relation_child_lived_with_pre_separation: "Yes", relation_child_is_in_contact: "No",
                        relation_child_is_separated_from: "Yes", relation_nickname: "", relation_is_alive: "Unknown",
                        relation_age: 40, relation_date_of_birth: "01-Jan-1977"}],
                   case_id: "56798b3e-c5b8-44d9-a8c1-2593b2b127c9", short_id: "2b127c9", hidden_name: false, posted_from: "Mobile"}

      post :create, params: {child: gbv_case, format: :json}

      case1 = Child.by_short_id(key: gbv_case[:short_id]).first

      expect(case1).not_to be_nil
      expect(case1.name).to eq('Joe Tester')
    end

    describe 'show' do
      before do
        @gbv_case = Child.create!({owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                    previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker", previously_owned_by_agency: "agency-unicef",
                    module_id: "primeromodule-gbv", created_organization: "agency-unicef", created_by: "fakeadmin",
                    created_by_full_name: "GBV Worker", record_state: true, marked_for_mobile: true, consent_for_services: false,
                    child_status: Record::STATUS_OPEN, name: "Norville Rogers", name_first: "Norville", name_last: "Rogers", name_nickname: "Shaggy",
                    name_given_post_separation: "No", registration_date: "01-Feb-2007", sex: "Male", age: 10,
                    estimated: false, address_is_permanent: false, system_generated_followup: false,
                    family_details_section: [
                        {relation_name: "Joe Rogers", relation: "Father", relation_is_caregiver: false,
                         relation_child_lived_with_pre_separation: "Yes", relation_child_is_in_contact: "No",
                         relation_child_is_separated_from: "Yes", relation_nickname: "", relation_is_alive: "Unknown",
                         relation_age: 40, relation_date_of_birth: "01-Jan-1977"}], hidden_name: false})
        @gbv_user = User.new(:user_name => 'primero_gbv', :is_manager => false)
      end
      it 'returns a GBV case' do
        get :show, params: {id: @gbv_case.id, mobile: true, format: :json}

        expect(assigns['record']['_id']).to eq(@gbv_case.id)
        expect(assigns['record']['short_id']).to eq(@gbv_case.short_id)
        expect(assigns['record']['name']).to eq(@gbv_case.name)
      end
    end
  end

	describe "reindex_params_subforms" do

		it "should correct indexing for nested subforms" do
			params = {
				"child"=> {
					"name"=>"",
	   		 "top_1"=>"This is a top value",
	        "nested_form_section" => {
						"0"=>{"nested_1"=>"Keep", "nested_2"=>"Keep", "nested_3"=>"Keep"},
	     		 "2"=>{"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"}},
	        "fathers_name"=>""}}

			controller.reindex_hash params['child']
			expected_subform = params["child"]["nested_form_section"]["1"]

			expect(expected_subform.present?).to be_truthy
			expect(expected_subform).to eq({"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"})
		end

	end

  describe "sort_subforms" do
    before :each do
      followup_subform_fields = [
        Field.new({"name" => "followup_type",
                   "type" => "select_box",
                   "display_name_all" => "Type of follow up",
                   "option_strings_text_all" =>
                                ["Follow up After Reunification",
                                 "Follow up in Care"].join("\n")
                  }),
        Field.new({"name" => "followup_date",
                   "type" => "date_field",
                   "display_name_all" => "Follow up date"
                  })
      ]

      followup_subform_section = FormSection.create_or_update_form_section({
        "visible" => false,
        "is_nested" => true,
        :order_form_group => 110,
        :order => 20,
        :order_subform => 1,
        :unique_id => "followup_subform_section",
        :parent_form=>"case",
        "editable" => true,
        :fields => followup_subform_fields,
        :initial_subforms => 1,
        "name_all" => "Nested Followup Subform",
        "description_all" => "Nested Followup Subform",
        "collapsed_fields" => ["followup_service_type", "followup_assessment_type", "followup_date"]
      })

      @followup_fields = [
        Field.new({"name" => "followup_subform_section",
                   "type" => "subform", "editable" => true,
                   "subform_section_id" => followup_subform_section.unique_id,
                   "display_name_all" => "Follow Up",
                   "subform_sort_by" => "followup_date"
                  })
      ]

      FormSection.create_or_update_form_section({
        :unique_id => "followup",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 110,
        :order => 20,
        :order_subform => 0,
        :form_group_name => "Services / Follow Up",
        "editable" => true,
        :fields => @followup_fields,
        "name_all" => "Follow Up",
        "description_all" => "Follow Up"
      })
    end

    it "should sort subforms by the sort_subform_by on show page" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      params = {
        "child" => {
          "name" => "JoJo BamBeno",
          "short_id" => 'short_id',
          "created_by" => "uname",
          "followup_subform_section"=> {
            "0"=> {
              "unique_id"=>"f9672710-b257-4cd8-896d-6eb8349bbef0",
              "followup_type"=>"Follow up After Reunification",
              "followup_date"=>"21-Sep-2015"
            },
            "1"=> {
              "unique_id"=>"f5345966-7bf5-4621-8237-b31259f71260",
              "followup_type"=>"Follow up in Care",
              "followup_date"=>"08-Sep-2015"
            },
            "2"=> {
              "unique_id"=>"85004f47-70d5-4b30-96c9-138666b36413",
              "followup_type"=>"Follow up in Care",
              "followup_date"=>"30-Sep-2015"
            }
          }
        }
      }
      child = Child.new_with_user_name(user, params["child"])
      child.save!
      Child.any_instance.stub(:field_definitions).and_return(@followup_fields)

      get :show, params: {id: child.id}
      child_params = params["child"]["followup_subform_section"]
      expect(assigns[:child][:followup_subform_section]).to eq([child_params["2"], child_params["0"], child_params["1"]])
    end

    it "should sort subforms by the sort_subform_by with nil dates at the top" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      params = {
        "child" => {
          "name" => "JoJo BamBeno",
          "short_id" => 'short_id',
          "created_by" => "uname",
          "followup_subform_section"=> {
            "0"=> {
              "unique_id"=>"f9672710-b257-4cd8-896d-6eb8349bbef0",
              "followup_type"=>"Follow up After Reunification",
              "followup_date"=>"21-Sep-2015"
            },
            "1"=> {
              "unique_id"=>"f5345966-7bf5-4621-8237-b31259f71260",
              "followup_type"=>"Follow up in Care",
              "followup_date"=>"nil"
            },
            "2"=> {
              "unique_id"=>"85004f47-70d5-4b30-96c9-138666b36413",
              "followup_type"=>"Follow up in Care",
              "followup_date"=>"30-Sep-2015"
            }
          }
        }
      }
      child = Child.new_with_user_name(user, params["child"])
      child.save!
      Child.any_instance.stub(:field_definitions).and_return(@followup_fields)

      get :show, params: {id: child.id}
      child_params = params["child"]["followup_subform_section"]
      expect(assigns[:child][:followup_subform_section]).to eq([child_params["1"], child_params["2"], child_params["0"]])
    end
  end
end
