@wip
Feature: Create child new disabled form section
  As an user I should not see disabled forms when adding new child

  #TODO: Add back after demo deploy. Tabs were temp disabled
  @wip
  Scenario:      User creates new child record and does not see disabled forms

    Given I am logged in as a user with "Create Cases" permission
    And the following form sections exist in the system:
      | name              | description                   | unique_id         | parent_form | order | visible |
      | Basic Details     | Basic details about a child   | basic_details     | case        | 1     | true    |
      | Family Details    | Details of the child's family | family_details    | case        | 2     | true    |
      | Caregiver Details |                               | caregiver_details | case        | 3     | true    |
      | Disabled          |                               | disabled_details  | case        | 4     | false   |
    And I am on children listing page
    And I follow "New Case"

    Then I should see the "Basic Details" tab
    And I should see the "Family Details" tab
    And I should see the "Caregiver Details" tab
    And I should not see the "Disabled Details" tab
