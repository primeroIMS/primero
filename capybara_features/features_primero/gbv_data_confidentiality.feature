# JIRA PRIMERO-503
# JIRA PRIMERO-736

@javascript @primero
Feature: GBV Data Confidentiality
  As a Social Worker, I want to enter details about data confidentiality so that we can record
  the child's (individual's) wishes with respect to sharing information.

  Scenario: As a logged in user, I create a case details about data confidentiality
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "GBV Data Confidentiality" button
    And I fill in the following:
      | Consent to Release Information to Security Services                              | <Radio> Yes                        |
      | Specify Security Name, Facility or Agency/Organization as applicable             | Test Security Facility             |
      | Consent to Release Information to Psychosocial Services                          | <Radio> Yes                        |
      | Specify Psychosocial Name, Facility or Agency/Organization as applicable         | Test Psycosocial Facility          |
      | Consent to Release Information to Health/Medical Services                        | <Radio> Yes                        |
      | Specify Health/Medical Name, Facility or Agency/Organization as applicable       | Test Health Facility               |
      | Consent to Release Information to Safe House/Shelter                             | <Radio> Yes                        |
      | Specify Safe House/Shelter Name, Facility or Agency/Organization as applicable   | Test Safe House Facility           |
      | Consent to Release Information to Legal Assistance Services                      | <Radio> Yes                        |
      | Specify Legal Assistance Name, Facility or Agency/Organization as applicable     | Test Legal Assistance Facility     |
      | Consent to Release Information to Protection Services                            | <Radio> Yes                        |
      | Specify Protection Services Name, Facility or Agency/Organization as applicable  | Test Protection Services Facility  |
      | Consent to Release Information to Livelihoods Services                           | <Radio> Yes                        |
      | Specify Livelihoods Services Name, Facility or Agency/Organization as applicable | Test Livelihoods Services Facility |
      | Consent to Release Information to Other Services                                 | <Radio> Yes                        |
      | If other services, please specify service, name and agency                       | Test Other Facility                |
    And I press "Save"
    Then I should see a success message for new Case
    And I should see values on the page for the following:
      | Consent to Release Information to Security Services                              | Yes                                |
      | Specify Security Name, Facility or Agency/Organization as applicable             | Test Security Facility             |
      | Consent to Release Information to Psychosocial Services                          | Yes                                |
      | Specify Psychosocial Name, Facility or Agency/Organization as applicable         | Test Psycosocial Facility          |
      | Consent to Release Information to Health/Medical Services                        | Yes                                |
      | Specify Health/Medical Name, Facility or Agency/Organization as applicable       | Test Health Facility               |
      | Consent to Release Information to Safe House/Shelter                             | Yes                                |
      | Specify Safe House/Shelter Name, Facility or Agency/Organization as applicable   | Test Safe House Facility           |
      | Consent to Release Information to Legal Assistance Services                      | Yes                                |
      | Specify Legal Assistance Name, Facility or Agency/Organization as applicable     | Test Legal Assistance Facility     |
      | Consent to Release Information to Protection Services                            | Yes                                |
      | Specify Protection Services Name, Facility or Agency/Organization as applicable  | Test Protection Services Facility  |
      | Consent to Release Information to Livelihoods Services                           | Yes                                |
      | Specify Livelihoods Services Name, Facility or Agency/Organization as applicable | Test Livelihoods Services Facility |
      | Consent to Release Information to Other Services                                 | Yes                                |
      | If other services, please specify service, name and agency                       | Test Other Facility                |