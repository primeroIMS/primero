# JIRA PRIMERO-122

@javascript @primero
Feature: CAAFAG Profile
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances
  so that we can track and report on areas of particular concern.

  Scenario: As a logged in user, I should access the form section CAAFAG profile
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "CAAFAG Profile" button
    Then I should see the following fields:
    | UN DDR Number                            |
    | With which armed group or armed force was the child associated? |
    | If not forced, what was the main reason why the child became involved in the armed force? (type of recruitment) |
    | Other reason for enrollment              |
    | What was the main role of the child?     |
    | Did the child own/use a weapon           |
    | How did the child leave the armed group? |

  Scenario: As a logged in user, I create a case with CAAFAG profile information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "CAAFAG Profile" button
    And I select "Other Paramilitary group" from "With which armed group or armed force was the child associated?"
    And I select "Financial reasons" from "If not forced, what was the main reason why the child became involved in the armed force? (type of recruitment)"
    And I select "Combat support" from "What was the main role of the child?"
    And I select "Yes" from "Did the child own/use a weapon"
    And I select "Normal" from "How did the child leave the armed group?"
    And I select "Formal DDR program" from "Reason for release from Military"
    And I fill in the following:
      | UN DDR Number               | 50          |
      | Other reason for enrollment | Some reason |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "CAAFAG Profile" button
    And I should see a value for "UN DDR Number" on the show page with the value of "50"
    And I should see a value for "Other reason for enrollment" on the show page with the value of "Some reason"
    And I should see a value for "With which armed group or armed force was the child associated?" on the show page with the value of "Other Paramilitary group"
    And I should see a value for "If not forced, what was the main reason why the child became involved in the armed force? (type of recruitment)" on the show page with the value of "Financial reasons"
    And I should see a value for "What was the main role of the child?" on the show page with the value of "Combat support"
    And I should see a value for "Did the child own/use a weapon" on the show page with the value of "Yes"
    And I should see a value for "How did the child leave the armed group?" on the show page with the value of "Normal"
    And I should see a value for "Reason for release from Military" on the show page with the value of "Formal DDR program"
