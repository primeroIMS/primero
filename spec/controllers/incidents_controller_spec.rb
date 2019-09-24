require 'rails_helper'

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

describe IncidentsController, :type => :controller do

  before do
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: "en",
      primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  before :each do |example|
    Incident.any_instance.stub(:field_definitions).and_return([])
    Incident.any_instance.stub(:permitted_properties).and_return(Incident.properties)
    unless example.metadata[:skip_session]
      fake_admin_login
    end
  end

  def mock_incident(stubs={})
    @mock_incident ||= mock_model(Incident, stubs).as_null_object
  end

  def stub_form(stubs={})
    form = stub_model(FormSection) do |form|
      form.fields = [stub_model(Field)]
    end
  end

  describe '#authorizations' do
    describe 'collection' do
      before do
        Ability.any_instance.stub(:can?).with(anything, Incident).and_return(false)
        Ability.any_instance.stub(:can?).with(anything, Dashboard).and_return(false)
      end

      it "GET index" do
        get :index
        expect(response).to be_forbidden
      end

      xit "GET search" do
        @controller.current_ability.should_receive(:can?).with(:index, Incident).and_return(false)
        controller.stub :get_form_sections
        get :search
        response.status.should == 403
      end

      it "GET new" do
        @controller.current_ability.should_receive(:can?).with(:create, Incident).and_return(false)
        controller.stub :get_form_sections
        get :new
        response.status.should == 403
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, Incident).and_return(false)
        post :create
        response.status.should == 403
      end

    end

    describe 'member' do
      before :each do
        User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
        @incident = Incident.create('last_known_location' => "London", :short_id => 'short_id', :created_by => "uname")
        # @incident_arg = hash_including("_id" => @incident.id)
      end

      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @incident).and_return(false);
        controller.stub :get_form_sections
        get :show, params: {:id => @incident.id}
        response.status.should == 403
      end

      it "PUT update" do
        @controller.current_ability.should_receive(:can?).with(:update, @incident).and_return(false);
        put :update, params: {:id => @incident.id}
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


    #TODO: Keep these two shared examples around for future refactor
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
          incidents = mock_incident(@stubs)
          scope ||= {}
          incidents.stub(:paginate).and_return(incidents)
          Incident.should_receive(:list_records).with(scope, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, ["fakemrmadmin"], nil, nil, []).and_return(incidents)

          get :index, params: {:scope => scope}
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
          incidents = mock_incident(@stubs)
          page = @options.delete(:page)
          per_page = @options.delete(:per_page)
          @status ||= "all"
          incidents.stub(:paginate).and_return(incidents)
          Incident.should_receive(:list_records).with(@status, {:created_at=>:desc}, {:page=> page, :per_page=> per_page}, "fakemrmworker", nil, nil).and_return(incidents)
          @params.merge!(:scope => @status)
          get :index, params: @params
          assigns[:incidents].should == incidents
        end
      end
    end

    context "viewing all incidents" do
      #before { @stubs = { :reunited? => false } }
      context "when status is passed for admin" do
        before { @status = "all"}
        before {@options = {:startkey=>["all"], :endkey=>["all", {}], :page=>1, :per_page=>20, :view_name=>:by_valid_record_view_name}}
        it_should_behave_like "viewing incidents by user with access to all data"
      end
    end

    # Bulk export is now handled by bulk_export_controller and bulk_export model
    # TODO Confirm with Pavel that these can be removed
    describe "export all" do
      before do
        @session = fake_mrm_worker_login
      end

      xit "should export all incidents" do
        collection = [Incident.new, Incident.new]
        collection.should_receive(:next_page).twice.and_return(nil)
        search = double(Sunspot::Search::StandardSearch)
        search.should_receive(:results).and_return(collection)
        search.should_receive(:total).and_return(100)
        Incident.should_receive(:list_records).with({}, {:created_at=>:desc}, {:page=> 1, :per_page=> 500}, ["fakemrmworker"], nil, nil).and_return(search)
        params = {"page" => "all"}
        get :index, params: params
        assigns[:incidents].should == collection
        assigns[:total_records].should == 100
      end
    end

    describe "export list filename" do
      before do
        @password = 's3cr3t'
        @session = fake_field_worker_login
        @incident1 = Incident.new(:id => "1", :unique_identifier=> "unique_identifier-1")
        @incident2 = Incident.new(:id => "2", :unique_identifier=> "unique_identifier-2")
      end

      context 'when there are multiple records' do
        before do
          Incident.stub :list_records => double(:results => [ @incident1, @incident2 ], :total => 2)
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
            expect(response.header['Content-Disposition']).to include("#{@session.user.user_name}-incident.csv.zip")
          end
        end
      end

      context 'when there is only 1 record' do
        before do
          Incident.stub :list_records => double(:results => [ @incident1 ], :total => 1)
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
            expect(response.header['Content-Disposition']).to include("#{@incident1.unique_identifier}.csv.zip")
          end
        end
      end
    end

    describe "permissions to view lists of incident records", search: true, skip_session: true do

      before do
        User.all.each{|u| u.destroy}
        Incident.all.each{|c| c.destroy}
        Sunspot.remove_all!

        permission = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ])
        roles = [Role.new(permissions_list: [permission])]

        @incident_manager1 = create(:user)
        @incident_manager1.stub(:roles).and_return(roles)
        @incident_manager2 = create(:user)
        @incident_manager2.stub(:roles).and_return(roles)

        @incident1 = create(:incident, owned_by: @incident_manager1.user_name)
        @incident2 = create(:incident, owned_by: @incident_manager1.user_name)
        @incident3 = create(:incident, owned_by: @incident_manager2.user_name)

        Sunspot.commit
      end


      it "loads only incidents owned by or associated with this user" do
        session = fake_login @incident_manager1
        get :index
        expect(assigns[:incidents]).to match_array([@incident1, @incident2])
      end

    end

    #TODO: Why is this commented out?
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

    describe "Display manager information", skip_session: true do
      render_views

      it "should display information for user manager" do
        p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["incident"])
        user = User.new(:user_name => 'fakeadmin', :is_manager => true)
        session = fake_admin_login user
        user.should_receive(:modules).and_return([p_module], [p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should appears in the body if the user is a manager.
        response.body.should match(/<h3>Case Worker:<\/h3>/)
        response.body.should match(/<th\s+(.*)>\s*Social Worker\s*<\/th>/)
      end

      it "should not display information for user not manager" do
        p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["incident"])
        user = User.new(:user_name => 'fakeadmin', :is_manager => false)
        session = fake_admin_login user
        user.should_receive(:modules).and_return([p_module], [p_module], [p_module])
        user.should_receive(:has_module?).with(anything).and_return(true, true, true)

        get :index

        #That header should not appears in the body if the user is not a manager.
        response.body.should_not match(/<h3>Case Worker:<\/h3>/)
        response.body.should_not match(/<th\s+(.*)>\s*Social Worker\s*<\/th>/)
      end
    end

    describe "Filter by Age Range", search: true, skip_session: true do
      before :each do
        @user = fake_admin_login User.new(:user_name => 'test_user')

        FormSection.all.each &:destroy
        fields = [
            Field.new({"name" => "status",
                       "type" => "text_field",
                       "display_name_all" => "Status"
                      }),
            Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    })]
        form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"incident",
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
        Incident.any_instance.stub(:field_definitions).and_return(fields)
        Incident.refresh_form_properties

        Sunspot.setup(Incident) do
          string 'status', as: "status_sci".to_sym
          integer 'age', as: 'age_i'.to_sym
        end

        Incident.all.each &:destroy

        Sunspot.remove_all!

        create(:incident, name: "Name 1", status: Record::STATUS_OPEN, age: "5")
        @incident_age_7 = create(:incident, name: "Name 2", status: Record::STATUS_OPEN, age: "7")
        create(:incident, name: "Name 3", status: Record::STATUS_CLOSED, age: "7")
        @incident_age_15 = create(:incident, name: "Name 4", status: Record::STATUS_OPEN, age: "15")
        create(:incident, name: "Name 5", status: Record::STATUS_CLOSED, age: "15")
        @incident_age_21 = create(:incident, name: "Name 6", status: Record::STATUS_OPEN, age: "21")
        create(:incident, name: "Name 7", status: Record::STATUS_CLOSED, age: "21")

        Sunspot.commit
      end

      after :all do
        FormSection.all.each &:destroy
        Incident.all.each &:destroy
        Sunspot.remove_all!
        Sunspot.commit
        Incident.remove_form_properties
      end

      it "should filter by one range" do
        params = {"scope" => {"status" => "list||#{Record::STATUS_OPEN}", "age" => "range||6-11"}}
        get :index, params: params

        filters = {"status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["6", "11"]]}}
        expect(assigns[:filters]).to eq(filters)
        expect(assigns[:incidents].length).to eq(1)
        expect(assigns[:incidents].first).to eq(@incident_age_7)
      end

      it "should filter more than one range" do
        params = {"scope"=>{"status"=>"list||#{Record::STATUS_OPEN}", "age"=>"range||6-11||12-17"}}
        get :index, params: params

        filters = {"status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["6", "11"], ["12", "17"]]}}
        expect(assigns[:filters]).to eq(filters)
        expect(assigns[:incidents].length).to eq(2)
        expect(assigns[:incidents]).to eq([@incident_age_7, @incident_age_15])
      end

      it "should filter with open range" do
        params = {"scope"=>{"status"=>"list||#{Record::STATUS_OPEN}", "age"=>"range||18 "}}
        get :index, params: params

        filters = {"status"=>{:type=>"list", :value=>[Record::STATUS_OPEN]}, "age"=>{:type=>"range", :value=>[["18 "]]}}
        expect(assigns[:filters]).to eq(filters)
        expect(assigns[:incidents].length).to eq(1)
        expect(assigns[:incidents].first).to eq(@incident_age_21)
      end

    end

  end

  describe "GET show" do
    it 'does not assign incident name in page name' do
      incident = build :incident
      controller.stub :render
      controller.stub :get_form_sections
      get :show, params: {:id => incident.id}
      assigns[:page_name].should == "View Incident #{incident.short_id}"
    end

    it "assigns the requested incident" do
      Incident.stub(:allowed_formsections).and_return({})
      Incident.stub(:get).with("37").and_return(mock_incident({:module_id => 'primeromodule-mrm'}))
      controller.stub :get_form_sections
      allow(@mock_incident).to receive(:display_id).and_return('37')
      allow(@mock_incident).to receive(:owned_by).and_return('test_owner')
      get :show, params: {:id => "37"}
      assigns[:incident].should equal(mock_incident)
    end

    it "retrieves the grouped forms that are permitted to this user and incident" do
      Incident.stub(:get).with("37").and_return(mock_incident({:module_id => 'primeromodule-mrm'}))
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      Incident.stub(:allowed_formsections).and_return(grouped_forms)
      allow(@mock_incident).to receive(:display_id).and_return('37')
      allow(@mock_incident).to receive(:owned_by).and_return('test_owner')
      get :show, params: {:id => "37"}
      assigns[:form_sections].should == grouped_forms
    end

    it "should flash an error and go to listing page if the resource is not found" do
      Incident.stub(:get).with("invalid record").and_return(nil)
      controller.stub :get_form_sections
      get :show, params: {:id=> "invalid record"}
      flash[:error].should == "Incident with the given id is not found"
      response.should redirect_to(:action => :index)
    end
  end

  describe "GET new" do
    it "assigns a new incident as @incident" do
      Incident.stub(:allowed_formsections).and_return({})
      Incident.stub(:new).and_return(mock_incident)
      controller.stub :get_form_sections
      get :new
      assigns[:incident].should equal(mock_incident)
    end

    it "retrieves the forms that are permitted to this user and incident" do
      forms = [stub_form]
      Incident.stub(:allowed_formsections).and_return(forms)
      Incident.stub(:get).with("37").and_return(mock_incident)

      get :new, params: {:id => "37"}
      assigns[:form_sections].should == forms
    end
  end

  describe "GET edit" do
    it "assigns the requested incident as @incident" do
      Incident.stub(:allowed_formsections).and_return({})
      Incident.stub(:get).with("37").and_return(mock_incident)
      controller.stub :get_form_sections
      allow(@mock_incident).to receive(:display_id).and_return('37')
      allow(@mock_incident).to receive(:owned_by).and_return('test_owner')
      get :edit, params: {:id => "37"}
      assigns[:incident].should equal(mock_incident)
    end

    it "retrieves the grouped forms that are permitted to this user and incident" do
      Incident.stub(:get).with("37").and_return(mock_incident)
      forms = [stub_form]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      Incident.stub(:allowed_formsections).and_return(grouped_forms)
      allow(@mock_incident).to receive(:display_id).and_return('37')
      allow(@mock_incident).to receive(:owned_by).and_return('test_owner')
      get :edit, params: {:id => "37"}
      assigns[:form_sections].should == grouped_forms
    end
  end

  # describe "PUT update" do
    # it "should sanitize the parameters if the params are sent as string(params would be as a string hash when sent from mobile)" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      # incident = Incident.create('last_known_location' => "London", :created_by => "uname", :created_at => "Jan 16 2010 14:05:32")
      # incident.attributes = {'histories' => [] }
      # incident.save!
#
      # Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      # histories = "[{\"datetime\":\"2013-02-01 04:49:29UTC\",\"user_name\":\"rapidftr\",\"changes\":{\"photo_keys\":{\"added\":[\"photo-671592136-2013-02-01T101929\"],\"deleted\":null}},\"user_organization\":\"N\\/A\"}]"
      # put :update, :id => incident.id,
           # :incident => {
               # :last_known_location => "Manchester",
               # :histories => histories
           # }
#
     # assigns[:incident]['histories'].should == JSON.parse(histories)
    # end

    # it "should update incident on a field and photo update" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      # incident = Child.create('last_known_location' => "London", 'photo' => uploadable_photo, :created_by => "uname")
      # put :update, :id => incident.id,
        # :incident => {
          # :flag => true,
          # :flag_message => "Possible Duplicate"
        # }
      # assigns[:incident]['flag'].should be_truthy
      # assigns[:incident]['flag_message'].should == "Possible Duplicate"
    # end

    # it "should update history on flagging of record" do
      # current_time_in_utc = Time.parse("20 Jan 2010 17:10:32UTC")
      # current_time = Time.parse("20 Jan 2010 17:10:32")
      # Clock.stub(:now).and_return(current_time)
      # current_time.stub(:getutc).and_return current_time_in_utc
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      # incident = Child.create('last_known_location' => "London", 'photo' => uploadable_photo_jeff, :created_by => "uname")
#
      # put :update, :id => incident.id, :incident => {:flag => true, :flag_message => "Test"}
#
      # history = Child.get(incident.id)["histories"].first
      # history['changes'].should have_key('flag')
      # history['datetime'].should == "2010-01-20 17:10:32UTC"
    # end

    # it "should update the last_updated_by_full_name field with the logged in user full name" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, false, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident
      # end
#
    # it "should delete the audio if checked delete_incident_audio checkbox" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
      # incident = Child.new_with_user_name(user, {:name => 'some name'})
      # params_incident = {"name" => 'update'}
      # controller.stub(:current_user_name).and_return("user_name")
      # incident.should_receive(:update_properties_with_user_name).with("user_name", "", nil, nil, true, params_incident)
      # Child.stub(:get).and_return(incident)
      # put :update, :id => '1', :incident => params_incident, :delete_incident_audio => "1"
    # end
#
    # it "should redirect to redirect_url if it is present in params" do
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      # User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org'))
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
      get(:search, params: {:format => 'html'})
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
    #   search = double("search", :query => 'the incident name', :valid? => true, :page => 1)
    #   Search.stub(:new).and_return(search)

    #   fake_results = ["fake_incident","fake_incident"]
    #   fake_full_results =  [:fake_incident,:fake_incident, :fake_incident, :fake_incident]
    #   Incident.should_receive(:search).with(search, 1).and_return([fake_results, fake_full_results])
    #   get(:search, :format => 'html', :query => 'the incident name')
    #   assigns[:results].should == fake_results
    # end

    # TODO: full text searching not implemented yet.
    # describe "with no results" do
    #   before do
    #     get(:search, :query => 'blah')
    #   end

    #   it 'asks view to not show csv export link if there are no results' do
    #     assigns[:results].size.should == 0
    #   end

    #   it 'asks view to display a "No results found" message if there are no results' do
    #     assigns[:results].size.should == 0
    #   end

    # end
  end

  # TODO: full text searching not implemented yet.
  # describe "searching as mrm worker" do
  #   before :each do
  #     @session = fake_mrm_worker_login
  #   end
  #   it "should only list the incidents which the user has registered" do
  #     search = double("search", :query => 'some_name', :valid? => true, :page => 1)
  #     Search.stub(:new).and_return(search)

  #     fake_results = [:fake_incident,:fake_incident]
  #     fake_full_results =  [:fake_incident,:fake_incident, :fake_incident, :fake_incident]
  #     Incident.should_receive(:search_by_created_user).with(search, @session.user_name, 1).and_return([fake_results, fake_full_results])

  #     get(:search, :query => 'some_name')
  #     assigns[:results].should == fake_results
  #   end
  # end
  describe '#respond_to_export' do
    before :each do
      @incident1 = build :incident
      @incident2 = build :incident
      controller.stub :paginated_collection => [ @incident1, @incident2 ], :render => true
      Incident.stub :list_records => double(:results => [@incident1, @incident2 ], :total => 2)
    end

    context 'show' do
      it 'exports 1 record' do
        get :show, params: {id: @incident1.id}, format: :csv
        expect(response.header['Content-Type']).to include 'application/zip'
        expect(response.header['Content-Disposition']).to include "#{@incident1.unique_identifier}.csv.zip"
      end
    end

    context 'index' do
      it "should handle CSV" do
        Exporters::CSVExporter.should_receive(:export).with([ @incident1, @incident2 ], anything, anything, anything).and_return('data')
        get :index, format: :csv
      end

      it "should encrypt result" do
        password = 's3cr3t'
        Exporters::CSVExporter.should_receive(:export).with([ @incident1, @incident2 ], anything, anything, anything).and_return('data')
        # controller.should_receive(:export_filename).with([ @incident1, @incident2 ], Exporters::CSVExporter).and_return("test_filename")
        # controller.should_receive(:encrypt_data_to_zip).with('data', 'test_filename', password).and_return(true)
        get :index, params: {password: password, custom_export_file_name: 'test_filename'}, format: :csv
        #TODO - what else to test?
        expect(response.header['Content-Type']).to include 'application/zip'
        expect(response.header['Content-Disposition']).to include "test_filename.csv.zip"
      end
    end
  end

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
    before :each do
      Incident.stub(:permitted_property_names).and_return(['description', 'unique_identifier'])
    end

    it "should update the incident record instead of creating if record already exists" do
      User.stub(:find_by_user_name).with("uname").and_return(user = double('user', :user_name => 'uname', :organization => 'org', :full_name => 'UserN'))
      incident = Incident.new_with_user_name(user, {:description => 'old incident'})
      incident.save
      fake_admin_login
      controller.stub(:authorize!)
      post :create, params: {:incident => {:unique_identifier => incident.unique_identifier, :description => 'new incident'}}
      updated_incident = Incident.by_short_id(:key => incident.short_id)
      updated_incident.all.size.should == 1
      updated_incident.first.description.should == 'new incident'
    end
  end

  describe "API" do
    before do
      @incident_hash = {owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                      previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker",
                      previously_owned_by_agency: "agency-unicef", module_id: "primeromodule-gbv",
                      created_organization: "agency-unicef", created_by: "primero_gbv", created_by_full_name: "GBV Worker",
                      record_state: true, marked_for_mobile: false, consent_for_services: false, incident_status: Record::STATUS_OPEN,
                      name: "Norville Rogers", name_first: "Norville", name_last: "Rogers", name_nickname: "Shaggy",
                      name_given_post_separation: "No", registration_date: "01-Mar-2017", sex: "Male", age: 10,
                      system_generated_followup: false, incident_id: "56798b3e-c5b8-44d9-a8c1-2593b2b127c9",
                      incident_case_id: "79e1883aecab33011157abe3ae5cc3c3", hidden_name: false, posted_from: "Mobile"}
    end
    it "creates a GBV incident" do

      post :create, params: {incident: @incident_hash, format: :json}

      incident1 = Incident.by_incident_id(key: @incident_hash[:incident_id]).first

      expect(incident1).not_to be_nil
      expect(incident1.name).to eq('Norville Rogers')
    end

    #NOTE: This test depends on the previous test
    #      It cannot be run alone
    it "updates a GBV incident" do
      Incident.stub(:permitted_property_names).and_return(['name'])
      before_incident = Incident.by_incident_id(key: @incident_hash[:incident_id]).first
      @incident_hash[:name] = "Fred Jones"

      put :update, params: {id: before_incident.id, incident: @incident_hash, format: :json}

      after_incident = Incident.by_incident_id(key: @incident_hash[:incident_id]).first

      expect(after_incident).not_to be_nil
      expect(after_incident.name).to eq('Fred Jones')
    end

    describe 'GET' do
      before do
        @gbv_incident_1 = Incident.create!(owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                                           previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker",
                                           previously_owned_by_agency: "agency-unicef", module_id: "primeromodule-gbv",
                                           created_organization: "agency-unicef", created_by: "fakeadmin", created_by_full_name: "GBV Worker",
                                           record_state: true, marked_for_mobile: false, consent_for_services: false, incident_status: Record::STATUS_OPEN,
                                           name: "Fred Jones", name_first: "Fred", name_last: "Jones")
        @gbv_incident_2 = Incident.create!(owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                                           previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker",
                                           previously_owned_by_agency: "agency-unicef", module_id: "primeromodule-gbv",
                                           created_organization: "agency-unicef", created_by: "fakeadmin", created_by_full_name: "GBV Worker",
                                           record_state: true, marked_for_mobile: true, consent_for_services: false, incident_status: Record::STATUS_OPEN,
                                           name: "Daphne Blake", name_first: "Daphne", name_last: "Blake")
        @gbv_incident_3 = Incident.create!(owned_by: "primero_gbv", owned_by_full_name: "GBV Worker", owned_by_agency: "agency-unicef",
                                           previously_owned_by: "primero", previously_owned_by_full_name: "GBV Worker",
                                           previously_owned_by_agency: "agency-unicef", module_id: "primeromodule-gbv",
                                           created_organization: "agency-unicef", created_by: "fakeadmin", created_by_full_name: "GBV Worker",
                                           record_state: true, marked_for_mobile: true, consent_for_services: false, incident_status: Record::STATUS_OPEN,
                                           name: "Velma Dinkley", name_first: "Velma", name_last: "Dinkley")
        @gbv_user = User.new(:user_name => 'primero_gbv', :is_manager => false)
      end


      context 'show' do
        it 'returns a GBV incident' do
          get :show, params: {id: @gbv_incident_1.id, mobile: true, format: :json}

          expect(assigns['record']['_id']).to eq(@gbv_incident_1.id)
          expect(assigns['record']['short_id']).to eq(@gbv_incident_1.short_id)
          expect(assigns['record']['name']).to eq(@gbv_incident_1.name)
        end
      end

      context 'index' do
        before do
          @incidents = [@gbv_incident_1, @gbv_incident_2, @gbv_incident_3]
          search = double(Sunspot::Search::StandardSearch)
          search.should_receive(:results).and_return(@incidents)
          search.should_receive(:total).and_return(3)
          Incident.should_receive(:list_records).and_return(search)
        end
        it 'returns a list of GBV incidents' do
          get :index, params: {mobile: true, module_id: PrimeroModule::GBV, format: :json}

          expect(assigns['records'].count).to eq(2)
          expect(assigns['records'].map{|r| r['name']}).to include("Daphne Blake", "Velma Dinkley")
        end
      end
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

			expect(expected_subform.present?).to be_truthy
			expect(expected_subform).to eq({"nested_1"=>"Drop", "nested_2"=>"Drop", "nested_3"=>"Drop"})
		end

	end

end
