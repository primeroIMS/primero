require 'spec_helper'

# def inject_export_generator( fake_export_generator, incident_data )
	# ExportGenerator.stub(:new).with(incident_data).and_return( fake_export_generator )
# end
#
# def stub_out_export_generator incident_data = []
	# inject_export_generator( stub_export_generator = stub(ExportGenerator) , incident_data)
	# stub_export_generator.stub(:incident_photos).and_return('')
	# stub_export_generator
# end

def stub_out_incident_get(mock_incident = double(Incident))
	Incident.stub(:get).and_return( mock_incident )
	mock_incident
end

describe IncidentsController do

  before :each do
    fake_admin_login
  end

  def mock_incident(stubs={})
    @mock_incident ||= mock_model(Incident, stubs).as_null_object
  end

  def stub_form(stubs={})
    form = stub_model(FormSection) do |form|
      form.fields = [stub_model(Field)]
    end
  end

  it 'GET reindex' do
    Incident.should_receive(:reindex!).and_return(nil)
    get :reindex
    response.should be_success
  end



  describe '#authorizations' do
    describe 'collection' do
      it "GET index" do
        @controller.current_ability.should_receive(:can?).with(:index, Incident).and_return(false);
        get :index
        response.status.should == 403
      end

      it "GET search" do
        @controller.current_ability.should_receive(:can?).with(:index, Incident).and_return(false);
        get :search
        response.status.should == 403
      end

      it "GET new" do
        @controller.current_ability.should_receive(:can?).with(:create, Incident).and_return(false);
        get :new
        response.status.should == 403
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, Incident).and_return(false);
        post :create
        response.status.should == 403
      end

    end

    describe 'member' do
      before :each do
        User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
        @incident = Incident.create('last_known_location' => "London", :short_id => 'short_id', :created_by => "uname")
        @incident_arg = hash_including("_id" => @incident.id)
      end

      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @incident_arg).and_return(false);
         get :show, :id => @incident.id
         response.status.should == 403
      end

      it "PUT update" do
        @controller.current_ability.should_receive(:can?).with(:update, @incident_arg).and_return(false);
        put :update, :id => @incident.id
        response.status.should == 403
      end

      it "DELETE destroy" do
        @controller.current_ability.should_receive(:can?).with(:destroy, @incident_arg).and_return(false);
        delete :destroy, :id => @incident.id
        response.status.should == 403
      end
    end
  end

  describe "GET index" do

    shared_examples_for "viewing incidents by user with access to all data" do
      describe "when the signed in user has access all data" do
        before do
          fake_mrm_admin_login
          @options ||= {}
          @stubs ||= {}
        end

        it "should assign all incidents as @incidents" do
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          incidents = [mock_incident(@stubs)]
          @status ||= "all"
          incidents.stub(:paginate).and_return(incidents)
          Incident.should_receive(:fetch_paginated).with(@options, page, per_page).and_return([1, incidents])

          get :index, :status => @status
          assigns[:incidents].should == incidents
        end
      end
    end

    shared_examples_for "viewing incidents as a mrm worker" do
      describe "when the signed in user is a field worker" do
        before do
          @session = fake_mrm_worker_login
          @stubs ||= {}
          @options ||= {}
          @params ||= {}
        end

        it "should assign the incidents created by the user as @incidents" do
          incidents = [mock_incident(@stubs)]
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          @status ||= "all"
          incidents.stub(:paginate).and_return(incidents)
          Incident.should_receive(:fetch_paginated).with(@options, page, per_page).and_return([1, incidents])
          @params.merge!(:status => @status)
          get :index, @params
          assigns[:incidents].should == incidents
        end
      end
    end

    context "viewing all incidents" do
      before { @stubs = { :reunited? => false } }
      context "when status is passed for admin" do
        before { @status = "all"}
        before {@options = {:startkey=>["all"], :endkey=>["all", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_name}}
        it_should_behave_like "viewing incidents by user with access to all data"
      end

      context "when status is passed for mrm worker" do
        before { @status = "all"}
        before {@options = {:startkey=>["all", "fakemrmworker"], :endkey=>["all","fakemrmworker", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_with_created_by_created_at}}

        it_should_behave_like "viewing incidents as a mrm worker"
      end

      context "when status is not passed admin" do
        before {@options = {:startkey=>["all"], :endkey=>["all", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_name}}
        it_should_behave_like "viewing incidents by user with access to all data"
      end

      context "when status is not passed mrm worker" do
        before {@options = {:startkey=>["all", "fakemrmworker"], :endkey=>["all","fakemrmworker", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_with_created_by_created_at}}
        it_should_behave_like "viewing incidents as a mrm worker"
      end

      context "when status is not passed mrm worker and order is name" do
        before {@options = {:startkey=>["all", "fakemrmworker"], :endkey=>["all","fakemrmworker", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_with_created_by_name}}
        before {@params = {:order_by => 'name'}}
        it_should_behave_like "viewing incidents as a mrm worker"
      end

      context "when status is not passed mrm worker, order is created_at and page is 2" do
        before {@options = {:view_name=>:by_valid_record_view_with_created_by_created_at, :startkey=>["all", "fakemrmworker", {}], :endkey=>["all", "fakemrmworker"], :descending=>true, :page=>2, :per_page=>20}}
        before {@params = {:order_by => 'created_at', :page => 2}}
        it_should_behave_like "viewing incidents as a mrm worker"
      end
    end

    # context "viewing active incidents" do
      # before do
        # @status = "active"
        # @stubs = {:reunited? => false}
      # end
      # context "admin" do
        # before {@options = {:startkey=>["active"], :endkey=>["active", {}], :page=>1, :per_page=>20, :view_name=>:by_all_view_name}}
        # it_should_behave_like "viewing incidents by user with access to all data"
      # end
      # context "field worker" do
        # before {@options = {:startkey=>["active", "fakefieldworker"], :endkey=>["active", "fakefieldworker", {}], :page=>1, :per_page=>20, :view_name=>:by_all_view_with_created_by_created_at}}
        # it_should_behave_like "viewing incidents as a field worker"
      # end
    # end
#
    # describe "export all to PDF/CSV/CPIMS/Photo Wall" do
      # before do
        # fake_field_admin_login
        # @params ||= {}
        # controller.stub :paginated_collection => [], :render => true
      # end
      # it "should flash notice when exporting no records" do
        # format = "cpims"
        # @params.merge!(:format => format)
        # get :index, @params
        # flash[:notice].should == "No Records Available!"
      # end
    # end
  end

  describe "GET show" do
    it 'does not assign incident name in page name' do
      incident = build :incident, :unique_identifier => "1234"
      controller.stub :render
      get :show, :id => incident.id
      assigns[:page_name].should == "View Incident 1234"
    end

    it "assigns the requested incident" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      get :show, :id => "37"
      assigns[:incident].should equal(mock_incident)
    end

    it "orders and assigns the forms" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      the_form = [stub_form].group_by{|e| e.form_group_name}
      FormSection.should_receive(:find_form_groups_by_parent_form).and_return(the_form)
      get :show, :id => "37"
      assigns[:form_sections].should == the_form
    end

    it "should flash an error and go to listing page if the resource is not found" do
      Incident.stub(:get).with("invalid record").and_return(nil)
      get :show, :id=> "invalid record"
      flash[:error].should == "Incident with the given id is not found"
      response.should redirect_to(:action => :index)
    end

    it "should include duplicate records in the response" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      duplicates = [Incident.new(:name => "duplicated")]
      Incident.should_receive(:duplicates_of).with("37").and_return(duplicates)
      get :show, :id => "37"
      assigns[:duplicates].should == duplicates
    end
  end

  describe "GET new" do
    it "assigns a new incident as @incident" do
      Incident.stub(:new).and_return(mock_incident)
      get :new
      assigns[:incident].should equal(mock_incident)
    end

    it "orders and assigns the forms" do
      Incident.stub(:new).and_return(mock_incident)
      the_form = [stub_form].group_by{|e| e.form_group_name}
      FormSection.should_receive(:find_form_groups_by_parent_form).and_return(the_form)
      get :new
      assigns[:form_sections].should == the_form
    end
  end

  describe "GET edit" do
    it "assigns the requested incident as @incident" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      the_form = stub_form
      FormSection.should_receive(:find_by_parent_form).and_return([the_form])
      get :edit, :id => "37"
      assigns[:incident].should equal(mock_incident)
    end

    it "orders and assigns the forms" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      the_form = [stub_form].group_by{|e| e.form_group_name}
      FormSection.should_receive(:find_form_groups_by_parent_form).and_return(the_form)
      get :edit, :id => "37"
      assigns[:form_sections].should == the_form
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested incident" do
      Incident.should_receive(:get).with("37").and_return(mock_incident)
      mock_incident.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the incidents list" do
      Incident.stub(:get).and_return(mock_incident(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(incidents_url)
    end
  end

  # describe "PUT update" do
    # it "should sanitize the parameters if the params are sent as string(params would be as a string hash when sent from mobile)" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Incident.create('last_known_location' => "London", :created_by => "uname", :created_at => "Jan 16 2010 14:05:32")
      # incident.attributes = {'histories' => [] }
      # incident.save!
#
      # Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      # histories = "[{\"datetime\":\"2013-02-01 04:49:29UTC\",\"user_name\":\"rapidftr\",\"changes\":{\"photo_keys\":{\"added\":[\"photo-671592136-2013-02-01T101929\"],\"deleted\":null}},\"user_organisation\":\"N\\/A\"}]"
      # put :update, :id => incident.id,
           # :incident => {
               # :last_known_location => "Manchester",
               # :histories => histories
           # }
#
     # assigns[:incident]['histories'].should == JSON.parse(histories)
    # end

    # it "should update incident on a field and photo update" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Incident.create('last_known_location' => "London", :created_by => "uname")
#
      # Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      # put :update, :id => incident.id,
        # :incident => {
          # :last_known_location => "Manchester",
          # :photo => Rack::Test::UploadedFile.new(uploadable_photo_jeff) }
#
      # assigns[:incident]['last_known_location'].should == "Manchester"
      # assigns[:incident]['_attachments'].size.should == 2
      # updated_photo_key = assigns[:incident]['_attachments'].keys.select {|key| key =~ /photo.*?-2010-01-17T140532/}.first
      # assigns[:incident]['_attachments'][updated_photo_key]['data'].should_not be_blank
    # end

    # it "should update only non-photo fields when no photo update" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Incident.create('last_known_location' => "London", :created_by => "uname")
#
      # put :update, :id => incident.id,
        # :incident => {
          # :last_known_location => "Manchester",
          # :age => '7'}
#
      # assigns[:incident]['last_known_location'].should == "Manchester"
      # assigns[:incident]['age'].should == "7"
      # assigns[:incident]['_attachments'].size.should == 1
    # end

    # it "should not update history on photo rotation" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.create('last_known_location' => "London", 'photo' => uploadable_photo_jeff, :created_by => "uname")
      # Child.get(incident.id)["histories"].size.should be 1
#
      # expect{put(:update_photo, :id => incident.id, :incident => {:photo_orientation => "-180"})}.to_not change{Child.get(incident.id)["histories"].size}
    # end

    # it "should allow a records ID to be specified to create a new record with a known id" do
      # new_uuid = UUIDTools::UUID.random_create()
      # put :update, :id => new_uuid.to_s,
        # :incident => {
            # :id => new_uuid.to_s,
            # :_id => new_uuid.to_s,
            # :last_known_location => "London",
            # :age => "7"
        # }
      # Child.get(new_uuid.to_s)[:unique_identifier].should_not be_nil
    # end

    # it "should update flag (cast as boolean) and flag message" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")
      # put :update, :id => incident.id,
        # :incident => {
          # :flag => true,
          # :flag_message => "Possible Duplicate"
        # }
      # assigns[:incident]['flag'].should be_true
      # assigns[:incident]['flag_message'].should == "Possible Duplicate"
    # end

    # it "should update history on flagging of record" do
      # current_time_in_utc = Time.parse("20 Jan 2010 17:10:32UTC")
      # current_time = Time.parse("20 Jan 2010 17:10:32")
      # Clock.stub(:now).and_return(current_time)
      # current_time.stub(:getutc).and_return current_time_in_utc
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.create('last_known_location' => "London", 'photo' => uploadable_photo_jeff, :created_by => "uname")
#
      # put :update, :id => incident.id, :incident => {:flag => true, :flag_message => "Test"}
#
      # history = Child.get(incident.id)["histories"].first
      # history['changes'].should have_key('flag')
      # history['datetime'].should == "2010-01-20 17:10:32UTC"
    # end

    # it "should update the last_updated_by_full_name field with the logged in user full name" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'existing incident'})
      # Child.stub(:get).with("123").and_return(incident)
      # subject.should_receive('current_user_full_name').and_return('Bill Clinton')
#
      # put :update, :id => 123, :incident => {:flag => true, :flag_message => "Test"}
#
      # incident['last_updated_by_full_name'].should=='Bill Clinton'
    # end
#
    # it "should not set photo if photo is not passed" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident
      # end
#
    # it "should delete the audio if checked delete_incident_audio checkbox" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, true, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident, :delete_incident_audio => "1"
    # end
#
    # it "should redirect to redirect_url if it is present in params" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident, :redirect_url => '/cases'
      # response.should redirect_to '/cases?follow=true'
    # end
#
    # it "should redirect to case page if redirect_url is not present in params" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
#
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident
      # response.should redirect_to "/cases/#{incident.id}?follow=true"
    # end

  # end

  describe "GET search" do
    it "should not render error by default" do
      get(:search, :format => 'html')
      assigns[:search].should be_nil
    end

    it "should render error if search is invalid" do
      get(:search, :format => 'html', :query => '2'*160)
      search = assigns[:search]
      search.errors.should_not be_empty
    end

    it "should stay in the page if search is invalid" do
      get(:search, :format => 'html', :query => '1'*160)
      response.should render_template("search")
    end

    it "performs a search using the parameters passed to it" do
      search = double("search", :query => 'the incident name', :valid? => true, :page => 1)
      Search.stub(:new).and_return(search)

      fake_results = ["fake_incident","fake_incident"]
      fake_full_results =  [:fake_incident,:fake_incident, :fake_incident, :fake_incident]
      Incident.should_receive(:search).with(search, 1).and_return([fake_results, fake_full_results])
      get(:search, :format => 'html', :query => 'the incident name')
      assigns[:results].should == fake_results
    end

    describe "with no results" do
      before do
        get(:search, :query => 'blah')
      end

      it 'asks view to not show csv export link if there are no results' do
        assigns[:results].size.should == 0
      end

      it 'asks view to display a "No results found" message if there are no results' do
        assigns[:results].size.should == 0
      end

    end
  end

  describe "searching as mrm worker" do
    before :each do
      @session = fake_mrm_worker_login
    end
    it "should only list the incidents which the user has registered" do
      search = double("search", :query => 'some_name', :valid? => true, :page => 1)
      Search.stub(:new).and_return(search)

      fake_results = [:fake_incident,:fake_incident]
      fake_full_results =  [:fake_incident,:fake_incident, :fake_incident, :fake_incident]
      Incident.should_receive(:search_by_created_user).with(search, @session.user_name, 1).and_return([fake_results, fake_full_results])

      get(:search, :query => 'some_name')
      assigns[:results].should == fake_results
    end
  end

  it 'should export incidents using #respond_to_export' do
    incident1 = build :incident
    incident2 = build :incident
    controller.stub :paginated_collection => [ incident1, incident2 ], :render => true
    controller.should_receive(:YAY).and_return(true)

    controller.should_receive(:respond_to_export) { |format, incidents|
      format.mock { controller.send :YAY }
      incidents.should == [ incident1, incident2 ]
    }

    get :index, :format => :mock
  end

  it 'should export incident using #respond_to_export' do
    incident = build :incident
    controller.stub :render => true
    controller.should_receive(:YAY).and_return(true)

    controller.should_receive(:respond_to_export) { |format, incidents|
      format.mock { controller.send :YAY }
      incidents.should == [ incident ]
    }

    get :show, :id => incident.id, :format => :mock
  end

  # describe '#respond_to_export' do
    # before :each do
      # @incident1 = build :incident
      # @incident2 = build :incident
      # controller.stub :paginated_collection => [ @incident1, @incident2 ], :render => true
    # end
#
    # it "should handle full PDF" do
      # Addons::PdfExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # get :index, :format => :pdf
    # end
#
    # it "should handle Photowall PDF" do
      # Addons::PhotowallExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # get :index, :format => :photowall
    # end
#
    # it "should handle CSV" do
      # Addons::CsvExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # get :index, :format => :csv
    # end
#
    # it "should handle custom export addon" do
      # mock_addon = double()
      # mock_addon_class = double(:new => mock_addon, :id => "mock")
      # RapidftrAddon::ExportTask.stub :active => [ mock_addon_class ]
      # controller.stub(:authorize!)
      # mock_addon.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # get :index, :format => :mock
    # end
#
    # it "should encrypt result" do
      # Addons::CsvExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # controller.should_receive(:export_filename).with([ @incident1, @incident2 ], Addons::CsvExportTask).and_return("test_filename")
      # controller.should_receive(:encrypt_exported_files).with('data', 'test_filename').and_return(true)
      # get :index, :format => :csv
    # end
#
    # it "should create a log_entry when record is exported" do
      # fake_login User.new(:user_name => 'fakeuser', :organisation => "STC", :role_ids => ["abcd"])
      # @controller.stub(:authorize!)
      # RapidftrAddonCpims::ExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
#
      # LogEntry.should_receive(:create!).with :type => LogEntry::TYPE[:cpims], :user_name => "fakeuser", :organisation => "STC", :incident_ids => [@incident1.id, @incident2.id]
#
      # get :index, :format => :cpims
    # end
#
    # it "should generate filename based on incident ID and addon ID when there is only one incident" do
      # @incident1.stub :short_id => 'test_short_id'
      # controller.send(:export_filename, [ @incident1 ], Addons::PhotowallExportTask).should == "test_short_id_photowall.zip"
    # end
#
    # it "should generate filename based on username and addon ID when there are multiple incidents" do
      # controller.stub :current_user_name => 'test_user'
      # controller.send(:export_filename, [ @incident1, @incident2 ], Addons::PdfExportTask).should == "test_user_pdf.zip"
    # end
#
    # it "should handle CSV" do
      # Addons::CsvExportTask.any_instance.should_receive(:export).with([ @incident1, @incident2 ]).and_return('data')
      # get :index, :format => :csv
    # end
#
  # end

  # describe "PUT select_primary_photo" do
    # before :each do
      # @incident = stub_model(Child, :id => "id")
      # @photo_key = "key"
      # @incident.stub(:primary_photo_id=)
      # @incident.stub(:save)
      # Child.stub(:get).with("id").and_return @incident
    # end
#
    # it "set the primary photo on the incident and save" do
      # @incident.should_receive(:primary_photo_id=).with(@photo_key)
      # @incident.should_receive(:save)
#
      # put :select_primary_photo, :incident_id => @incident.id, :photo_id => @photo_key
    # end
#
    # it "should return success" do
      # put :select_primary_photo, :incident_id => @incident.id, :photo_id => @photo_key
#
      # response.should be_success
    # end
#
    # context "when setting new primary photo id errors" do
      # before :each do
        # @incident.stub(:primary_photo_id=).and_raise("error")
      # end
#
      # it "should return error" do
        # put :select_primary_photo, :incident_id => @incident.id, :photo_id => @photo_key
#
        # response.should be_error
      # end
    # end
  # end

  # TODO: Bug - JIRA Ticket: https://quoinjira.atlassian.net/browse/PRIMERO-136
  #
  # I switch between the latest and tag 1.0.0.1 to find out what is causing the issue.
  # In the older tag, the add_to_history method in the records_helper.rb is not being call where in the latest it is.
  # The latest is not being sent the creator and created_at information. This is not an issue on the
  # front-end, but only in the rspec test.
  #
  # describe "PUT create" do
  #   it "should add the full user_name of the user who created the Child record" do
  #     Child.should_receive('new_with_user_name').and_return(incident = Child.new)
  #     controller.should_receive('current_user_full_name').and_return('Bill Clinton')
  #     put :create, :incident => {:name => 'Test Child' }
  #     incident['created_by_full_name'].should=='Bill Clinton'
  #   end
  # end

  # describe "sync_unverified" do
    # before :each do
      # @user = build :user, :verified => false, :role_ids => []
      # fake_login @user
    # end
#
    # it "should mark all incidents created as verified/unverifid based on the user" do
      # @user.verified = true
      # Child.should_receive(:new_with_user_name).with(@user, {"name" => "timmy", "verified" => @user.verified?}).and_return(incident = Child.new)
      # incident.should_receive(:save).and_return true
#
      # post :sync_unverified, {:incident => {:name => "timmy"}, :format => :json}
#
      # @user.verified = true
    # end
#
    # it "should set the created_by name to that of the user matching the params" do
      # Child.should_receive(:new_with_user_name).and_return(incident = Child.new)
      # incident.should_receive(:save).and_return true
#
      # post :sync_unverified, {:incident => {:name => "timmy"}, :format => :json}
#
      # incident['created_by_full_name'].should eq @user.full_name
    # end
#
    # it "should update the incident instead of creating new incident everytime" do
      # incident = Child.new
      # view = double(CouchRest::Model::Designs::View)
      # Child.should_receive(:by_short_id).with(:key => '1234567').and_return(view)
      # view.should_receive(:first).and_return(incident)
      # controller.should_receive(:update_incident_from).and_return(incident)
      # incident.should_receive(:save).and_return true
#
      # post :sync_unverified, {:incident => {:name => "timmy", :unique_identifier => '12345671234567'}, :format => :json}
#
      # incident['created_by_full_name'].should eq @user.full_name
    # end
  # end

  describe "POST create" do
    it "should update the incident record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organisation => 'org'))
      incident = Incident.new_with_user_name(user, {:name => 'old name'})
      incident.save
      fake_admin_login
      controller.stub(:authorize!)
      #binding.pry
      post :create, :incident => {:unique_identifier => incident.unique_identifier, :name => 'new name'}
      updated_incident = Incident.by_short_id(:key => incident.short_id)
      updated_incident.all.size.should == 1
      #binding.pry
      updated_incident.first.name.should == 'new name'
    end
  end

	describe "reindex_params_subforms" do

		it "should correct indexing for nested subforms" do
			params = {
				"incident"=> {
					"name"=>"",
	   		 "top_1"=>"This is a top value",
	        "nested_form_section" => {
						"0"=>{"nested_1"=>"Keep", "nested_2"=>"Keep", "nested_3"=>"Keep"},
	     		 "2"=>{"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"}},
	        "fathers_name"=>""}}

			controller.reindex_hash params['incident']
			expected_subform = params["incident"]["nested_form_section"]["1"]

			expect(expected_subform.present?).to be_true
			expect(expected_subform).to eq({"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"})
		end

	end

end
