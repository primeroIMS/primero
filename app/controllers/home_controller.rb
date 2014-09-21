class HomeController < ApplicationController

  def index
    @page_name = t("home.label")
    @user = User.find_by_user_name(current_user_name)
    @notifications = PasswordRecoveryRequest.to_display
    #TODO - RSE - Temporary.  Commented out to gain some speed
    # Due to Child loading formsections bug
    #@suspect_record_count = Child.flagged.count
  end
end
