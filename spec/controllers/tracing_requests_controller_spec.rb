require 'rails_helper'

def inject_export_generator( fake_export_generator, tracing_request_data )
  ExportGenerator.stub(:new).with(tracing_request_data).and_return( fake_export_generator )
end

def stub_out_export_generator tracing_request_data = []
  inject_export_generator( stub_export_generator = stub(ExportGenerator) , tracing_request_data)
  stub_export_generator.stub(:tracing_request_photos).and_return('')
  stub_export_generator
end

def stub_out_tracing_request_get(mock_tracing_request = double(TracingRequest))
  TracingRequest.stub(:get).and_return( mock_tracing_request )
  mock_tracing_request
end

describe TracingRequestsController, :type => :controller do
  before do
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: "en",
      primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  before :each do |example|
    TracingRequest.any_instance.stub(:field_definitions).and_return([])
    TracingRequest.any_instance.stub(:permitted_properties).and_return(TracingRequest.properties)
    unless example.metadata[:skip_session]
      @user = User.new(:user_name => 'fakeadmin')
      @session = fake_admin_login @user
    end
  end

  def mock_tracing_request(stubs={})
    @mock_tracing_request ||= mock_model(TracingRequest, stubs).as_null_object
  end

  def stub_form(stubs={})
    form = stub_model(FormSection) do |form|
      form.fields = [stub_model(Field)]
    end
  end

  describe '#authorizations' do
    describe 'collection' do
      before do
        Ability.any_instance.stub(:can?).with(anything, TracingRequest).and_return(false)
        Ability.any_instance.stub(:can?).with(anything, Dashboard).and_return(false)
      end

      it "GET index" do
        controller.stub :get_form_sections
        get :index
        expect(response).to be_forbidden
      end

      xit "GET search" do
        @controller.current_ability.should_receive(:can?).with(:index, TracingRequest).and_return(false)
        get :search
        response.status.should == 403
      end

      it "GET new" do
        @controller.current_ability.should_receive(:can?).with(:create, TracingRequest).and_return(false)
        controller.stub :get_form_sections
        get :new
        response.status.should == 403
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, TracingRequest).and_return(false)
        post :create
        response.status.should == 403
      end

    end

    describe 'member' do
      before :each do
        User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
        @tracing_request = TracingRequest.create('last_known_location' => "London", :short_id => 'short_id', :created_by => "uname")
        # @tracing_request_arg = hash_including("_id" => @tracing_request.id)
      end

      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @tracing_request).and_return(false);
        controller.stub :get_form_sections
        get :show, params: { :id => @tracing_request.id }
        response.status.should == 403
      end

      it "PUT update" do
        @controller.current_ability.should_receive(:can?).with(:update, @tracing_request).and_return(false);
        put :update, params: { :id => @tracing_request.id }
        response.status.should == 403
      end

      it "PUT edit_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @tracing_request).and_return(false);
        put :edit_photo, params: { :id => @tracing_request.id }
        response.status.should == 403
      end

      it "PUT update_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @tracing_request).and_return(false);
        put :update_photo, params: { :id => @tracing_request.id }
        response.status.should == 403
      end

      it "PUT select_primary_photo" do
        @controller.current_ability.should_receive(:can?).with(:update, @tracing_request).and_return(false);
        put :select_primary_photo, params: { :tracing_request_id => @tracing_request.id, :photo_id => 0 }
        response.status.should == 403
      end

    end
  end

  describe "GET index" do


    #TODO: We need a whole new test suite for the index. We need to test the following:
    #         * filters are being generated correctly from params
    #         * right subset of data based on current user
    #         * definitely have tests for active/inactive
    #         * pagination
    #         * sorting

    #TODO: Keep the shared example around until refactoring the tracing requests
    shared_examples_for "viewing tracing requests by user with access to all data" do
      describe "when the signed in user has access all data" do
        before do
          fake_field_admin_login
          @options ||= {}
          @stubs ||= {}
        end

        it "should assign all tracing requests as @tracing_requests" do
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          tracing_requests = mock_tracing_request(@stubs)
          scope ||= {"record_state"=>"single||true"}
          tracing_requests.stub(:paginate).and_return(tracing_requests)
          TracingRequest.should_receive(:list_records).with({"record_state"=>{:type=>"single", :value=>true}}, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, ["fakefieldadmin"], nil, nil).and_return(tracing_requests)

          get :index, params: { :scope => scope }
          assigns[:tracing_requests].should == tracing_requests
        end
      end
    end

    shared_examples_for "viewing tracing requests as a field worker" do
      describe "when the signed in user is a field worker" do
        before do
          @session = fake_field_worker_login
          @stubs ||= {}
          @options ||= {}
          @params ||= {}
        end

        it "should assign the tracing requests created by the user as @tracing_requestrens" do
          tracing_requests = mock_tracing_request(@stubs)
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          @status ||= "all"
          order = {:created_at=>:desc}

          tracing_requests.stub(:paginate).and_return(tracing_requests)
          TracingRequest.should_receive(:list_records).with(@status, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, "fakefieldworker", nil, nil).and_return(tracing_requests)
          @params.merge!(:scope => @status)
          get :index, params: @params
          assigns[:tracing_requests].should == tracing_requests
        end
      end
    end

    context "viewing all tracing requests" do
      #before { @stubs = { :reunited? => false } }
      context "when status is passed for admin" do
        #before { @status = "all"}
        before {@options = {:startkey=>["all"], :endkey=>["all", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_name}}
        it_should_behave_like "viewing tracing requests by user with access to all data"
      end

    end

    # Bulk export is now handled by bulk_export_controller and bulk_export model
    # TODO Confirm with Pavel that these can be removed
    describe "export all" do
      before do
        @session = fake_field_worker_login
      end

      xit "should export all incidents" do
        collection = [TracingRequest.new, TracingRequest.new]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(100)
        TracingRequest.should_receive(:list_records).with({"record_state"=>{:type=>"single", :value=>true}}, {:created_at=>:desc}, {:page=> 1, :per_page=> 500}, ["fakefieldworker"], nil, nil).and_return(search)
        params = {"page" => "all"}
        get :index, params: params
        assigns[:tracing_requests].should == collection
        assigns[:total_records].should == 100
      end
    end

    describe "export list view" do
      before do
        @session = fake_field_worker_login
      end

      # Bulk export is now handled by bulk_export_controller and bulk_export model
      # TODO Confirm with Pavel that these can be removed
      xit "should export columns in the current list view" do
        collection = [TracingRequest.new(:id => "1"), TracingRequest.new(:id => "2")]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(2)
        TracingRequest.should_receive(:list_records).with({"record_state"=>{:type=>"single", :value=>true}}, {:created_at=>:desc}, {:page=> 1, :per_page=> 500}, ["fakefieldworker"], nil, nil).and_return(search)

        ##### Main part of the test ####
        controller.should_receive(:list_view_header).with("tracing_request").and_call_original
        #Prepare the expected list of fields.
        expected_properties = {
          :type => "tracing_request",
          :fields => {
            "Id" => "short_id",
            "Name Of Inquirer" => "relation_name",
            "Date Of Inquiry" => "inquiry_date",
            "Tracing Requests" => "tracing_names"
          }
        }
        #Test if the exporter receive the list of field expected.
        Exporters::CSVExporterListView.should_receive(:export).with(collection, expected_properties, @session.user, anything).and_return('data')
        ##### Main part of the test ####

        controller.should_receive(:export_filename).with(collection, Exporters::CSVExporterListView).and_return("test_filename")
        controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', nil).and_return(true)
        controller.stub :render
        #Prepare parameters to call the corresponding exporter.
        params = {"page" => "all", "export_list_view" => "true", "format" => "list_view_csv"}
        get :index, params: params
      end
    end

    describe "export list filename" do
      before :each do
        @password = 's3cr3t'
        @session = fake_field_worker_login
        @tracing_request1 = TracingRequest.new(:id => "1", :unique_identifier=> "unique_identifier-1")
        @tracing_request2 = TracingRequest.new(:id => "2", :unique_identifier=> "unique_identifier-2")
      end

      context 'when there are multiple records' do
        before do
          TracingRequest.stub :list_records => double(:results => [ @tracing_request1, @tracing_request2 ], :total => 2)
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
            expect(response.header['Content-Disposition']).to include("#{@session.user.user_name}-tracing_request.csv.zip")
          end
        end
      end

      context 'when there is only 1 record' do
        before do
          TracingRequest.stub :list_records => double(:results => [ @tracing_request1 ], :total => 1)
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
            expect(response.header['Content-Disposition']).to include("#{@tracing_request1.unique_identifier}.csv.zip")
          end
        end
      end
    end

    describe "permissions to view lists of tracing request records", search: true, skip_session: true do

      before do
        User.all.each{|u| u.destroy}
        TracingRequest.all.each{|t| t.destroy}
        Sunspot.remove_all!

        @permission_tracing_request_read = Permission.new(resource: Permission::TRACING_REQUEST, actions: [Permission::READ])
        roles = [Role.new(permissions_list: [@permission_tracing_request_read])]

        @case_worker1 = create(:user)
        @case_worker1.stub(:roles).and_return(roles)
        @case_worker2 = create(:user)
        @case_worker2.stub(:roles).and_return(roles)

        @tracing_request1 = create(:tracing_request, owned_by: @case_worker1.user_name)
        @tracing_request2 = create(:tracing_request, owned_by: @case_worker1.user_name)
        @tracing_request3 = create(:tracing_request, owned_by: @case_worker2.user_name)

        Sunspot.commit
      end


      it "loads only tracing requests owned by or associated with this user" do
        session = fake_login @case_worker1
        get :index
        expect(assigns[:tracing_requests]).to match_array([@tracing_request1, @tracing_request2])
      end

    end

    # Bulk export is now handled by bulk_export_controller and bulk_export model
    # TODO Confirm with Pavel that these can be removed
    describe "export all to PDF/CSV/CPIMS/Photo Wall" do
      before do
        fake_field_admin_login
        @params ||= {}
        controller.stub :paginated_collection => [], :render => true
      end
      xit "should flash notice when exporting no records" do
        format = "cpims"
        @params.merge!(:format => format)
        get :index, params: @params
        flash[:notice].should == "No Records Available!"
      end
    end

    describe "Display manager information", skip_session: true do
      render_views

      it "should display information for user manager" do
        p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["tracing_request"])
        user = User.new(:user_name => 'fakeadmin', :is_manager => true)
        session = fake_admin_login user
        user.should_receive(:modules).and_return([p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should appears in the body if the user is a manager.
      response.body.should match(/<h3>Field\/Case\/Social Worker:<\/h3>/)
      end

      it "should not display information for user not manager" do
        p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["tracing_request"])
        user = User.new(:user_name => 'fakeadmin', :is_manager => false)
        session = fake_admin_login user
        user.should_receive(:modules).and_return([p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should not appears in the body if the user is not a manager.
        response.body.should_not match(/<h3>Field\/Case\/Social Worker:<\/h3>/)
      end

    end

  end

  describe "GET show" do
    it 'does not assign tracing request name in page name' do
      tracing_request = build :tracing_request
      controller.stub :render
      controller.stub :get_form_sections
      get :show, params: { :id => tracing_request.id }
      assigns[:page_name].should == "View Tracing Request #{tracing_request.short_id}"
    end

    it "assigns the requested tracing request" do
      TracingRequest.stub(:allowed_formsections).and_return({})
      TracingRequest.stub(:get).with("37").and_return(mock_tracing_request({:module_id => 'primeromodule-cp'}))
      controller.stub :get_form_sections
      allow(@mock_tracing_request).to receive(:display_id).and_return('37')
      allow(@mock_tracing_request).to receive(:owned_by).and_return('test_owner')
      get :show, params: { :id => "37" }
      assigns[:tracing_request].should equal(mock_tracing_request)
    end


    it 'should not fail if primary_photo_id is not present' do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      tracing_request = TracingRequest.create('last_known_location' => "London", :created_by => "uname")
      TracingRequest.stub(:get).with("37").and_return(tracing_request)
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

      controller.stub :render
      get :show, params: { :format => :csv, :id => "37" }
    end

    it "should set current photo key as blank instead of nil" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      tracing_request = TracingRequest.create('last_known_location' => "London", :created_by => "uname")
      TracingRequest.stub(:get).with("37").and_return(tracing_request)
      assigns[tracing_request[:current_photo_key]] == ""
      get :show, params: { :format => 'json', :id => "37" }
    end

    it "retrieves the grouped forms that are permitted to this user and tracing request" do
      TracingRequest.stub(:get).with("37").and_return(mock_tracing_request({:module_id => 'primeromodule-cp'}))
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      TracingRequest.stub(:allowed_formsections).and_return(grouped_forms)
      allow(@mock_tracing_request).to receive(:display_id).and_return('37')
      allow(@mock_tracing_request).to receive(:owned_by).and_return('test_owner')
      get :show, params: { :id => "37" }
      assigns[:form_sections].should == grouped_forms
    end

    it "should flash an error and go to listing page if the resource is not found" do
      TracingRequest.stub(:get).with("invalid record").and_return(nil)
      controller.stub :get_form_sections
      get :show, params: { :id=> "invalid record" }
      flash[:error].should == "Tracing request with the given id is not found"
      response.should redirect_to(:action => :index)
    end

    #TODO - duplicates fetch commented out for performance reasons
    xit "should include duplicate records in the response" do
      TracingRequest.stub(:allowed_formsections).and_return({})
      TracingRequest.stub(:get).with("37").and_return(mock_tracing_request({:module_id => 'primeromodule-cp'}))
      duplicates = [TracingRequest.new(:name => "duplicated")]
      TracingRequest.should_receive(:duplicates_of).with("37").and_return(duplicates)
      controller.stub :get_form_sections
      get :show, params: { :id => "37" }
      assigns[:duplicates].should == duplicates
    end
  end

  describe "GET new" do
    it "assigns a new tracing request as @tracing_request" do
      TracingRequest.stub(:allowed_formsections).and_return({})
      TracingRequest.stub(:new).and_return(mock_tracing_request)
      get :new
      assigns[:tracing_request].should equal(mock_tracing_request)
    end

    it "retrieves the grouped forms that are permitted to this user and tracing request" do
      controller.stub(:make_new_record).and_return(mock_tracing_request)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      TracingRequest.stub(:allowed_formsections).and_return(grouped_forms)
      get :new, params: { :id => "37" }
      assigns[:form_sections].should == grouped_forms
    end
  end

  describe "GET edit" do
    it "assigns the requested tracing request as @tracing_request" do
      TracingRequest.stub(:allowed_formsections).and_return({})
      TracingRequest.stub(:get).with("37").and_return(mock_tracing_request)
      controller.stub :get_form_sections
      allow(@mock_tracing_request).to receive(:display_id).and_return('37')
      allow(@mock_tracing_request).to receive(:owned_by).and_return('test_owner')
      get :edit, params: { :id => "37" }
      assigns[:tracing_request].should equal(mock_tracing_request)
    end

    it "retrieves the grouped forms that are permitted to this user and tracing request" do
      TracingRequest.stub(:get).with("37").and_return(mock_tracing_request)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      TracingRequest.stub(:allowed_formsections).and_return(grouped_forms)
      allow(@mock_tracing_request).to receive(:display_id).and_return('37')
      allow(@mock_tracing_request).to receive(:owned_by).and_return('test_owner')
      get :edit, params: { :id => "37" }
      assigns[:form_sections].should == grouped_forms
    end
  end

  describe "PUT update" do
    before :each do
      TracingRequest.stub(:permitted_property_names).and_return(['last_known_location', 'reunited', 'relation_name', 'unique_identifier', 'created_by', 'current_user_full_name'])
    end
    it "should update tracing request on a field and photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      tracing_request = TracingRequest.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      put :update, params: { :id => tracing_request.id,
        :tracing_request => {
          :relation_name => "Bill",
          :photo => Rack::Test::UploadedFile.new(uploadable_photo_jeff) }}

      assigns[:tracing_request]['relation_name'].should == "Bill"
      assigns[:tracing_request]['_attachments'].size.should == 2
      assigns[:tracing_request]['_attachments']["jeff"]['data'].should_not be_blank
    end

    it "should update only non-photo fields when no photo update" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      tracing_request = TracingRequest.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")

      put :update, params: { :id => tracing_request.id,
        :tracing_request => {
          :relation_name => 'Bill',
          :reunited => 'false' }}

      assigns[:tracing_request]['relation_name'].should == 'Bill'
      assigns[:tracing_request]['reunited'].should == false
      assigns[:tracing_request]['_attachments'].size.should == 1
    end

    it "should allow a records ID to be specified to create a new record with a known id" do
      new_uuid = UUIDTools::UUID.random_create()
      put :update, params: { :id => new_uuid.to_s,
        :tracing_request => {
            :id => new_uuid.to_s,
            :_id => new_uuid.to_s,
            :last_known_location => "London",
            :age => "7"
        }}
      TracingRequest.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    end

    it "should update the last_updated_by_full_name field with the logged in user full name" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'existing tracing_request'})
      TracingRequest.stub(:get).with("123").and_return(tracing_request)
      subject.should_receive('current_user_full_name').and_return('Bill Clinton')

      put :update, params: { :id => 123, :tracing_request => {:flag => true, :flag_message => "Test" }}

      tracing_request.last_updated_by_full_name.should == 'Bill Clinton'
    end

    it "should not set photo if photo is not passed" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'some name'})
      params_tracing_request = {"relation_name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      tracing_request.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_tracing_request)
      TracingRequest.stub(:get).and_return(tracing_request)
      put :update, params: { :id => '1', :tracing_request => params_tracing_request }
    end

    it "should delete the audio if checked delete_tracing_request_audio checkbox" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'some name'})
      params_tracing_request = {"relation_name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      tracing_request.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, true, params_tracing_request)
      TracingRequest.stub(:get).and_return(tracing_request)
      put :update, params: { :id => '1', :tracing_request => params_tracing_request, :delete_tracing_request_audio => "1" }
    end

    it "should redirect to redirect_url if it is present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'some name'})
      params_tracing_request = {"relation_name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      tracing_request.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_tracing_request)
      TracingRequest.stub(:get).and_return(tracing_request)
      put :update, params: { :id => '1', :tracing_request => params_tracing_request, :redirect_url => '/cases' }
      response.should redirect_to '/cases?follow=true'
    end

    it "should redirect to case page if redirect_url is not present in params" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'some name'})

      params_tracing_request = {"relation_name" => 'update'}
      controller.stub(:current_user_name).and_return("user_name")
      tracing_request.should_receive(:update_properties_with_user_name).with("user_name", "", {}, nil, false, params_tracing_request)
      TracingRequest.stub(:get).and_return(tracing_request)
      put :update, params: { :id => '1', :tracing_request => params_tracing_request }
      response.should redirect_to "/tracing_requests/#{tracing_request.id}?follow=true"
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
    #   search = double("search", :query => 'the tracing_request name', :valid? => true, :page => 1)
    #   Search.stub(:new).and_return(search)

    #   fake_results = ["fake_tracing_request","fake_tracing_request"]
    #   fake_full_results =  [:fake_tracing_request,:fake_tracing_request, :fake_tracing_request, :fake_tracing_request]
    #   TracingRequest.should_receive(:search).with(search, 1).and_return([fake_results, fake_full_results])
    #   get(:search, :format => 'html', :query => 'the tracing_request name')
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
  #   it "should only list the tracing requests which the user has registered" do
  #     search = double("search", :query => 'some_name', :valid? => true, :page => 1)
  #     Search.stub(:new).and_return(search)

  #     fake_results = [:fake_tracing_request,:fake_tracing_request]
  #     fake_full_results =  [:fake_tracing_request,:fake_tracing_request, :fake_tracing_request, :fake_tracing_request]
  #     TracingRequest.should_receive(:search_by_created_user).with(search, @session.user_name, 1).and_return([fake_results, fake_full_results])

  #     get(:search, :query => 'some_name')
  #     assigns[:results].should == fake_results
  #   end
  # end

  xit 'should export tracing requests using #respond_to_export' do
    tracing_request1 = build :tracing_request
    tracing_request2 = build :tracing_request
    controller.stub :paginated_collection => [ tracing_request1, tracing_request2 ], :render => true
    controller.should_receive(:YAY).and_return(true)

    controller.should_receive(:respond_to_export) { |format, tracing_requests|
      format.mock { controller.send :YAY }
      tracing_requests.should == [ tracing_request1, tracing_request2 ]
    }

    get :index, params: { :format => :mock }
  end

  describe '#respond_to_export' do
    before :each do
      @tracing_request1 = build :tracing_request
      @tracing_request2 = build :tracing_request
      controller.stub :paginated_collection => [ @tracing_request1, @tracing_request2 ], :render => true
      TracingRequest.stub :list_records => double(:results => [@tracing_request1, @tracing_request2 ], :total => 2)
    end

    context 'show' do
      it 'exports 1 record' do
        get :show, params: {id: @tracing_request1.id}, format: :csv
        expect(response.header['Content-Type']).to include 'application/zip'
        expect(response.header['Content-Disposition']).to include "#{@tracing_request1.unique_identifier}.csv.zip"
      end
    end

    context 'index' do
      it "should handle CSV" do
        Exporters::CSVExporter.should_receive(:export).with([ @tracing_request1, @tracing_request2 ], anything, anything, anything).and_return('data')
        get :index, format: :csv
      end

      it "should encrypt result" do
        password = 's3cr3t'
        Exporters::CSVExporter.should_receive(:export).with([ @tracing_request1, @tracing_request2 ], anything, anything, anything).and_return('data')
        # controller.should_receive(:export_filename).with([ @tracing_request1, @tracing_request2 ], Exporters::CSVExporter).and_return("test_filename")
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
      @tracing_request = stub_model(TracingRequest, :id => "id")
      @photo_key = "key"
      @tracing_request.stub(:primary_photo_id=)
      @tracing_request.stub(:save)
      TracingRequest.stub(:get).with("id").and_return @tracing_request
    end

    it "set the primary photo on the tracing request and save" do
      @tracing_request.should_receive(:primary_photo_id=).with(@photo_key)
      @tracing_request.should_receive(:save)

      put :select_primary_photo, params: { :tracing_request_id => @tracing_request.id, :photo_id => @photo_key }
    end

    it "should return success" do
      put :select_primary_photo, params: { :tracing_request_id => @tracing_request.id, :photo_id => @photo_key }

      response.should be_success
    end

    context "when setting new primary photo id errors" do
      before :each do
        @tracing_request.stub(:primary_photo_id=).and_raise("error")
      end

      it "should return error" do
        put :select_primary_photo, params: { :tracing_request_id => @tracing_request.id, :photo_id => @photo_key }

        response.should be_error
      end
    end
  end

  # TODO: Bug - JIRA Ticket: https://quoinjira.atlassian.net/browse/PRIMERO-136
  #
  # I switch between the latest and tag 1.0.0.1 to find out what is causing the issue.
  # In the older tag, the add_to_history method in the records_helper.rb is not being call where in the latest it is.
  # The latest is not being sent the creator and created_at information. This is not an issue on the
  # front-end, but only in the rspec test.
  #
  # describe "PUT create" do
  #   it "should add the full user_name of the user who created the TracingRequest record" do
  #     TracingRequest.should_receive('new_with_user_name').and_return(tracing_request = TracingRequest.new)
  #     controller.should_receive('current_user_full_name').and_return('Bill Clinton')
  #     put :create, :tracing_request => {:name => 'Test TracingRequest' }
  #     tracing_request['created_by_full_name'].should=='Bill Clinton'
  #   end
  # end

