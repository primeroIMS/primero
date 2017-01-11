require 'spec_helper'

# TODO: Clean this up and add view test in views/form_section

describe OptionStringSourcesController do
  before do
    Location.all.each &:destroy
    @country = create :location, placename: "Country1", admin_level: 0
    @province1 = create :location, placename: "Province1", hierarchy: [@country.placename]
    @province2 = create :location, placename: "Province2", hierarchy: [@country.placename]
    @town1 = create :location, placename: "Town1", hierarchy: [@country.placename, @province1.placename]
    @disabled1 = create :location, hierarchy: [@country.placename, @province2.placename], disabled: true
  end

  it 'routes /string_sources to the option_string_sources get_string_sources action.' do
    { :get => "/string_sources" }.should route_to(:controller => "option_string_sources", 
                                                  :action => "get_string_sources", 
                                                  :format => :json)
  end

  it "should return 401 if not authorized." do
    get :get_string_sources, format: :json
    response.code.should eq('401')
  end

  describe "get get_string_sources" do
    before do
      fake_admin_login

      @expected_response = {
        "success" => 1,
        "sources" => [
          {
            "type"=>"Location",
            "options" => [
              "Country1",
              "Country1::Province1",
              "Country1::Province2",
              "Country1::Province1::Town1"
            ]
          }
        ]
      }  
    end
    
    it "should render requested sources as json." do
      get :get_string_sources, format: :json
      expect(response.content_type.to_s).to eq('application/json')
    end

    it "should return requested sources." do
      get :get_string_sources, string_sources: ['Location'], format: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(@expected_response)
    end

    it "should return a message if no sources found." do
      get :get_string_sources, format: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({ "message" => "Could not find/fetch select box options", "success" => 0 })
    end

    it "should not return nil sources." do
      get :get_string_sources, string_sources: ['Test Source', 'Location'], format: :json
      json_response = JSON.parse(response.body)["sources"].first
      expect(json_response["options"]).not_to include(nil)
    end
  end
end
