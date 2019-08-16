require 'spec_helper'

feature "show page" do
  feature "edit users" do
    before(:all) do
      @agency_user_admin = create(:role, name: "agency_user_admin", description: "agency user admin test", permissions_list: [Permission.new(:resource => Permission::USER, :actions => [Permission::AGENCY_READ, Permission::WRITE, Permission::ASSIGN, Permission::MANAGE])])
      @agency1 = create(:agency, name: "agency1", agency_code: "AGENCY1", id: "agency1")
      @agency2 = create(:agency, name: "agency2", agency_code: "AGENCY2", id: "agency2")
      @user = setup_user(organization: "agency1", roles: @agency_user_admin)
      @user2 = setup_user(organization: "agency1")
      @user3 = setup_user(organization: "agency2")
    end

    xscenario "as agency user admin and sees only users in same agency" do
      create_session(@user, 'password123')
      visit "/users"
      expect(page).to have_content @user.user_name
      expect(page).to have_content @user2.user_name
      expect(page).to_not have_content @user3.user_name
    end

    xscenario "as admin and sees all users" do
      create_session(@user2, 'password123')
      visit "/users"
      expect(page).to have_content @user.user_name
      expect(page).to have_content @user2.user_name
      expect(page).to have_content @user3.user_name
    end
  end
end