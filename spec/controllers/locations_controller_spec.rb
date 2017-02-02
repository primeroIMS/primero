require 'spec_helper'

describe LocationsController do
  before do
    Location.all.each &:destroy

    @country = create :location, placename: "Country1", admin_level: 0
    @country2 = create :location, placename: "Country2", admin_level: 0
    @province1 = create :location, placename: "Province1", hierarchy: [@country.location_code]
    @province2 = create :location, placename: "Province2", hierarchy: [@country.location_code]
    @province3 = create :location, placename: "Province3", hierarchy: [@country.location_code]
    @town1 = create :location, placename: "Town1", hierarchy: [@country.location_code, @province1.location_code]
    @town2 = create :location, placename: "Town2", hierarchy: [@country.location_code, @province1.location_code], disabled: false
    @town3 = create :location, placename: "Town3", hierarchy: [@country.location_code, @province2.location_code]
    @disabled1 = create :location, hierarchy: [@country.location_code, @province2.location_code], disabled: true
    @disabled2 = create :location, hierarchy: [@country.location_code, @province2.location_code], disabled: true
    @permission_metadata = Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])

    user = User.new(:user_name => 'manager_of_locations')
    user.stub(:roles).and_return([Role.new(:permissions_list => [@permission_metadata])])
    fake_login user

  end

  describe "get index" do
    context "with filter disabled" do
      before :each do
        @params = {"filter" => 'disabled'}
      end

      it "populates the view with all the disabled locations" do
        get :index, @params
        expect(assigns(:locations)).to include(@disabled1, @disabled2)
      end

      it "does not populate the vew with enabled locations" do
        get :index, @params
        expect(assigns(:locations)).not_to include(@country, @country2, @province1, @province2, @province3, @town1, @town2, @town3)
      end

      it "renders the index template" do
        get :index, @params
        expect(response).to render_template("index")
      end
    end

    context "with filter enabled" do
      before :each do
        @params = {"filter" => 'enabled'}
      end

      it "populates the view with all the enabled locations" do
        get :index, @params
        expect(assigns(:locations)).to include(@country, @country2, @province1, @province2, @province3, @town1, @town2, @town3)
      end

      it "does not populate the vew with disabled locations" do
        get :index, @params
        expect(assigns(:locations)).not_to include(@disabled1, @disabled2)
      end

      it "renders the index template" do
        get :index, @params
        expect(response).to render_template("index")
      end
    end

    context "with filter all" do
      before :each do
        @params = {"filter" => 'all'}
      end

      it "populates the view with all the locations" do
        get :index, @params
        expect(assigns(:locations)).to include(@country, @country2, @province1, @province2, @province3, @town1, @town2, @town3, @disabled1, @disabled2)
      end

      it "renders the index template" do
        get :index, @params
        expect(response).to render_template("index")
      end
    end

    context "with no filter" do
      it "populates the view with all the enabled locations" do
        get :index
        expect(assigns(:locations)).to include(@country, @country2, @province1, @province2, @province3, @town1, @town2, @town3)
      end

      it "does not populate the vew with disabled locations" do
        get :index
        expect(assigns(:locations)).not_to include(@disabled1, @disabled2)
      end

      it "renders the index template" do
        get :index
        expect(response).to render_template("index")
      end
    end

  end

  describe "post create" do
    it "should create a location" do
      existing_count = Location.count
      location = {placename: "My_Country", location_code: "my_code", type: "country", admin_level: 0}
      post :create, location: location
      expect(Location.count).to eq(existing_count + 1)
    end

    context "when a parent is selected" do
      it "should create the hierarchy" do
        location = {placename: "My_Town", location_code: "my_code", type: "city", parent_id: @province3.id}
        post :create, location: location
        my_town = Location.get_by_location("My_Town")
        my_hierarchy = [@country.location_code, @province3.location_code]
        expect(my_town.hierarchy).to eq(my_hierarchy)
        #TODO i18n - it is unclear at this point how the location.name should look.  Asking Pavel
        expect(my_town.name).to eq("#{@country.placename}::#{@province3.placename}::My_Town")
      end
    end
  end

  describe "put update" do
    it "should save update if valid" do
      @town3.placename = "town_4"
      Location.should_receive(:get).with(@town3.id).and_return(@town3)
      post :update, id: @town3.id
      expect(response).to redirect_to(locations_path)
    end

    context "when the parent is updated" do
      it "should update the hierarchy" do
        put :update, id: @province3.id, location: {placename: @province3.placename, type: "province", parent_id: @country2.id}
        province = Location.get(@province3.id)
        expect(province.hierarchy).to eq([@country2.location_code])
        #TODO i18n - it is unclear at this point how the location.name should look.  Asking Pavel
        expect(province.name).to eq("Country2::Province3")
      end

      it "should update the hierarchy of all descendants" do
        put :update, id: @province1.id, location: {placename: @province1.placename, type: "province", parent_id: @country2.id}
        updated_town1 = Location.get(@town1.id)
        updated_town2 = Location.get(@town2.id)
        new_hierarchy = [@country2.location_code, @province1.location_code]
        expect(updated_town1.hierarchy).to eq(new_hierarchy)
        expect(updated_town2.hierarchy).to eq(new_hierarchy)
        #TODO i18n - it is unclear at this point how the location.name should look.  Asking Pavel
        expect(updated_town1.name).to eq("Country2::Province1::Town1")
        expect(updated_town2.name).to eq("Country2::Province1::Town2")
      end
    end
  end

  describe "post destroy" do
    it "should delete a location" do
      existing_count = Location.count
      post :destroy, id: @town3.id
      expect(response).to redirect_to(locations_path)
      expect(Location.count).to eq(existing_count - 1)
    end
  end
end
