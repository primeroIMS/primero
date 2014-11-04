
@javascript @primero
Feature: Agencies
  As a User I want to be able to create and updated agencies and display logos

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "agencies page"

  Scenario: As a logged in user, I will create a agency and view the agency
    And I press the "Create" button
    And I fill in the following:
      | Name or Code | Unicef                             |
      | Description  | The United Nations Children's Fund |
    And I attach the following logo:
      |capybara_features/resources/small.gif|
    And I press "Save"
    Then I should see "Agency successfully created." on the page
    And I press the "Show" link
    And I should see a value for "Name or Code" on the show page with the value of "Unicef"
    And I should see a value for "Description" on the show page with the value of "The United Nations Children's Fund"
    And I press the "Edit" button
    And I fill in the following:
      | Name or Code | Unicef South |
    And I press "Save"
    And I should see "Agency successfully updated." on the page
    And I should see "Unicef South" on the page
    And I press the "Create" button
    And I fill in the following:
      | Name or Code | IRC |
    And I attach the following logo:
      |capybara_features/resources/jorge.jpg|
    And I press "Save"
    Then I should see "Agency successfully created." on the page
    And I should see the "2" logos in the header
    And I press the "Logout" button
    And I should see the "2" logos in the header

  Scenario: As a logged in user, I will create an agency with an invalid logo
     And I press the "Create" button
    And I fill in the following:
      | Name or Code | Unicef                             |
      | Description  | The United Nations Children's Fund |
    And I attach the following logo:
      |capybara_features/resources/sample.mp3|
    And I press "Save"
    And I should see "Please upload a valid logo file (jpg, gif, or png)" on the page

