class AdminController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end

  def index
    @page_name = t("header.system_settings")
  end

  def update
    I18n.default_locale = params[:locale]
    I18n.locale=I18n.default_locale
    flash[:notice] = I18n.translate("user.messages.time_zone_updated")
    redirect_to admin_path
  end

end
