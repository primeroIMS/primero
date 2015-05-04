# encoding: utf-8

require 'spec_helper'

describe SystemSettingsController do
  before :each do
    fake_admin_login
  end

  after :each do
    I18n.default_locale = :en
  end

  it "should set the given locale as default" do
    put :update, :locale => "fr", :id => "administrator"
    I18n.default_locale.should == :fr
  end

  it "should flash a update message when the system language is changed and affected by language changed " do
    put :update, :locale => "zh", :id => "administrator"
    flash[:notice].should =="System Settings successfully updated."
    response.should redirect_to(edit_system_setting_path)
  end
end

