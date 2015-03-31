class PrimeroLocaleController < ApplicationController

  before_filter do
    authorize!(:manage, SystemUsers) #This sounds arbitrary, but implies that the user can manage other System settings
  end

  def edit
    @page_name = t("primero_locale.edit")
  end

  def update
    I18n.default_locale = params[:locale]
    I18n.locale=I18n.default_locale
    flash[:notice] = I18n.t("primero_locale.updated")
    redirect_to edit_primero_locale_path
  end

end
