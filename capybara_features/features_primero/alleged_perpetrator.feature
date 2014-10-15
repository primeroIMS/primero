# JIRA PRIMERO-481

@javascript @primero
Feature: Alleged Perpetrator
  As a User, I want to indicate who the alleged perpetrator is so that I can add this information to the incident

  Scenario: As a logged in user, I create a new incident with alleged perpetrator information
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Alleged Perpetrator" button
    And I fill in the 1st "Alleged Perpetrator" subform with the follow:
      | Is this the primary perpetrator? | <Radio> Primary |
      | Sex of Alleged Perpetrator(s)    | <Radio> Male   |
    And I fill in the 2nd "Alleged Perpetrator" subform with the follow:
      | Is this the primary perpetrator?  | <Radio> Secondary |
      | Past GBV by alledged perpetrator? | <Radio>  No       |
    And I press "Save"
    And I should see "Incident record successfully created." on the page
    Then I should see in the 1st "Alleged Perpetrator" subform with the follow:
      | Is this the primary perpetrator? | Primary  |
      | Sex of Alleged Perpetrator(s)    | Male     |
    Then I should see in the 2nd "Alleged Perpetrator" subform with the follow:
      | Is this the primary perpetrator?  | Secondary |
      | Past GBV by alledged perpetrator? | No        |
