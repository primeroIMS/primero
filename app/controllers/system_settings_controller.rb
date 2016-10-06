class SystemSettingsController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end

  @model_class = SystemSettings

  include LoggerActions

  def show
    @page_name = t("system_settings.show")
    @primero_language = I18n.locale
    @system_settings = SystemSettings.first
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => I18n }
    end
  end

  def edit
    @page_name = t("system_settings.edit")
    @system_settings = SystemSettings.first
  end

  def update
    system_settings = SystemSettings.first
    if system_settings.present?
      system_settings.default_locale = params[:locale]
      system_settings.save!
      system_settings.update_default_locale
    end
    flash[:notice] = I18n.t("system_settings.updated")
    redirect_to edit_system_setting_path("administrator")
  end

end
