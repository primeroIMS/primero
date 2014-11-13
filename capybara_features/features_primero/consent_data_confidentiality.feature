# JIRA PRIMERO-110
# JIRA PRIMERO-232
# JIRA PRIMERO-239
# JIRA PRIMERO-350
# JIRA PRIMERO-736

@javascript @primero
Feature: Consent Data Confidentiality
  As a Social Worker, I want to enter details about data confidentiality so that we can record
  the child's (individual's) wishes with respect to sharing information.

  Scenario: As a logged in user, I create a case details about data confidentiality
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Data Confidentiality" button
    When I select "Other (please specify)" from "Consent Obtained From"
    And I fill in "If Other, please specify" with "Other"
    And I select "Yes" for "Consent has been obtained for the child to receive services" radio button
    And I select "Yes" for "Consent is given share non-identifiable information for reporting" radio button
    And I select "Yes" for "Consent has been obtained to disclose information for tracing purposes" radio button
    And I choose from "Consent has been given to share the information collected with":
      |  Family                |
      |  Authorities           |
    And I fill in "If information can be shared with others, please specify who" with "N/A"
    And I fill in "What information should be withheld from a particular person or individual" with "None"
    And I choose from "Reason for withholding information":
      |  Fear of harm to themselves or others    |
      |  Other reason, please specify            |
    And I fill in "If other reason for withholding information, please specify" with "Other reason"
    And I press "Save"
    Then I should see a success message for new Case
    When I press the "Data Confidentiality" button
    Then I should see a value for "Consent Obtained From" on the show page with the value of "Other (please specify)"
    And I should see a value for "If Other, please specify" on the show page with the value of "Other"
    And I should see a value for "Consent has been obtained for the child to receive services" on the show page with the value of "Yes"
    And I should see a value for "Consent has been obtained for the child to receive services" on the show page with the value of "Yes"
    And I should see a value for "Consent is given share non-identifiable information for reporting" on the show page with the value of "Yes"
    And I should see a value for "Consent has been obtained to disclose information for tracing purposes" on the show page with the value of "Yes"
    And I should see a value for "Consent has been given to share the information collected with" on the show page with the value of "Family, Authorities"
    And I should see a value for "If information can be shared with others, please specify who" on the show page with the value of "N/A"
    And I should see a value for "What information should be withheld from a particular person or individual" on the show page with the value of "None"
    And I should see a value for "Reason for withholding information" on the show page with the value of "Fear of harm to themselves or others, Other reason, please specify"
    And I should see a value for "If other reason for withholding information, please specify" on the show page with the value of "Other reason"
