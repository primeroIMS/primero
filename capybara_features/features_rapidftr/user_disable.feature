#JIRA PRIMERO-317

Feature: User disable

  As an Admin
  I want to disable and later re-enable user accounts via the web interface
  So that only those who should have access are able to access the system,

  # Scenario: Disabled user can't log in
  #   see user_login.feature

  @javascript
  Scenario: Admin disables a user and re-enables a user from the edit page

    Given a user "pooja"
    And I am logged in as a user with "Admin,Disable Users" permissions
    And I am on the manage users page

    When the user "pooja" checkbox is marked as "disabled"
    And I wait for the page to load
    Then user "pooja" should be disabled
    And the user "pooja" should be marked as disabled

  	When I follow "Show" within "#user-row-pooja"
  	Then I should see "Disabled"

    And I am on the manage users page
    When the user "pooja" checkbox is marked as "enabled"
    And I wait for the page to load
    
    Then user "pooja" should not be disabled
    And the user "pooja" should be marked as enabled

    When I follow "Show" within "#user-row-pooja"
    Then I should see "Enabled"


 # @allow-rescue
  Scenario: A user who is disabled mid-session can't continue using that session

    Given a user "george"
    And I am logged in as "george"
    And I am on the cases page

    When user "george" is disabled
    And I follow "New Case"

    Then I am on the login page
