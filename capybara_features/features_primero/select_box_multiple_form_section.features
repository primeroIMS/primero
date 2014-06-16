# JIRA PRIMERO-144

@javascript @primero
Feature: Select Box Multiple Form Section
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances
  so that we can track and report on areas of particular concern.
  
  Scenario: As a logged in user, I should access the form section and add select boxes that allow multiple selection
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Create New Form Section" button
    And I fill in the following:
     |Name | Form Section Name Sample |
    And I press "Save Details"
    And I follow "Add"
    And I follow "Select drop down"
    And I fill in "field_display_name_en" with "Multiple Options Field"
    And I fill the following options into "field_option_strings_text_en":
    """
    One
    Two
    Three
    """
    And I check "Multiple Selection" within "#field_details_options"
    And I press "Save Details" within "#field_details_options"
    Then I should see "Field successfully added"
