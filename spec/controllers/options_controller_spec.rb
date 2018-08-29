require 'rails_helper'

# TODO: Clean this up and add view test in views/form_section

describe OptionsController do
  before do
    FormSection.all.each &:destroy
    Location.all.each &:destroy
    Lookup.all.each &:destroy
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: Primero::Application::LOCALE_ENGLISH,
                          locales: [Primero::Application::LOCALE_ENGLISH, Primero::Application::LOCALE_FRENCH])

    @country = create :location, placename_en: "Country1", placename_fr: "French Country1", admin_level: 0
    @province1 = create :location, placename_en: "Province1", placename_fr: "French Province1", hierarchy: [@country.placename]
    @province2 = create :location, placename_en: "Province2", placename_fr: "French Province2", hierarchy: [@country.placename]
    @town1 = create :location, placename_en: "Town1", placename_fr: "French Town1", hierarchy: [@country.placename, @province1.placename]
    @disabled1 = create :location, hierarchy: [@country.placename, @province2.placename], disabled: true
    @lookup_a = Lookup.create!(id: "lookup-a", name_en: "A",
                               lookup_values_en: [{id: "a", display_text: "A"}, {id: "aa", display_text: "AA"}],
                               lookup_values_es: [{id: "a", display_text: "Spanish A"}, {id: "aa", display_text: "Spanish AA"}],
                               lookup_values_fr: [{id: "a", display_text: "French A"}, {id: "aa", display_text: "French AA"}],
                               lookup_values_ar: [{id: "a", display_text: "Arabic A"}, {id: "aa", display_text: "Arabic AA"}])
    @lookup_b = Lookup.create!(id: "lookup-b", name_en: "B",
                               lookup_values_en: [{id: "b", display_text: "B"}, {id: "bb", display_text: "BB"}, {id: "bbb", display_text: "BBB"}])
  end

  it 'routes /api/options to the options index action.' do
    { :get => "/api/options" }.should route_to(:controller => "options",
                                                  :action => "index",
                                                  :format => :json)
  end

  it "should return 401 if not authorized." do
    get :index, params: {format: :json}
    response.code.should eq('401')
  end

  describe "get index" do
    before do
      fake_admin_login
    end

    context 'when string_sources is Location' do
      before do
        @expected_response = {
          "success" => 1,
          "sources" => [
            {
              "type"=>"Location",
              "options" => [
                {
                  "id"=>@country.location_code,
                  "display_text"=>"Country1"
                },
                {
                  "id"=>@province1.location_code,
                  "display_text"=>"Province1"
                },
                {
                  "id"=>@province2.location_code,
                  "display_text"=>"Province2"
                },
                {
                  "id"=>@town1.location_code,
                  "display_text"=>"Town1"
                }
              ]
            }
          ],
          "placeholder" => "(Select...)"
        }
      end

      it "should render requested sources as json." do
        get :index, params: {format: :json}
        expect(response.content_type.to_s).to eq('application/json')
      end

      it "returns Locations" do
        get :index, params: {string_sources: ['Location'], format: :json}
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(@expected_response)
      end

      it "should return a message if no sources found." do
        get :index, params: {format: :json}
        json_response = JSON.parse(response.body)
        expect(json_response).to eq({ "message" => "Some fields failed to load, refresh the page to load all fields.", "success" => 0 })
      end

      it "should not return nil sources." do
        get :index, params: { string_sources: ['Test Source', 'Location'], format: :json }
        json_response = JSON.parse(response.body)["sources"].first
        expect(json_response["options"]).not_to include(nil)
      end

      context 'when passed locale is fr' do
        before do
          @expected_response = {
              "success" => 1,
              "sources" => [
                  {
                      "type"=>"Location",
                      "options" => [
                          {
                              "id"=>@country.location_code,
                              "display_text"=>"French Country1"
                          },
                          {
                              "id"=>@province1.location_code,
                              "display_text"=>"French Province1"
                          },
                          {
                              "id"=>@province2.location_code,
                              "display_text"=>"French Province2"
                          },
                          {
                              "id"=>@town1.location_code,
                              "display_text"=>"French Town1"
                          }
                      ]
                  }
              ],
              "placeholder" => "(Sélectionner...)"
          }
        end
        it "returns French locations" do
          get :index, params: {locale: 'fr', mobile: "true", string_sources: ['Location'], format: :json}
          json_response = JSON.parse(response.body)
          expect(json_response).to eq(@expected_response)
        end
      end
    end

    context 'when string_sources is Lookup' do
      before do
        @expected_response = {
            "success" => 1,
            "sources" => [{"type"=>"lookup-a", "options"=>[{"id"=>"a", "display_text"=>"A"}, {"id"=>"aa", "display_text"=>"AA"}]}],
            "placeholder" => "(Select...)"
        }
      end

      it 'returns lookup values' do
        get :index, params: {locale: 'en', mobile: "true", string_sources: ['lookup-a'], format: :json}
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(@expected_response)
      end

      context 'when passed locale is fr' do
        before do
          @expected_response = {
              "success" => 1,
              "sources" => [{"type"=>"lookup-a", "options"=>[{"id"=>"a", "display_text"=>"French A"}, {"id"=>"aa", "display_text"=>"French AA"}]}],
              "placeholder" => "(Sélectionner...)"
          }
        end
        it 'returns lookup values' do
          get :index, params: {locale: 'fr', mobile: "true", string_sources: ['lookup-a'], format: :json}
          json_response = JSON.parse(response.body)
          expect(json_response).to eq(@expected_response)
        end
      end
    end

    context 'when all param is true' do
      before do
        @expected_response = {
          "success" => 1,
          "sources" => [
            {
              "type"=>"lookup-a",
              "options"=> [
                {"id"=>"a", "display_text"=>"A"},
                {"id"=>"aa", "display_text"=>"AA"}
              ]
            },
            {
              "type"=>"lookup-b",
              "options"=> [
                {"id"=>"b", "display_text"=>"B"},
                {"id"=>"bb", "display_text"=>"BB"},
                {"id"=>"bbb", "display_text"=>"BBB"}
              ]
            },
            {
              "type"=>"Location",
              "options"=> [
                {"id"=> @country.location_code, "display_text"=>"Country1"},
                {"id"=> @province1.location_code, "display_text"=>"Province1"},
                {"id"=> @province2.location_code, "display_text"=>"Province2"},
                {"id"=> @town1.location_code, "display_text"=>"Town1"}
              ]
            }
          ],
          "placeholder" => "(Select...)"
        }
      end

      it 'return lookups and locations' do
        get :index, params: { all: true, format: :json }
        json_response = JSON.parse(response.body)
        expect(json_response).to eq(@expected_response)
      end
    end
  end
end