#TODO do we need sync as is for child?
#  describe "sync_unverified" do
#    before :each do
#      @user = build :user, :verified => false, :role_ids => []
#      fake_login @user
#    end
#
#    it "should mark all tracing requests created as verified/unverifid based on the user" do
#      @user.verified = true
#      TracingRequest.should_receive(:new_with_user_name).with(@user, {"name" => "timmy", "verified" => @user.verified?}).and_return(tracing_request = TracingRequest.new)
#      tracing_request.should_receive(:save).and_return true
#
#      post :sync_unverified, {:tracing_request => {:name => "timmy"}, :format => :json}
#
#      @user.verified = true
#    end
#
#    it "should set the created_by name to that of the user matching the params" do
#      TracingRequest.should_receive(:new_with_user_name).and_return(tracing_request = TracingRequest.new)
#      tracing_request.should_receive(:save).and_return true
#
#      post :sync_unverified, {:tracing_request => {:name => "timmy"}, :format => :json}
#
#      tracing_request['created_by_full_name'].should eq @user.full_name
#    end
#
#    it "should update the tracing_request instead of creating new tracing_request everytime" do
#      tracing_request = TracingRequest.new
#      view = double(CouchRest::Model::Designs::View)
#      TracingRequest.should_receive(:by_short_id).with(:key => '1234567').and_return(view)
#      view.should_receive(:first).and_return(tracing_request)
#      controller.should_receive(:update_tracing_request_from).and_return(tracing_request)
#      tracing_request.should_receive(:save).and_return true
#
#      post :sync_unverified, {:tracing_request => {:name => "timmy", :unique_identifier => '12345671234567'}, :format => :json}
#
#      tracing_request['created_by_full_name'].should eq @user.full_name
#    end
#  end

  describe "POST create" do
    it "should update the tracing request record instead of creating if record already exists" do
      TracingRequest.stub(:permitted_properties).and_return(TracingRequest.properties)
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      tracing_request = TracingRequest.new_with_user_name(user, {:relation_name => 'old name'})
      tracing_request.save
      fake_admin_login
      controller.stub(:authorize!)
      post :create, params: { :tracing_request => {:unique_identifier => tracing_request.unique_identifier, :relation_name => 'new name' }}
      updated_tracing_request = TracingRequest.by_short_id(:key => tracing_request.short_id)
      updated_tracing_request.all.size.should == 1
      updated_tracing_request.first.relation_name.should == 'new name'
    end
  end

  describe "reindex_params_subforms" do

    it "should correct indexing for nested subforms" do
      params = {
        "tracing_request"=> {
          "name"=>"",
         "top_1"=>"This is a top value",
          "nested_form_section" => {
            "0"=>{"nested_1"=>"Keep", "nested_2"=>"Keep", "nested_3"=>"Keep"},
           "2"=>{"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"}},
          "fathers_name"=>""}}

      controller.reindex_hash params['tracing_request']
      expected_subform = params["tracing_request"]["nested_form_section"]["1"]

      expect(expected_subform.present?).to be_truthy
      expect(expected_subform).to eq({"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"})
    end

  end

end
