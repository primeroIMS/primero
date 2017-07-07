# encoding: utf-8

require 'spec_helper'

describe SystemSettingsController do
  before :each do
    reporting_location = ReportingLocation.new(field_key: 'owned_by_location', label_key: 'district', admin_level: 2, reg_ex_filter: 'blah')
    @system_settings = SystemSettings.create(default_locale: 'en',
                                             case_code_separator: '-',
                                             reporting_location_config: reporting_location,
                                             primero_version: '1.3.3',
                                             age_ranges: {'primero' => ["0 - 5","6 - 11","12 - 17","18+"],
                                                          'unhcr' => ["0 - 4","5 - 11","12 - 17","18 - 59","60+"]},
                                             primary_age_range: 'primero',
                                             location_limit_for_api: 150)
    fake_admin_login
  end

  after :each do
    SystemSettings.all.each &:destroy
    I18n.default_locale = :en
  end

  it "should set the given locale as default" do
    put :update, :locale => "fr", :id => "administrator"
    I18n.default_locale.should == :fr
  end

  it "should flash a update message when the system language is changed and affected by language changed " do
    put :update, :locale => "en", :id => "administrator"
    flash[:notice].should =="System Settings successfully updated."
    response.should redirect_to(edit_system_setting_path)
  end

  describe "get index" do
    before do
      fake_admin_login
    end

    it "should render requested sources as json." do
      get :index, format: :json
      expect(response.content_type.to_s).to eq('application/json')
    end

    it "should return requested sources." do
      expected_response = {
          "success" => 1,
          "settings" => {"default_locale" => "en", "case_code_format" => [], "case_code_separator" => '-',
                         "auto_populate_list" => [], "unhcr_needs_codes_mapping" => nil,
                         "reporting_location_config" => {"field_key" => "owned_by_location",
                                                         "label_key" => "district",
                                                         "admin_level" => 2,
                                                         "reg_ex_filter" => 'blah'},
                         "primero_version" => @system_settings.primero_version,
                         "age_ranges" => {"primero" => ["0 - 5","6 - 11","12 - 17","18+"],
                                          "unhcr" => ["0 - 4","5 - 11","12 - 17","18 - 59","60+"]},
                         "primary_age_range" => "primero",
                         "location_limit_for_api"=>150,
                         "approval_forms_to_alert"=>nil,
                         "_id" => @system_settings.id, "_rev" => @system_settings.rev,
                         "couchrest-type" => "SystemSettings"}
      }
      get :index, string_sources: ['Location'], format: :json
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(expected_response)
    end
  end
end

