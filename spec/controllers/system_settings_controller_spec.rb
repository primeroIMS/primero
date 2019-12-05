# encoding: utf-8

require 'rails_helper'

describe SystemSettingsController do
  before do
    SystemSettings.all.each &:destroy
    reporting_location = ReportingLocation.new(field_key: 'owned_by_location', label_key: 'district', admin_level: 2,
                                               type: ReportingLocation::PRIMARY_REPORTING_LOCATION, hierarchy_filter: ['blah'])
    secondary_reporting_location = ReportingLocation.new(field_key: 'location_current', label_key: 'governorate', admin_level: 1,
                                               type: ReportingLocation::SECONDARY_REPORTING_LOCATION, hierarchy_filter: ['blah'])
    @system_settings = SystemSettings.create(default_locale: 'en',
                                             case_code_separator: '-',
                                             reporting_location_config: reporting_location,
                                             reporting_locations: [reporting_location, secondary_reporting_location],
                                             primero_version: '1.3.3',
                                             age_ranges: {'primero' => ["0 - 5","6 - 11","12 - 17","18+"],
                                                          'unhcr' => ["0 - 4","5 - 11","12 - 17","18 - 59","60+"]},
                                             primary_age_range: 'primero',
                                             location_limit_for_api: 150,
                                             welcome_email_text: "Welcome to Primero")
    fake_admin_login
  end

  after :each do
    I18n.default_locale = :en
  end

  it "should set the given locale as default" do
    ss_hash = {default_locale: 'fr'}
    put :update, params: { :system_settings => ss_hash, :id => "administrator" }
    I18n.default_locale.should == :fr
  end

  it "should flash a update message when the system language is changed and affected by language changed " do
    ss_hash = {default_locale: 'en'}
    put :update, params: { :system_settings => ss_hash, :id => "administrator" }
    flash[:notice].should =="System Settings successfully updated."
    response.should redirect_to(edit_system_setting_path)
  end

  describe "get index" do
    it "should render requested sources as json." do
      get :index, params: { format: :json }
      expect(response.content_type.to_s).to eq('application/json')
    end

    it "should return requested sources." do
      ss = {"default_locale" => "en", "case_code_format" => [], "case_code_separator" => '-',
            "auto_populate_list" => [], "unhcr_needs_codes_mapping" => nil,
            "reporting_location_config" => {"field_key"=>"owned_by_location",
                                            "label_key"=>"district",
                                            "admin_level"=>2,
                                            "reg_ex_filter"=>nil,
                                            "type"=>"primary",
                                            "hierarchy_filter"=>["blah"]},
            "reporting_locations"=>
              [{"field_key"=>"owned_by_location",
                "label_key"=>"district",
                "admin_level"=>2,
                "reg_ex_filter"=>nil,
                "type"=>"primary",
                "hierarchy_filter"=>["blah"]},
               {"field_key"=>"location_current",
                "label_key"=>"governorate",
                "admin_level"=>1,
                "reg_ex_filter"=>nil,
                "type"=>"secondary",
                "hierarchy_filter"=>["blah"]}],
            "primero_version" => @system_settings.primero_version,
            "age_ranges" => {"primero" => ["0 - 5","6 - 11","12 - 17","18+"],
                             "unhcr" => ["0 - 4","5 - 11","12 - 17","18 - 59","60+"]},
            "primary_age_range" => "primero",
            "location_limit_for_api"=>150,
            "approval_forms_to_alert"=>nil,
            "changes_field_to_form"=>nil,
            "due_date_from_appointment_date"=>false,
            "notification_email_enabled"=>false,
            "welcome_email_enabled"=>false,
            "_id" => @system_settings.id,
            "_rev" => @system_settings.rev,
            "couchrest-type" => "SystemSettings"}
      Primero::Application::locales.reject{|l| l == 'en'}.each{|loc| ss["welcome_email_text_#{loc}"] = nil}
      ss["welcome_email_text_en"] = "Welcome to Primero"

      get :index, params: { string_sources: ['Location'], format: :json }
      json_response = JSON.parse(response.body)
      expect(json_response).to include('success'=>1)
      expect(json_response).to include('settings')
      expect(json_response['settings']).to include(ss)
    end
  end
end

