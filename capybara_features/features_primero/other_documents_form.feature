#JIRA PRIMERO-413

@javascript @primero
Feature: Other documents form
  As a social user I want to upload documents that are not photos or audio files and enter a description of the document.

  Scenario: I upload an executable file
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Other Documents" button
    And I attach a document "capybara_features/resources/exe_file.exe"
    Then I press "Save"
    And I should see "Executable files are not allowed." on the page

  Scenario: I upload a document file with the incorrect size
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Other Documents" button
    And I attach a document "capybara_features/resources/huge.jpg"
    Then I press "Save"
    And I should see "Please upload a document smaller than 10mb" on the page

  Scenario: Uploading multiple documents
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I click the "Other Documents" link
    And I attach the following documents:
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
    And I fill in "Document Description" with "Document upload test"
    Then I press "Save"
    And I should see "Case record successfully created"
    And I click the "Other Documents" link
    And I should see a value for "Other Document" on the show page with the value of "<Documents>jorge.jpg jeff.png"
    And I follow "Edit"
    And I click the "Other Documents" link
    And I should see "jorge.jpg" on the page
    And I should see "jeff.png" on the page

  Scenario: Uploading more documents than allowed
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I click the "Other Documents" link
    And I attach the following documents:
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
      |capybara_features/resources/jorge.jpg|
      |capybara_features/resources/jeff.png |
    And I fill in "Document Description" with "Document upload test"
    Then I press "Save"
    And I should see "You are only allowed 10 documents per case." on the page