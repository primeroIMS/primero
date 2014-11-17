# JIRA PRIMERO-52
# JIRA PRIMERO-757

@javascript @primero
Feature: Primero Home Page Link
  As a Product Owner, I want the Primero page template to include the Primero name, so that the application is branded when it is deployed for use

  Scenario Outline: I want the Primero name on every page with a link to the homepage
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access <page>
    Then I should see a "Primero" button on the page
    And I press the "Primero" button
    And I should see "Scheduled Activities"
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

  Scenario: On the Home page I should see a ACTIONS button with a dropdown format for what the user has permissions for.
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And I press the "Actions" button
    And I should see "Create New Case" on the page
    And I should not see "Create New Incident" on the page
    And I should see "Create New Tracing Request" on the page
    And I press the "Create New Case" button
    And I should be on the new case page
    And I press the "Primero" button
    And I press the "Actions" button
    And I press the "Create New Tracing Request" button
    And I should be on the new tracing request page
    And I press the "Logout" link

    And I am logged in as an admin with username "primero_gbv" and password "primero"
    And I press the "Actions" button
    And I should see "Create New Case" on the page
    And I should see "Create New Incident" on the page
    And I should not see "Create New Tracing Request" on the page
    And I press the "Create New Case" button
    And I should be on the new case page
    And I press the "Primero" button
    And I press the "Actions" button
    And I press the "Create New Incident" button
    And I should be on the new incident page
    And I press the "Logout" link

    And I am logged in as an admin with username "primero_mrm" and password "primero"
    And I press the "Actions" button
    And I should not see "Create New Case" on the page
    And I should see "Create New Incident" on the page
    And I should not see "Create New Tracing Request" on the page
    And I press the "Create New Incident" button
    And I should be on the new incident page
    And I press the "Logout" link

    And I am logged in as an admin with username "primero" and password "primero"
    And I press the "Actions" button
    And I should see "Create New Case" on the page
    And I should see "Create New Incident" on the page
    And I should see "Create New Tracing Request" on the page
    And I press the "Create New Case" button
    And I should see "CP" on the page
    And I should see "GBV" on the page
    And I press the "Create New Incident" button
    And I should see "GBV" on the page
    And I should see "MRM" on the page
    And I press the "Create New Tracing Request" button
    And I should be on the new tracing request page