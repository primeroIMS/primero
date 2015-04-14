class SystemSettingsController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end

  def show
    @page_name = t("primero_locale.show")
    @primero_language = I18n.locale
    @systemSettings = SystemSettings.first
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => I18n }
    end
  end

  def edit_locale
    @page_name = t("primero_locale.edit")
    @systemSettings = SystemSettings.first
  end

  def update_locale
    systemSettings = SystemSettings.first
    I18n.default_locale = params[:locale]
    I18n.locale=I18n.default_locale
    if systemSettings.present?
      systemSettings.default_locale = I18n.default_locale
      systemSettings.save!
    end
    flash[:notice] = I18n.t("primero_locale.updated")
    redirect_to edit_locale_system_setting_path("administrator")
  end

end
