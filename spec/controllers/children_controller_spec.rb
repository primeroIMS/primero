require 'spec_helper'

def inject_export_generator( fake_export_generator, child_data )
	ExportGenerator.stub(:new).with(child_data).and_return( fake_export_generator )
end

def stub_out_export_generator child_data = []
	inject_export_generator( stub_export_generator = stub(ExportGenerator) , child_data)
	stub_export_generator.stub(:child_photos).and_return('')
	stub_export_generator
end

def stub_out_child_get(mock_child = double(Child))
	Child.stub(:get).and_return( mock_child )
	mock_child
end

describe ChildrenController do

  before :each do
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
        @controller.current_ability.should_receive(:can?).with(:index, Child).and_return(false);
        get :index
        response.status.should == 403
      end

      xit "GET search" do
        @controller.current_ability.should_receive(:can?).with(:index, Child).and_return(false);
        get :search
        response.status.should == 403
      end

      it "GET new" do
        @controller.stub(:get_form_sections).and_return({})
        @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false);
        get :new
        response.status.should == 403
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, Child).and_return(false);
        post :create
        response.status.should == 403
      end

    end

    describe 'member' do
      before :each do
        User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
        @child = Child.create('last_known_location' => "London", :short_id => 'short_id', :created_by => "uname")
        @child_arg = hash_including("_id" => @child.id)
      end

      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @child_arg).and_return(false);
         get :show, :id => @child.id
         response.status.should == 403
      end

      it "PUT update" do
        @controller.current_ability.should_receive(:can?).with(:update, @child_arg).and_return(false);
        put :update, :id => @child.id
        response.status.should == 403
      end

      it "PUT edit_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child_arg).and_return(false);
        put :edit_photo, :id => @child.id
        response.status.should == 403
      end

      it "PUT update_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child_arg).and_return(false);
        put :update_photo, :id => @child.id
        response.status.should == 403
      end

      it "PUT select_primary_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @child_arg).and_return(false);
        put :select_primary_photo, :child_id => @child.id, :photo_id => 0
        response.status.should == 403
      end

      it "DELETE destroy" do
        @controller.current_ability.should_receive(:can?).with(:destroy, @child_arg).and_return(false);
        delete :destroy, :id => @child.id
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
          scope = {"child_status"=>"single||open"} if not scope.present?
          children.stub(:paginate).and_return(children)
          Child.should_receive(:list_records).with({"child_status" => {:type => "single", :value => "open"}}, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, ["fakefieldadmin"], nil).and_return(children)

          get :index, :scope => scope
          assigns[:children].should == children
        end
      end
    end

    #TODO: Maybe get rid of this?
    shared_examples_for "viewing children as a field worker" do
      describe "when the signed in user is a field worker" do
        before do
          @session = fake_field_worker_login
          @stubs ||= {}
          @options ||= {}
          @params ||= {}
        end

        it "should assign the children created by the user as @childrens" do
          children = mock_child(@stubs)
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          scope = {"child_status"=>"open"} if not scope.present?
          order = {:created_at=>:desc}

          children.stub(:paginate).and_return(children)
          Child.should_receive(:list_records).with(scope, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, "fakefieldworker", nil).and_return(children)
          @params.merge!(:scope => scope)
          get :index, @params
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

    describe "export all" do
      before do
        @session = fake_field_worker_login
      end

      it "should export all children" do
        collection = [Child.new, Child.new]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(100)
        Child.should_receive(:list_records).with({"child_status" => {:type => "single", :value => "open"}}, {:created_at=>:desc}, {:page=> 1, :per_page=> 100}, ["fakefieldworker"], nil).and_return(search)
        params = {"page" => "all"}
        get :index, params
        assigns[:children].should == collection
        assigns[:total_records].should == 100
      end

      it "should export only CP children when export UNHCR" do
        collection = [Child.new(:family_details_section => [], :religion => [], :nationality => [], :ethnicity => [], :protection_concerns => [], :language => [])]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(100)
        Child.should_receive(:list_records).with({"module_id" => {:type => "single", :value => "primeromodule-cp"}, "child_status"=>{:type => "single", :value => "open"}}, {:created_at=>:desc}, {:page=> 1, :per_page=> 100}, ["fakefieldworker"], nil).and_return(search)
        params = {"page" => "all", "format" => "unhcr_csv"}
        get :index, params
        assigns[:children].should == collection
        assigns[:total_records].should == 100
      end
    end

    shared_examples_for "Export List" do |user_type|
      before do
        @session = fake_login_as
      end
    
      it "should export columns in the current list view for #{user_type} user" do
        collection = [Child.new(:id => "1"), Child.new(:id => "2")]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(2)
        Child.should_receive(:list_records).with({"child_status"=>{:type => "single", :value => "open"}}, {:created_at=>:desc}, {:page=> 1, :per_page=> 100}, ["all"], nil).and_return(search)
    
        #User
        @session.user.should_receive(:has_module?).with(PrimeroModule::CP).and_return(cp_result)
        @session.user.should_receive(:has_module?).with(PrimeroModule::GBV).and_return(gbv_result)
        @session.user.should_receive(:has_module?).with(PrimeroModule::MRM).and_return(mrm_result)
        @session.user.should_receive(:is_manager?).and_return(manager_result)
    
        ##### Main part of the test ####
        controller.should_receive(:list_view_header).with("case").and_call_original
        #Test if the exporter receive the list of field expected.
        Exporters::CSVExporterListView.should_receive(:export).with(collection, expected_properties, @session.user).and_return('data')
        ##### Main part of the test ####
    
        controller.should_receive(:export_filename).with(collection, Exporters::CSVExporterListView).and_return("test_filename")
        controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', nil).and_return(true)
        controller.stub :render
        #Prepare parameters to call the corresponding exporter.
        params = {"page" => "all", "export_list_view" => "true", "format" => "list_view_csv"}
        get :index, params
      end
    end

    it_behaves_like "Export List", "admin" do
      let(:cp_result) { true }
      let(:gbv_result) { true }
      let(:mrm_result) { true }
      let(:manager_result) { true }
      let(:expected_properties) { {
        :type => "case",
        :fields => {
          "Id" => "short_id",
          "Age" => "age",
          "Sex" => "sex",
          "Registration Date" => "registration_date",
          "Case Opening Date" => "created_at",
          "Photo" => "photo",
          "Social Worker" => "owned_by"} } }
    end

    it_behaves_like "Export List", "cp" do
      let(:cp_result) { true }
      let(:gbv_result) { false }
      let(:mrm_result) { false }
      let(:manager_result) { false }
      let(:expected_properties) { {
        :type => "case",
        :fields => {
          "Id" => "short_id",
          "Name" => "sortable_name",
          "Age" => "age",
          "Sex" => "sex",
          "Registration Date" => "registration_date",
          "Photo" => "photo"} } }
    end

    it_behaves_like "Export List", "gbv" do
      let(:cp_result) { false }
      let(:gbv_result) { true }
      let(:mrm_result) { false }
      let(:manager_result) { false }
      let(:expected_properties) { {
        :type => "case",
        :fields => {
          "Id" => "short_id",
          "Survivor Code" => "survivor_code_no",
          "Case Opening Date" => "created_at"} } }
    end

    describe "export_filename" do
      before :each do
        @password = 's3cr3t'
        @session = fake_field_worker_login
        @child1 = Child.new(:id => "1", :unique_identifier=> "unique_identifier-1")
        @child2 = Child.new(:id => "2", :unique_identifier=> "unique_identifier-2")
      end
    
      it "should use the file name provided by the user" do
        Child.stub :list_records => double(:results => [ @child1, @child2 ], :total => 2)
        #This is the file name provided by the user and should be sent as parameter.
        custom_export_file_name = "user file name"
        Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything).and_return('data')
        ##### Main part of the test ####
        #Call the original method to check the file name calculated
        controller.should_receive(:export_filename).with([ @child1, @child2 ], Exporters::CSVExporter).and_call_original
        #Test that the file name is the expected.
        controller.should_receive(:encrypt_data_to_zip).with('data', "#{custom_export_file_name}.csv", @password).and_return(true)
        ##### Main part of the test ####
        controller.stub :render
        params = {:format => :csv, :password => @password, :custom_export_file_name => custom_export_file_name}
        get :index, params
      end
    
      it "should use the user_name and model_name to get the file name" do
        Child.stub :list_records => double(:results => [ @child1, @child2 ], :total => 2)
        Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything).and_return('data')
        ##### Main part of the test ####
        #Call the original method to check the file name calculated
        controller.should_receive(:export_filename).with([ @child1, @child2 ], Exporters::CSVExporter).and_call_original
        #Test that the file name is the expected.
        controller.should_receive(:encrypt_data_to_zip).with('data', "#{@session.user.user_name}-child.csv", @password).and_return(true)
        ##### Main part of the test ####
        controller.stub :render
        params = {:format => :csv, :password => @password}
        get :index, params
      end
    
      it "should use the unique_identifier to get the file name" do
        Child.stub :list_records => double(:results => [ @child1 ], :total => 1)
        Exporters::CSVExporter.should_receive(:export).with([ @child1 ], anything, anything).and_return('data')
        ##### Main part of the test ####
        #Call the original method to check the file name calculated
        controller.should_receive(:export_filename).with([ @child1 ], Exporters::CSVExporter).and_call_original
        #Test that the file name is the expected.
        controller.should_receive(:encrypt_data_to_zip).with('data', "#{@child1.unique_identifier}.csv", @password).and_return(true)
        ##### Main part of the test ####
        controller.stub :render
        params = {:format => :csv, :password => @password}
        get :index, params
      end
    end

    describe "permissions to view lists of case records", search: true, skip_session: true do

      before do

        Sunspot.setup(Child) {string 'child_status', as: "child_status_sci".to_sym}

        User.all.each{|u| u.destroy}
        Child.all.each{|c| c.destroy}
        Sunspot.remove_all!


        roles = [Role.new(permissions: [Permission::CASE, Permission::READ])]

        Child.any_instance.stub(:child_status).and_return("Open")
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


    describe "export all to PDF/CSV/CPIMS/Photo Wall" do
      before do
        fake_field_admin_login
        @params ||= {}
        controller.stub :paginated_collection => [], :render => true
      end
      it "should flash notice when exporting no records" do
        format = "cpims"
        @params.merge!(:format => format)
        get :index, @params
        flash[:notice].should == "No Records Available!"
      end
    end
  end

  describe "GET show" do
    it 'does not assign child name in page name' do
      child = build :child, :unique_identifier => "1234"
      controller.stub :render
      get :show, :id => child.id
      assigns[:page_name].should == "View Case #{child.short_id}"
    end

    it "assigns the requested child" do
      Child.stub(:get).with("37").and_return(mock_child)
      ChildrenController.any_instance.stub(:get_form_sections).and_return({})
      get :show, :id => "37"
      assigns[:child].should equal(mock_child)
    end

    it 'should not fail if primary_photo_id is not present' do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", :created_by => "uname")
      Child.stub(:get).with("37").and_return(child)
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

      controller.stub :render
      get(:show, :format => 'csv', :id => "37")
    end

    it "should set current photo key as blank instead of nil" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", :created_by => "uname")
      Child.stub(:get).with("37").and_return(child)
      assigns[child[:current_photo_key]] == ""
      get(:show, :format => 'json', :id => "37")
    end


    it "retrieves the grouped forms that are permitted to this user and child" do
      Child.stub(:get).with("37").and_return(mock_child)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      FormSection.should_receive(:get_permitted_form_sections).and_return(forms)
      FormSection.should_receive(:link_subforms)
      FormSection.should_receive(:group_forms).and_return(grouped_forms)
      get :show, :id => "37"
      assigns[:form_sections].should == grouped_forms
      #TODO: Do we need to test ordering of forms in the controller?
    end

    it "should flash an error and go to listing page if the resource is not found" do
      Child.stub(:get).with("invalid record").and_return(nil)
      get :show, :id=> "invalid record"
      flash[:error].should == "Child with the given id is not found"
      response.should redirect_to(:action => :index)
    end

    it "should include duplicate records in the response" do
      Child.stub(:get).with("37").and_return(mock_child)
      duplicates = [Child.new(:name => "duplicated")]
      Child.should_receive(:duplicates_of).with("37").and_return(duplicates)
      controller.stub :get_form_sections
      get :show, :id => "37"
      assigns[:duplicates].should == duplicates
    end
  end

  describe "GET new" do
    it "assigns a new child as @child" do
      Child.stub(:new).and_return(mock_child)
      controller.stub :get_form_sections
      get :new
      assigns[:child].should equal(mock_child)
    end

    it "retrieves the grouped forms that are permitted to this user and child" do
      Child.stub(:get).with("37").and_return(mock_child)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      FormSection.should_receive(:get_permitted_form_sections).and_return(forms)
      FormSection.should_receive(:link_subforms)
      FormSection.should_receive(:group_forms).and_return(grouped_forms)
      get :new, :id => "37"
      assigns[:form_sections].should == grouped_forms
    end
  end

  describe "GET edit" do
    it "assigns the requested child as @child" do
      Child.stub(:get).with("37").and_return(mock_child)
      controller.stub :get_form_sections
      get :edit, :id => "37"
      assigns[:child].should equal(mock_child)
    end

    it "retrieves the grouped forms that are permitted to this user and child" do
      Child.stub(:get).with("37").and_return(mock_child)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      FormSection.should_receive(:get_permitted_form_sections).and_return(forms)
      FormSection.should_receive(:link_subforms)
      FormSection.should_receive(:group_forms).and_return(grouped_forms)
      get :edit, :id => "37"
      assigns[:form_sections].should == grouped_forms
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested child" do
      Child.should_receive(:get).with("37").and_return(mock_child)
      mock_child.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the children list" do
      Child.stub(:get).and_return(mock_child(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(children_url)
    end
  end

  describe "PUT update" do
    it "should update child on a field and photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      put :update, :id => child.id,
        :child => {
          :last_known_location => "Manchester",
          :photo => Rack::Test::UploadedFile.new(uploadable_photo_jeff) }

      assigns[:child]['last_known_location'].should == "Manchester"
      assigns[:child]['_attachments'].size.should == 2
      updated_photo_key = assigns[:child]['_attachments'].keys.select {|key| key =~ /photo.*?-2010-01-17T140532/}.first
      assigns[:child]['_attachments'][updated_photo_key]['data'].should_not be_blank
    end

    it "should update only non-photo fields when no photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      child = Child.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      put :update, :id => child.id,
        :child => {
          :last_known_location => "Manchester",
          :age => '7'}

      assigns[:child]['last_known_location'].should == "Manchester"
      assigns[:child]['age'].should == "7"
      assigns[:child]['_attachments'].size.should == 1
    end

    it "should allow a records ID to be specified to create a new record with a known id" do
      new_uuid = UUIDTools::UUID.random_create()
      put :update, :id => new_uuid.to_s,
        :child => {
            :id => new_uuid.to_s,
            :_id => new_uuid.to_s,
            :last_known_location => "London",
            :age => "7"
        }
      Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end

    it "should update the last_updated_by_full_name field with the logged in user full name" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'existing child'})
      Child.stub(:get).with("123").and_return(child)
      subject.should_receive('current_user_full_name').and_return('Bill Clinton')

      put :update, :id => 123, :child => {:flag => true, :flag_message => "Test"}

      child.last_updated_by_full_name.should=='Bill Clinton'
    end

    it "should not set photo if photo is not passed" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, :id => '1', :child => params_child
      end

    it "should delete the audio if checked delete_child_audio checkbox" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, true, params_child)
      Child.stub(:get).and_return(child)
      put :update, :id => '1', :child => params_child, :delete_child_audio => "1"
    end

    it "should redirect to redirect_url if it is present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})
      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, :id => '1', :child => params_child, :redirect_url => '/cases'
      response.should redirect_to '/cases?follow=true'
    end

    it "should redirect to case page if redirect_url is not present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'some name'})

      params_child = {"name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      child.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_child)
      Child.stub(:get).and_return(child)
      put :update, :id => '1', :child => params_child
      response.should redirect_to "/cases/#{child.id}?follow=true"
    end

  end

  describe "GET search" do
    it "should not render error by default" do
      get(:search, :format => 'html')
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
        get(:search, :query => 'blah')
      end

      xit 'asks view to not show csv export link if there are no results' do
        assigns[:results].size.should == 0
      end

      xit 'asks view to display a "No results found" message if there are no results' do
        assigns[:results].size.should == 0
      end

    end
  end

  # TODO: full text searching not implemented yet.
  # describe "searching as field worker" do
  #   before :each do
  #     @session = fake_field_worker_login
  #   end
  #   it "should only list the children which the user has registered" do
  #     search = double("search", :query => 'some_name', :valid? => true, :page => 1)
  #     Search.stub(:new).and_return(search)

  #     fake_results = [:fake_child,:fake_child]
  #     fake_full_results =  [:fake_child,:fake_child, :fake_child, :fake_child]
  #     Child.should_receive(:search_by_created_user).with(search, @session.user_name, 1).and_return([fake_results, fake_full_results])

  #     get(:search, :query => 'some_name')
  #     assigns[:results].should == fake_results
  #   end
  # end

  xit 'should export children using #respond_to_export' do
    child1 = build :child
    child2 = build :child
    controller.stub :paginated_collection => [ child1, child2 ], :render => true
    controller.should_receive(:YAY).and_return(true)

    controller.should_receive(:respond_to_export) { |format, children|
      format.mock { controller.send :YAY }
      children.should == [ child1, child2 ]
    }

    get :index, :format => :mock
  end

  it 'should export child using #respond_to_export' do
    child = build :child
    controller.stub :render => true
    controller.should_receive(:YAY).and_return(true)

    controller.should_receive(:respond_to_export) { |format, children|
      format.mock { controller.send :YAY }
      children.should == [ child ]
    }

    get :show, :id => child.id, :format => :mock
  end

  describe '#respond_to_export' do
    before :each do
      @child1 = build :child
      @child2 = build :child
      controller.stub :paginated_collection => [ @child1, @child2 ], :render => true
      Child.stub :list_records => double(:results => [@child1, @child2 ], :total => 2)
    end

    xit "should handle full PDF" do
      Addons::PdfExportTask.any_instance.should_receive(:export).with([ @child1, @child2 ]).and_return('data')
      get :index, :format => :pdf
    end

    xit "should handle Photowall PDF" do
      Addons::PhotowallExportTask.any_instance.should_receive(:export).with([ @child1, @child2 ]).and_return('data')
      get :index, :format => :photowall
    end

    it "should handle CSV" do
      Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything).and_return('data')
      get :index, :format => :csv
    end

    it "should encrypt result" do
      password = 's3cr3t'
      Exporters::CSVExporter.should_receive(:export).with([ @child1, @child2 ], anything, anything).and_return('data')
      controller.should_receive(:export_filename).with([ @child1, @child2 ], Exporters::CSVExporter).and_return("test_filename")
      controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', password).and_return(true)
      get :index, :format => :csv, :password => password
    end

    xit "should create a log_entry when record is exported" do
      fake_login User.new(:user_name => 'fakeuser', :organization => "STC", :role_ids => ["abcd"])
      @controller.stub(:authorize!)
      RapidftrAddonCpims::ExportTask.any_instance.should_receive(:export).with([ @child1, @child2 ]).and_return('data')

      LogEntry.should_receive(:create!).with :type => LogEntry::TYPE[:cpims], :user_name => "fakeuser", :organization => "STC", :child_ids => [@child1.id, @child2.id]

      get :index, :format => :cpims
    end

    xit "should generate filename based on child ID and addon ID when there is only one child" do
      @child1.stub :short_id => 'test_short_id'
      controller.send(:export_filename, [ @child1 ], Addons::PhotowallExportTask).should == "test_short_id_photowall.zip"
    end

    xit "should generate filename based on username and addon ID when there are multiple children" do
      controller.stub :current_user_name => 'test_user'
      controller.send(:export_filename, [ @child1, @child2 ], Addons::PdfExportTask).should == "test_user_pdf.zip"
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

      put :select_primary_photo, :child_id => @child.id, :photo_id => @photo_key
    end

    it "should return success" do
      put :select_primary_photo, :child_id => @child.id, :photo_id => @photo_key

      response.should be_success
    end

    context "when setting new primary photo id errors" do
      before :each do
        @child.stub(:primary_photo_id=).and_raise("error")
      end

      it "should return error" do
        put :select_primary_photo, :child_id => @child.id, :photo_id => @photo_key

        response.should be_error
      end
    end
  end

  describe "POST create" do
    it "should update the child record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      child = Child.new_with_user_name(user, {:name => 'old name'})
      child.save
      fake_admin_login
      controller.stub(:authorize!)
      post :create, :child => {:unique_identifier => child.unique_identifier, :name => 'new name'}
      updated_child = Child.by_short_id(:key => child.short_id)
      updated_child.all.size.should == 1
      updated_child.first.name.should == 'new name'
    end

    it "should not update fields that were only changed in previous conflicting merge" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save

      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :name => new_name}
      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :name => original_name}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == new_name
    end

    it "should update fields that were not changed in previous conflicting merge" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save

      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :nickname => 'Johnny'}
      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :name => new_name}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == new_name
    end

    it "should take the last update if there are two new changes" do
      original_name = 'Juan Herrero'
      new_name = 'Juan Lopez'
      newer_name = 'Juan Rodriguez'
      child = Child.new_with_user_name(@user, {:name => original_name, :age => 16})
      child.save

      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :name => new_name}
      post :create, :child => {:unique_identifier => child.unique_identifier, :base_revision => child._rev, :name => newer_name}

      updated_child = Child.by_short_id(:key => child.short_id).first
      updated_child.name.should == newer_name
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

			expect(expected_subform.present?).to be_true
			expect(expected_subform).to eq({"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"})
		end

	end

end
