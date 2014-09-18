#JIRA PRIMERO-501
#JIRA PRIMERO-534

@javascript @primero
Feature: GBV Sexual Violence
  As a GBV Social Worker / Data Entry Person, I want to enter information about the GBV Sexual Violence on the incident.

  Scenario: As a logged in user, I will create a GBV incident for sexual violence
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Sexual Violence" button
    And the "Type of service provider where the survivor reported the incident" dropdown should not have the following options:
      |No|
    And I fill in the following:
      | Type of Incident Violence                                                           | <Select> Denial of Resources, Opportunities, or Services |
      | If Non-GBV, describe                                                                | describe: It is not a GBV                                |
      | Was this incident a Harmful Traditional Practice                                    | <Select> Type of Practice 4                              |
      | Were money, goods, benefits, and/or services exchanged in relation to the incident? | <Radio> Yes                                              |
      | Type of abduction at time of the incident                                           | <Select> Forced Conscription                             |
      | Has the client reported this incident anywhere else?                                | <Radio> Yes                                              |
      | Has the client had any previous incidents of GBV perpetrated against them?          | <Radio> No                                               |
      And I fill in the 1st "GBV Reported Elsewhere Subform" subform with the follow:
        | Type of service provider where the survivor reported the incident                   | <Select> Legal Assistance Services                     |
        | Name of the service provider                                                        | Organization 1                                         |
        | Is this a GBV reporting organization?                                               | <Radio> Yes                                            |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see values on the page for the following:
      | Type of Incident Violence                                                           | Denial of Resources, Opportunities, or Services |
      | If Non-GBV, describe                                                                | describe: It is not a GBV                       |
      | Was this incident a Harmful Traditional Practice                                    | Type of Practice 4                              |
      | Were money, goods, benefits, and/or services exchanged in relation to the incident? | Yes                                             |
      | Type of abduction at time of the incident                                           | Forced Conscription                             |
      | Has the client reported this incident anywhere else?                                | Yes                                             |
      | Has the client had any previous incidents of GBV perpetrated against them?          | No                                              |
    And I should see 1 subform on the show page for "GBV Reported Elsewhere Subform"
    And I should see in the 1st "GBV Reported Elsewhere Subform" subform with the follow:
      | Type of service provider where the survivor reported the incident                   | Legal Assistance Services                       |
      | Name of the service provider                                                        | Organization 1                                  |
      | Is this a GBV reporting organization?                                               | Yes                                             |