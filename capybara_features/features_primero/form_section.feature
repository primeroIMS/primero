@javascript @primero
Feature: Form Section

Scenario: New form section
  Given I am logged in as an admin with username "primero" and password "primero"
  When I access "create form section page"
  And I should see "We encourage you to use the existing forms as this makes data sharing and data merging between institutions easier" on the page
  And I should not see the field validation message "Name is required"
  And I should not see the field validation message "Form Group Name is required"
  And I press "Save"
  And I should see the field validation message "Name is required"
  And I should see the field validation message "Form Group Name is required"
  And I fill in "Name" with "Sample Form Section"
  And I fill in "Description" with "Sample Form Section Description"
  And I press "Save"
  And I should not see the field validation message "Name is required"
  And I should see the field validation message "Form Group Name is required"
  And I choose option "Closure" from "Form Group Name"
  And I press "Save"
  And I should see "Form section successfully added" on the page
  And I should not see the field validation message "Name is required"
  And I should not see the field validation message "Form Group Name is required"
  And I fill in "Name" with ""
  And I press "Save"
  And I should see the field validation message "Name is required"
  And I should not see the field validation message "Form Group Name is required"