require 'rails_helper'

describe AgenciesController do
  before do
    Agency.all.each &:destroy

    @agency_a = Agency.create!(name: "A", agency_code: "AAA", 'upload_logo' => {'logo' => uploadable_photo})
    @agency_b = Agency.create!(name: "B", agency_code: "BBB", disabled: false)
    @agency_c = Agency.create!(name: "C", agency_code: "CCC", 'upload_logo' => {'logo' => uploadable_photo_gif})
    @agency_d = Agency.create!(name: "D", agency_code: "DDD", disabled: true)
    @agency_e = Agency.create!(name: "E", agency_code: "EEE", disabled: true)

    @user = User.new(:user_name => 'fakeadmin')
    @session = fake_admin_login @user
  end

  describe "get index" do
    context "with filter disabled" do
      it "populates the view with all the disabled agencies" do
        get :index, params: {filter: 'disabled'}
        expect(assigns(:agencies)).to include(@agency_d, @agency_e)
      end

      it "does not populate the vew with enabled agencies" do
        get :index, params: {filter: 'disabled'}
        expect(assigns(:agencies)).not_to include(@agency_a, @agency_b, @agency_c)
      end

      it "renders the index template" do
        get :index, params: {filter: 'disabled'}
        expect(response).to render_template("index")
      end
    end

    context "with filter enabled" do
      it "populates the view with all the enabled agencies" do
        get :index, params: {filter: 'enabled'}
        expect(assigns(:agencies)).to include(@agency_a, @agency_b, @agency_c)
      end

      it "does not populate the vew with disabled agencies" do
        get :index, params: {filter: 'enabled'}
        expect(assigns(:agencies)).not_to include(@agency_d, @agency_e)
      end

      it "renders the index template" do
        get :index, params: {filter: 'enabled'}
        expect(response).to render_template("index")
      end
    end

    context "with filter all" do
      it "populates the view with all the agencies" do
        get :index, params: {filter: 'all'}
        expect(assigns(:agencies)).to include(@agency_a, @agency_b, @agency_c, @agency_d, @agency_e)
      end

      it "renders the index template" do
        get :index, params: {filter: 'all'}
        expect(response).to render_template("index")
      end
    end

    context "with no filter" do
      it "populates the view with all the enabled agencies" do
        get :index
        expect(assigns(:agencies)).to include(@agency_a, @agency_b, @agency_c)
      end

      it "does not populate the vew with disabled agencies" do
        get :index
        expect(assigns(:agencies)).not_to include(@agency_d, @agency_e)
      end

      it "renders the index template" do
        get :index
        expect(response).to render_template("index")
      end
    end

  end

  describe "post create" do
    it "should new agency" do
      existing_count = Agency.count
      agency = {name: "name", agency_code: "nnn"}
      post :create, params: {agency: agency}
      expect(Agency.count).to eq(existing_count + 1)
    end

    it "sets flash notice if agency is valid and redirect_to agencies page with a flash message" do
      agency = {name: "name", agency_code: "zzz"}
      post :create, params: {agency: agency}
      expect(request.flash[:notice]).to eq("Agency successfully created.")
      expect(response).to redirect_to(agencies_path)
    end
  end

  describe "post update" do
    it "should save update if valid" do
      @agency_a.name = "unicef"
      Agency.stub(:get).with('agency-a').and_return(@agency_a)
      post :update, params: {id: 'agency-a'}
      expect(response).to redirect_to(agencies_path)
      agency = Agency.all.all.first
      agency[:name].should eq(@agency_a[:name])
    end

    it "should show errors if invalid" do
      @agency_a.name = ""
      Agency.stub(:get).with('agency-a').and_return(@agency_a)
      post :update, params: {id: "agency-a"}
      expect(response).to_not redirect_to(agencies_path)
      expect(response).to render_template("edit")
      expect(@agency_a.errors[:name][0]).to eq('must not be blank')
    end
  end

  describe "post destroy" do
    it "should delete a agency" do
      existing_count = Agency.count
      post :destroy, params: {id: @agency_b.id}
      expect(response).to redirect_to(agencies_path)
      expect(Agency.count).to eq(existing_count - 1)
    end
  end
end