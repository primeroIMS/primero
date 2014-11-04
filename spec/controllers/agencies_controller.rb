require 'spec_helper'

describe AgenciesController do
  before do
    Agency.all.each &:destroy

    @agency_a = Agency.create!(name: "A", 'upload_logo' => {'logo' => uploadable_photo})
    @agency_b = Agency.create!(name: "B")
    @agency_c = Agency.create!(name: "C", 'upload_logo' => {'logo' => uploadable_photo_gif})

    @user = User.new(:user_name => 'fakeadmin')
    @session = fake_admin_login @user
  end

  describe "get index" do
    it "populate the view with all the agencies" do
      agencies = [@agency_a, @agency_b, @agency_c]
      get :index
      expect(assigns(:agencies).all).to eq(agencies)
    end

    it "renders the index template" do
      get :index
      expect(response).to render_template("index")
    end
  end

  describe "post create" do
    it "should new agency" do
      existing_count = Agency.count
      agency = {:name=>"name"}
      post :create, agency: agency
      expect(Agency.count).to eq(existing_count + 1)
    end

    it "sets flash notice if agency is valid and redirect_to agencies page with a flash message" do
      agency = {:name=>"name"}
      post :create, agency: agency
      expect(request.flash[:notice]).to eq("Agency successfully created.")
      expect(response).to redirect_to(agencies_path)
    end
  end

  describe "post update" do
    it "should save update if valid" do
      @agency_a.name = "unicef"
      post :update, id: 'agency-a', agency: { name: @agency_a.name }
      expect(response).to redirect_to(agencies_path)
    end

    it "should show errors if invalid" do
      @agency_a.name = ""
      post :update, id: "agency-a", agency: { name: @agency_a.name }
      expect(response).to_not redirect_to(agencies_path)
      expect(response).to render_template("edit")
    end
  end

  describe "post destroy" do
    it "should delete a agency" do
      existing_count = Agency.count
      post :destroy, id: @agency_b.id
      expect(response).to redirect_to(agencies_path)
      expect(Agency.count).to eq(existing_count - 1)
    end
  end
end