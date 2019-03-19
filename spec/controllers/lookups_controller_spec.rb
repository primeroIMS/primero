require 'rails_helper'

describe LookupsController do
  before :each do
    Field.all.each &:destroy
    FormSection.all.each &:destroy
    Lookup.all.each &:destroy

    @lookup_a = Lookup.create!(unique_id: "lookup-a", name_en: "A", lookup_values: [{id: "a", display_text: "A"}, {id: "aa", display_text: "AA"}])
    @lookup_b = Lookup.create!(unique_id: "lookup-b", name_en: "B", lookup_values: [{id: "b", display_text: "B"}, {id: "bb", display_text: "BB"}, {id: "bbb", display_text: "BBB"}])
    @lookup_c = Lookup.create!(unique_id: "lookup-c", name_en: "C", lookup_values: [{id: "c", display_text: "C"}, {id: "cc", display_text: "CC"}, {id: "ccc", display_text: "CCC"}, {id: "cccc", display_text: "CCCC"}])
    @permission_metadata = Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
    user = User.new(:user_name => 'manager_of_lookups')
    user.stub(:roles).and_return([Role.new(:permissions_list => [@permission_metadata])])
    fake_login user
  end

  describe "get index" do
    it "populate the view with all the lookups" do
      lookups = [@lookup_a, @lookup_b, @lookup_c]
      get :index
      expect(assigns(:lookups).to_a).to eq(lookups)
    end

    it "renders the index template" do
      get :index
      expect(response).to render_template("index")
    end
  end

  describe "post create" do
    it "should new form_section with order" do
      existing_count = Lookup.count
      lookup = {:name_en=>"name", lookup_values: [{:id => "z", :display_text => "Z"}, {:id => "zz", :display_text => "ZZ"}, {:id => "z", :display_text => "ZZ"}]}
      post :create, params: {lookup: lookup}
      expect(Lookup.count).to eq(existing_count + 1)
    end

    it "sets flash notice if lookup is valid and redirect_to lookups page with a flash message" do
      lookup = {:name_en=>"name", lookup_values: [{:id => "z", :display_text => "Z"}, {:id => "zz", :display_text => "ZZ"}, {:id => "z", :display_text => "ZZ"}]}
      post :create, params: {lookup: lookup}
      expect(request.flash[:notice]).to eq("Lookup successfully added")
      expect(response).to redirect_to(lookups_path)
    end
  end

  describe "post update" do
    it "should be valid and save when changing the name" do
      @lookup_a.name_en = "lookup_1"
      Lookup.should_receive(:find).with(@lookup_a.id.to_s).and_return(@lookup_a)
      post :update, params: { id: @lookup_a.id }
      expect(response).to redirect_to(lookups_path)
    end

    it "should be valid and save when adding an option" do
      @lookup_a.lookup_values.push({id: "aaa", display_text: "AAA"})
      Lookup.should_receive(:find).with(@lookup_a.id.to_s).and_return(@lookup_a)
      post :update, params: {id: @lookup_a.id}
      expect(response).to redirect_to(lookups_path)
    end

    it "should show errors and be invalid when name is blank" do
      @lookup_a.name_en = ""
      Lookup.should_receive(:find).with("lookup-a").and_return(@lookup_a)
      post :update, params: {id: "lookup-a"}
      expect(response).to_not redirect_to(lookups_path)
      expect(response).to render_template("edit")
    end
  end

  describe "post destroy" do
    context "when on a form" do
      before do
        @lookup_d = Lookup.create!(unique_id: "lookup-d", name_en: "D", lookup_values: [{id: "d", display_text: "D"}, {id: "dd", display_text: "DD"}, {id: "ddd", display_text: "DDD"}, {id: "dddd", display_text: "DDDD"}])
        text_field = Field.new(name: "text_field", type: Field::TEXT_FIELD, display_name: "My Text Field")
        select_box_field = Field.new(name: "select_box", type: Field::SELECT_BOX, display_name: "My Select Box", option_strings_source: "lookup lookup-d" )
        fs = create :form_section, fields: [select_box_field]
      end

      it "should not delete a lookup" do
        existing_count = Lookup.count
        post :destroy, params: {id: @lookup_d.id}
        expect(response).to redirect_to(lookups_path)
        expect(Lookup.count).to eq(existing_count)
      end
    end

    context "when not on a form" do
      it "should delete a lookup" do
        existing_count = Lookup.count
        post :destroy, params: {id: @lookup_c.id}
        expect(response).to redirect_to(lookups_path)
        expect(Lookup.count).to eq(existing_count - 1)
      end
    end
  end
end
