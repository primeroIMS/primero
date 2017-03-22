class SystemSettingsController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end
  before_filter :load_system_settings, :only => [:show, :index, :edit, :update]

  @model_class = SystemSettings

  include LoggerActions

  def show
    @page_name = t("system_settings.show")
    @primero_language = I18n.locale
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => I18n }
    end
  end

  #NOTE: By rule, there should only be 1 SystemSettings row
  #      So, the index only returns 1 record
  def index
    respond_to do |format|
      if @system_settings.present?
        format.json { render json: { success: 1, settings: @system_settings }}
      else
        format.json { render json: { message: I18n.t("messages.system_settings_failed"), success: 0 }}
      end
    end
  end

  def edit
    @page_name = t("system_settings.edit")
  end

  def update
    if @system_settings.present?
      @system_settings.default_locale = params[:locale]
      @system_settings.save!
      @system_settings.update_default_locale
    end
    flash[:notice] = I18n.t("system_settings.updated")
    redirect_to edit_system_setting_path("administrator")
  end

  private

  def load_system_settings
    @system_settings = SystemSettings.first
  end

end
