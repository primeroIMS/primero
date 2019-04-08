class UserPreferencesController < ApplicationController

  def update
    @user = current_user
    if @user.update_attributes(params[:user].reject{ |_,v| v.empty? }.to_h)
      I18n.locale=@user.locale
      flash[:notice] = t("user.messages.time_zone_updated")
    end
    redirect_to root_path
  end
end
