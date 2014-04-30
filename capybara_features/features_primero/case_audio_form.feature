# JIRA PRIMERO-96
@javascript @primero
Feature: Case Audio Form
  As a Social Worker, I want to upload photos and audio

  Scenario: I upload a photo with the incorrect format
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/textfile.txt"
    And I press "Save"
    Then I should see "Please upload a valid photo file (jpg or png) for this case record" on the page

  Scenario: I upload a audio file with the incorrect format
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach an audio file "capybara_features/resources/textfile.txt"
    And I press "Save"
    Then I should see "Please upload a valid audio file (amr or mp3) for this case record" on the page

  Scenario: I upload a photo file with the incorrect size
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/huge.jpg"
    And I press "Save"
    Then I should see "Please upload a file smaller than 10mb" on the page

  Scenario: I upload a audio file with the incorrect size
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach an audio file "capybara_features/resources/huge.mp3"
    And I press "Save"
    Then I should see "Please upload a file smaller than 10mb" on the page

  Scenario: I upload a photo file with the correct size and format
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I press "Save"
    Then I should see "Case record successfully created" on the page

  Scenario: I upload a audio file with the correct size and format
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press the "Photos and Audio" button
    And I attach an audio file "capybara_features/resources/sample.mp3"
    And I press "Save"
    Then I should see "Case record successfully created" on the page






