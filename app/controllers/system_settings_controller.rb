class SystemSettingsController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end

  def show
    @page_name = t("primero_locale.show")
    @primero_language = I18n.locale
    @system_settings = SystemSettings.first
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => I18n }
    end
  end

  def edit
    @page_name = t("primero_locale.edit")
    @system_settings = SystemSettings.first
  end

  def update
    system_settings = SystemSettings.first
    I18n.default_locale = params[:locale]
    I18n.locale = I18n.default_locale
    if system_settings.present?
      system_settings.default_locale = I18n.default_locale
      system_settings.save!
    end
    flash[:notice] = I18n.t("primero_locale.updated")
    redirect_to edit_system_setting_path("administrator")
  end

end
