# JIRA PRIMERO-487
# JIRA PRIMERO-565
# JIRA PRIMERO-736

@javascript @primero
Feature: GBV Survivor Assessment Form
  As a Social GBV Worker / Data Entry Person, I want to create a case record in Primero 
  so that I can enter details about a GBV case.

  Scenario: As a logged in user, I create a new case
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Survivor Assessment" button
    And I fill in the following:
      | Survivor Context                                               | Some text                                                           |
      | Assessement of Presenting Problem                              | Assessement of presenting problem                                   |
      | Assessement of Immediate Need                                  | Assessement of immediate need                                       |
      | Will the survivor be in immediate danger when she leaves here? | <Radio> Yes                                                         |
      | Explain                                                        | Some explanation                                                    |
      | How safe does the survivor feel at home?                       | <Select> Not safe at all                 |
      | Describe the survivor’s emotional state                        | <Select> Other, please specify           |
      | If other was selected for the survivor's emotional state, please provide detail | Emotional state details |
    And I press "Save"
    Then I should see a success message for new Case
    And I should see a value for "Survivor Context" on the show page with the value of "Some text"
    And I should see a value for "Assessement of Presenting Problem" on the show page with the value of "Assessement of presenting problem"
    And I should see a value for "Assessement of Immediate Need" on the show page with the value of "Assessement of immediate need"
    And I should see a value for "Will the survivor be in immediate danger when she leaves here?" on the show page with the value of "Yes"
    And I should see a value for "Explain" on the show page with the value of "Some explanation"
    And I should see a value for "How safe does the survivor feel at home?" on the show page with the value of "Not safe at all"
    And I should see a value for "Describe the survivor’s emotional state" on the show page with the value of "Other, please specify"
    And I should see a value for "If other was selected for the survivor's emotional state, please provide detail" on the show page with the value of "Emotional state details"