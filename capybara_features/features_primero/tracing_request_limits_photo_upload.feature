#JIRA PRIMERO-119

@javascript @primero
Feature: Tracing Request Limits Photo Upload
  As a Primero Product Owner, I want there to be limits on the number of photos files that can be uploaded
  so that the system does not become overloaded

  Background:
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I press the "Photos and Audio" button

  Scenario: Hide "Add another photo" button after click 9 times
    And I press the "Add another photo" button "9" times
    Then I should not see "Add another photo" on the page

  Scenario: Shows validation messages when add more than 10 photos
    And I attach the following photos for model "tracing_request":
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
    And I press "Save"
    And I press the "Edit" button
    And I attach the following photos for model "tracing_request":
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
    And I press "Save"
    Then I should see "You are only allowed 10 photos per tracing request."

  Scenario: Upload and remove photos
    And I attach the following photos for model "tracing_request":
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jorge.jpg|
    And I press "Save"
    And I press the "Edit" button
    And I check the "Delete photo?" field
    And I attach the following photos for model "tracing_request":
      |capybara_features/resources/jeff.png|
      |capybara_features/resources/jeff.png|
    And I press "Save"
    Then I should see "Tracing Request was successfully updated"