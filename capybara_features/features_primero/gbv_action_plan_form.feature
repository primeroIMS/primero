# JIRA PRIMERO-489
# JIRA PRIMERO-736

@javascript @primero
Feature: GBV Action Plan Form
  As a Social GBV Worker / Data Entry Person, I want to create an case record in Primero 
  so that I can enter details about a GBV action plan.

  Scenario: As a logged in user, I create a new case
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "GBV" link
    And I press the "Action Plan" button
    And I fill in the following:
      | Describe the safety action plan        | <Select> Safe at Home                             |
      | Explain                                | Some explanation text                             |
      | Describe the health action plan.       | Some text describing the health action plan       |
      | Describe the legal action plan.        | Some text describing the legal action plan        |
      | Describe the psychosocial action plan. | Some text describing the psychosocial action plan |
    And I fill in the 1st "Action Plan Subform Section" subform with the follow:
      | Service                                   | Some service                     |
      | Describe the Action Plan for this Service | Service action plan description. |
    And I press "Save"
    Then I should see a success message for new Case
    And I should see a value for "Describe the safety action plan" on the show page with the value of "Safe at Home"
    And I should see a value for "Explain" on the show page with the value of "Some explanation text"
    And I should see a value for "Describe the health action plan." on the show page with the value of "Some text describing the health action plan"
    And I should see a value for "Describe the legal action plan." on the show page with the value of "Some text describing the legal action plan"
    And I should see a value for "Describe the psychosocial action plan." on the show page with the value of "Some text describing the psychosocial action plan"
    And I should see in the 1st "Action Plan Subform Section" subform with the follow:
      | Service                                   | Some service                     |
      | Describe the Action Plan for this Service | Service action plan description. |