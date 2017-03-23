require 'spec_helper'

# TODO: Clean this up and add view test in views/form_section

describe OptionsController do
  before do
    Location.all.each &:destroy
    @country = create :location, placename: "Country1", admin_level: 0
    @province1 = create :location, placename: "Province1", hierarchy: [@country.placename]
    @province2 = create :location, placename: "Province2", hierarchy: [@country.placename]
    @town1 = create :location, placename: "Town1", hierarchy: [@country.placename, @province1.placename]
    @disabled1 = create :location, hierarchy: [@country.placename, @province2.placename], disabled: true
  end

  it 'routes /api/options to the options index action.' do
    { :get => "/api/options" }.should route_to(:controller => "options",
                                                  :action => "index",
                                                  :format => :json)
  end

  it "should return 401 if not authorized." do
    get :index, format: :json
    response.code.should eq('401')
  end

  describe "get index" do
    before do
      fake_admin_login

      @expected_response = {
        "success" => 1,
        "sources" => [
          {
            "type"=>"Location",
            "options" => [
              {
                "id"=>"code_1000000",
                "display_text"=>"Country1"
              },
              { 
                "id"=>"code_1000001", 
                "display_text"=>"Province1"
              }, 
              {
                "id"=>"code_1000002",
                "display_text"=>"Province2"
              }, 
              {
                "id"=>"code_1000003", 
                "display_text"=>"Town1"
              }
            ]
          }
        ]
      }  
    end
    
    it "should render requested sources as json." do
      get :index, format: :json
      expect(response.content_type.to_s).to eq('application/json')
    end

    it "should return requested sources." do
      get :index, string_sources: ['Location'], format: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(@expected_response)
    end

    it "should return a message if no sources found." do
      get :index, format: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({ "message" => "Some fields failed to load, refresh the page to load all fields.", "success" => 0 })
    end

    it "should not return nil sources." do
      get :index, string_sources: ['Test Source', 'Location'], format: :json
      json_response = JSON.parse(response.body)["sources"].first
      expect(json_response["options"]).not_to include(nil)
    end
  end
end
