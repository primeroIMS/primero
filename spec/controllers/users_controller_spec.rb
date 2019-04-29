require 'rails_helper'

describe UsersController,:type => :controller do
  before do
    Role.all.each &:destroy
    PrimeroModule.all.each &:destroy

    @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @role_case_read = create :role, permissions_list: [@permission_case_read]
    @permission_tracing_request_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @role_tracing_request_read = create :role, permissions_list: [@permission_tracing_request_read]
    @permission_incident_read = Permission.new(resource: Permission::INCIDENT, actions: [Permission::READ])
    @role_incident_read = create :role, permissions_list: [@permission_incident_read]
    @a_module = PrimeroModule.create name: "Test Module"

    @permission_user_read_write = Permission.new(resource: Permission::USER, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])

    SystemSettings.create(default_locale: "en", primary_age_range: "primary", age_ranges: {"primary" => [1..2, 3..4]})
  end

  def mock_user(stubs={})
    @mock_user ||= stub_model(User, stubs)
  end

  describe "GET index", search: true do
    before do

       Sunspot.setup(User) do
         string :user_name
         string :organization
         string :location
         boolean :disabled
       end

      User.all.each &:destroy

      Sunspot.remove_all!

      @user_a = User.create!(user_name: "AAA123", full_name: "ZZZ", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'cc')
      @user_b = User.create!(user_name: "BBB123", full_name: "YYY", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'aa', disabled: false)
      @user_c = User.create!(user_name: "CCC123", full_name: "XXX", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'ee')
      @user_d = User.create!(user_name: "DDD123", full_name: "WWW", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'dd', disabled: true)
      @user_e = User.create!(user_name: "EEE123", full_name: "VVV", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'bb', disabled: true)
      @user_f = User.create!(user_name: "FFF123", full_name: "VVV", password: 'passw0rd', password_confirmation: 'passw0rd',
                             role_ids: [@role_case_read.id], module_ids: [@a_module.unique_id], organization: 'bb', disabled: false)

      Sunspot.commit

      fake_admin_login
      fake_session = Session.new()
      fake_session.stub(:admin?).with(no_args()).and_return(true)
      Session.stub(:get).and_return(fake_session)
      @user = mock_user({:merge => {}, :user_name => "someone"})

    end

    context "with status filter disabled" do
      before :each do
        @params = { scope: { status: 'list||disabled' } }
      end

      context "and agency filter selected" do
        before :each do
          @params[:scope].merge!({agency: 'list||dd'})
        end

        it "populates the view with the disabled users of the agency" do
          get :index, params: @params
          expect(assigns(:users)).to eq([@user_d])
        end

        it "does not have disabled users of other agencies" do
          get :index, params: @params
          expect(assigns(:users)).not_to include([@user_e])
        end
      end

      it "populates the view with all the disabled users" do
        get :index, params: @params
        expect(assigns(:users)).to eq([@user_d, @user_e])
      end

      it "renders the index template" do
        get :index, params: @params
        expect(response).to render_template("index")
      end
    end

    context "with status filter enabled" do
      before :each do
        @params = { scope: { status: 'list||enabled' } }
      end

      context "and agency filter selected" do
        before :each do
          @params[:scope].merge!({agency: 'list||aa'})
        end

        it "populates the view with the enabled users of the agency" do
          get :index, params: @params
          expect(assigns(:users)).to eq([@user_b])
        end

        it "does not have enabled users of other agencies" do
          get :index, params: @params
          expect(assigns(:users)).not_to include([@user_c, @user_b])
        end
      end

      it "populates the view with all the enabled users" do
        get :index, params: @params
        expect(assigns(:users)).to eq([@user_a, @user_b, @user_c, @user_f])
      end

      it "renders the index template" do
        get :index, params: @params
        expect(response).to render_template("index")
      end
    end

    context "with status filter enabled and disabled" do
      before :each do
        @params = { scope: { status: 'list||disabled||enabled' } }
      end

      context "and agency filter selected" do
        before :each do
          @params[:scope].merge!({agency: 'list||bb'})
        end

        it "populates the view with all users of the agency" do
          get :index, params: @params
          expect(assigns(:users)).to eq([@user_e, @user_f])
        end

        it "does not have users of other agencies" do
          get :index, params: @params
          expect(assigns(:users)).not_to include([@user_a, @user_b, @user_c, @user_d])
        end
      end

      it "populates the view with all the users" do
        get :index, params: @params
        expect(assigns(:users)).to eq([@user_a, @user_b, @user_c, @user_d, @user_e, @user_f])
      end

      it "renders the index template" do
        get :index, params: @params
        expect(response).to render_template("index")
      end
    end

    context "with no filter" do
      before :each do
        @params = {}
      end
      it "populates the view with enabled users" do
        get :index, params: @params
        expect(assigns(:users)).to eq([@user_a, @user_b, @user_c, @user_f])
      end

      it "renders the index template" do
        get :index, params: @params
        expect(response).to render_template("index")
      end
    end

    context 'when exporting' do
      it 'exports users' do
        params = {"action"=>"index", "controller"=>"users", "page"=>"all", "per_page"=>"all", "password"=>"111", "selected_records"=>"", "format"=>"json"}
        get :index, params: params
        expect(response.status).to eq(200)
      end
    end

    it "shows the page name" do
      get :index
      assigns[:page_name].should == "Manage Users"
    end

    it "assigns users_details for backbone" do
      User.stub(:view).and_return([@user])
      get :index
      users_details = assigns[:users_details]
      users_details.should_not be_nil
      user_detail = users_details[0]
      user_detail[:user_name].should == "aaa123"
      user_detail[:user_url].should_not be_blank
    end

    #TODO: This will fail
    it "should return error if user is not authorized" do
      pending "Determine whether this is still a valid case. maybe tweak users controller when doing customizations"
      fake_login
      mock_user = stub_model User
      get :index
      response.should be_forbidden
    end

    it "should authorize index page for read only users" do
      user = User.new(:user_name => 'view_user')
      user_permission = Permission.new(resource: Permission::USER, actions: [Permission::READ])
      user.stub(:roles).and_return([Role.new(group_permission: Permission::ALL, permissions_list: [user_permission])])
      fake_login user
      get :index
      assigns(:access_error).should be_nil
    end
  end

  describe "GET show" do
    before do
      fake_admin_login
      fake_session = Session.new()
      fake_session.stub(:admin?).with(no_args()).and_return(true)
      Session.stub(:get).and_return(fake_session)
      @user = mock_user({:merge => {}, :user_name => "someone"})
    end
    it "assigns the requested user as @user" do
      mock_user = double(:user_name => "fakeadmin")
      User.stub(:find).with("37").and_return(mock_user)
      get :show, params: {:id => "37"}
      assigns[:user].should equal(mock_user)
    end

    it "should flash an error and go to listing page if the resource is not found" do
      User.stub(:find).with("invalid record").and_return(nil)
      get :show, params: {:id => "invalid record"}
      flash[:error].should == "User with the given id is not found"
      response.should redirect_to(:action => :index)
    end

    it "should show self user for non-admin" do
      session = fake_login
      get :show, params: {:id => session.user.id}
      response.should_not be_forbidden
    end

    it "should not show non-self user for non-admin" do
      fake_login
      mock_user = double({:user_name => 'some_random'})
      User.stub(:find).with("37").and_return(mock_user)
      get :show, params: {:id => "37"}
      response.status.should == 403
    end
  end

  describe "GET new" do
    it "assigns a new user as @user" do
      fake_admin_login
      user = stub_model User
      User.stub(:new).and_return(user)
      get :new
      assigns[:user].should equal(user)
    end

    xit "should throw error if an user without authorization tries to access" do
      fake_login_as(Permission::USER, [Permission::READ])
      get :new
      response.status.should == 403
    end

    context "when user has MANAGE permission on ROLE" do
      before do
        fake_admin_login
      end

      it "should assign all the available roles as @roles" do
        get :new
        expect(assigns[:roles]).to include(@role_case_read, @role_tracing_request_read, @role_incident_read)
      end
    end

    context "when user has permission to assign 2 roles" do
      before do
        @permission_role_assign_2 = Permission.new(resource: Permission::ROLE, actions: [Permission::ASSIGN],
                                                   role_ids: [@role_case_read.id, @role_incident_read.id])
        fake_login_with_permissions([@permission_user_read_write, @permission_role_assign_2])
      end

      it "should assign all the assigned roles as @roles" do
        get :new
        expect(assigns[:roles]).to include(@role_case_read, @role_incident_read)
      end

      it "should not assign the unassigned roles as @roles" do
        get :new
        expect(assigns[:roles]).not_to include(@role_tracing_request_read)
      end
    end

    context "when user has permission to assign all roles" do
      before do
        @permission_role_assign_all = Permission.new(resource: Permission::ROLE, actions: [Permission::ASSIGN])
        fake_login_with_permissions([@permission_user_read_write, @permission_role_assign_all])
      end

      it "should assign all the roles as @roles" do
        get :new
        expect(assigns[:roles]).to include(@role_case_read, @role_tracing_request_read, @role_incident_read)
      end
    end

    context "when user has permission to assign none of the roles" do
      before do
        @permission_role_read_write = Permission.new(resource: Permission::ROLE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
        fake_login_with_permissions([@permission_user_read_write, @permission_role_read_write])
      end

      it "should not assign any of the roles as @roles" do
        get :new
        expect(assigns[:roles]).not_to include(@role_case_read)
        expect(assigns[:roles]).not_to include(@role_tracing_request_read)
        expect(assigns[:roles]).not_to include(@role_incident_read)
      end
    end
  end

  describe "GET edit" do
    it "assigns the requested user as @user" do
      fake_admin_login
      mock_user = stub_model(User, :user_name => "Test Name", :full_name => "Test")
      User.stub(:find).with("37").and_return(mock_user)
      get :edit, params: {:id => "37"}
      expect(assigns[:user]).to eq(mock_user)
      expect(assigns[:roles]).to include(@role_case_read, @role_tracing_request_read, @role_incident_read)
    end

    it "should not allow editing a non-self user for users without access" do
      fake_login_as(Permission::USER, [Permission::READ])
      User.stub(:find).with("37").and_return(mock_user(:full_name => "Test Name"))
      get :edit, params: {:id => "37"}
      response.should be_forbidden
    end

    it "should allow editing a non-self user for user having edit permission" do
      fake_login_as(Permission::USER, [Permission::READ, Permission::WRITE, Permission::CREATE], Permission::ALL, ['test_group'])
      mock_user = stub_model(User, :full_name => "Test Name", :user_name => 'fakeuser', user_group_ids: ['test_group'])
      User.stub(:find).with("24").and_return(mock_user)
      get :edit, params: {:id => "24"}
      response.status.should_not == 403
    end
  end


  describe "DELETE destroy" do
    it "destroys the requested user" do
      fake_admin_login
      User.should_receive(:find).with("37").and_return(mock_user)
      mock_user.should_receive(:destroy)
      delete :destroy, params: {:id => "37"}
    end

    it "redirects to the users list" do
      fake_admin_login
      User.stub(:find).and_return(mock_user(:destroy => true))
      delete :destroy, params: {:id => "1"}
      response.should redirect_to(users_url)
    end

    it "should not allow a destroy" do
      fake_login_as(Permission::USER, [Permission::READ], Permission::ALL)
      User.stub(:find).and_return(mock_user(:destroy => true))
      delete :destroy, params: {:id => "37"}
      response.status.should == 403
    end

    it "should allow user deletion for relevant user role" do
      fake_login_as(Permission::USER, [Permission::READ, Permission::WRITE, Permission::CREATE], Permission::ALL, ['test_group'])
      mock_user = stub_model User, user_group_ids: ['test_group']
      User.should_receive(:find).with("37").and_return(mock_user)
      mock_user.should_receive(:destroy).and_return(true)
      delete :destroy, params: {:id => "37"}
      response.status.should_not == 403
    end
  end

  describe "POST update" do
    context "when not admin user" do
      it "should not allow to edit admin specific fields" do
        fake_login
        mock_user = double({:user_name => "User_name"})
        User.stub(:find).with("24").and_return(mock_user)
        controller.stub(:current_user_name).and_return("test_user")
        mock_user.stub(:has_role_ids?).and_return(false)
        post :update, params: {:id => "24", :user => {:user_type => "Administrator"}}
        response.status.should == 403
      end
    end

    context "disabled flag" do
      it "should not allow to edit disable fields for non-disable users" do
        fake_login_as(Permission::USER, [Permission::READ], Permission::ALL)
        user = stub_model User, :user_name => 'some name'
        params = { :id => '24', :user => { :disabled => true } }
        User.stub :find => user
        post :update, params: params
        response.should be_forbidden
      end

      it "should allow to edit disable fields for disable users" do
        fake_login_as(Permission::USER, [Permission::READ, Permission::WRITE, Permission::CREATE], Permission::ALL, ['test_group'])
        user = stub_model User, :user_name => 'some name', user_group_ids: ['test_group']
        params = { :id => '24', :user => { :disabled => true } }
        User.stub :find => user
        User.stub(:find_by_user_name).with(user.user_name).and_return(user)
        post :update, params: params
        response.should_not be_forbidden
      end

    end
    context "create a user" do
      it "should create admin user if the admin user type is specified" do
        fake_login_as(Permission::USER, [Permission::READ, Permission::WRITE, Permission::CREATE], Permission::ALL)
        mock_user = User.new
        User.should_receive(:new).with({"role_ids" => %w(abcd), "locale" => nil, "services" => nil}).and_return(mock_user)
        mock_user.should_receive(:save).and_return(true)
        post :create, params: {"user" => {"role_ids" => %w(abcd)}}
      end

      it "should render new if the given user is invalid and assign user,roles" do
        fake_admin_login
        mock_user = User.new
        User.should_receive(:new).and_return(mock_user)
        mock_user.should_receive(:save).and_return(false)
        post :create, params: {:user => {:role_ids => ["wxyz"]}}
        response.should render_template :new
        expect(assigns[:user]).to eq(mock_user)
        expect(assigns[:roles]).to include(@role_case_read, @role_tracing_request_read, @role_incident_read)
      end

      it "should not receive services if services param is not specified" do
        fake_admin_login
        mock_user = User.new
        User.should_receive(:new).with({:role_ids => ["wxyz"], :locale => nil, :services => nil}).and_return(mock_user)
        mock_user.should_receive(:save).and_return(true)
        post :create, params: {:user => {:role_ids => ["wxyz"]}}
      end

      it "should not receive services if services is empty" do
        fake_admin_login
        mock_user = User.new
        User.should_receive(:new).with({:role_ids => ["wxyz"], :locale => nil, :services => nil}).and_return(mock_user)
        mock_user.should_receive(:save).and_return(true)
        post :create, params: {:user => {:role_ids => ["wxyz"], :services => []}}
      end

      it "should receive services if services are specified" do
        fake_admin_login
        mock_user = User.new
        User.should_receive(:new).with({:role_ids => ["wxyz"], :locale => nil, :services => ['health_medical_service','shelter_service']}).and_return(mock_user)
        mock_user.should_receive(:save).and_return(true)
        post :create, params: {:user => {:role_ids => ["wxyz"], :services => ['health_medical_service','shelter_service']}}
      end
    end
  end

  describe "GET change_password" do
    before :each do
      @user = User.new(:user_name => 'fakeuser')
      @mock_change_form = double()
      fake_login @user
      @mock_params = { "mock" => "mock" }
      Forms::ChangePasswordForm.stub(:new).with(@mock_params).and_return(@mock_change_form)
    end

    it "should show update password form" do
      Forms::ChangePasswordForm.stub(:new).with(:user => @user).and_return(@mock_change_form)
      get :change_password
      assigns[:change_password_request].should == @mock_change_form
      response.should render_template :change_password
    end

    it "should make password request from parameters" do
      @mock_change_form.should_receive(:user=).with(@user).and_return(nil)
      @mock_change_form.should_receive(:execute).and_return(true)

      post :update_password, params: { :forms_change_password_form => @mock_params }
      flash[:notice].should == "Password changed successfully"
      response.should redirect_to :action => :show, :id => @user.id
    end

    it "should show error when any of the fields is wrong" do
      @mock_change_form.should_receive(:user=).with(@user).and_return(nil)
      @mock_change_form.should_receive(:execute).and_return(false)

      post :update_password, params: { :forms_change_password_form => @mock_params }
      response.should render_template :change_password
    end
  end

  after do
    Role.all.each &:destroy
  end
end
