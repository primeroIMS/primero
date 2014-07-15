#JIRA PRIMERO-270

@javascript @primero
Feature: Sexual Violence Form
  As a Social Worker / Data Entry Person, I want to enter information about the incident type in
  so that I can report on specific details related to the type of incident.

  Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Sexual Violence" button
    And I fill in the following:
      | Number of victims: boys    | 1 |
      | Number of victims: girls   | 2 |
      | Number of victims: unknown | 3 |
      | Number of total victims    | 6 |
      | Type of Violence           | <Choose>Forced Marriage<Choose>Forced Sterilization      |
      | Type of GBV                | <Select> Denial of Resources, Opportunities, or Services |
      | If Non-GBV, describe       | describe: It is not a GBV |
      | Was this incident a Harmful Traditional Practice | <Select> Option 1 |
      | Were money, goods, benefits, and/or services exchanged in relation to the incident? | <Radio> Yes |
      | Stage of displacement at time of incident            | <Select> During Flight       |
      | Type of abduction at time of the incident            | <Select> Forced Conscription |
      | Has the client reported this incident anywhere else? | <Radio> Unknown             |
    And I fill in the 1st "GBV Details Section" subform with the follow:
      |Type of service provider where the survivor reported the incident | <Select> Legal Assistance Services |
      |Name of the service provider                                      | Organization 1                     |
      |Is this a GBV reporting organization?                             | <Radio> Yes                        |
    And I fill in the 2nd "GBV Details Section" subform with the follow:
      |Type of service provider where the survivor reported the incident | <Select> Psychosocial/Counseling Services |
      |Name of the service provider                                      | Organization 2                            |
      |Is this a GBV reporting organization?                             | <Radio> No                                |
    And I fill in the following:
      | Has the client had any previous incidents of GBV perpetrated against them? | <Radio> No |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Type of Violence" on the show page with the value of "Forced Marriage, Forced Sterilization"
    And I should see a value for "Type of GBV" on the show page with the value of "Denial of Resources, Opportunities, or Services"
    And I should see a value for "If Non-GBV, describe" on the show page with the value of "describe: It is not a GBV"
    And I should see a value for "Was this incident a Harmful Traditional Practice" on the show page with the value of "Option 1"
    And I should see a value for "Were money, goods, benefits, and/or services exchanged in relation to the incident?" on the show page with the value of "Yes"
    And I should see a value for "Stage of displacement at time of incident" on the show page with the value of "During Flight"
    And I should see a value for "Type of abduction at time of the incident" on the show page with the value of "Forced Conscription"
    And I should see a value for "Has the client reported this incident anywhere else?" on the show page with the value of "Unknown"
    And I should see in the 1st "GBV Detail" subform with the follow:
      | Type of service provider where the survivor reported the incident | Legal Assistance Services  |
      | Name of the service provider                                      | Organization 1             |
      | Is this a GBV reporting organization?                             | Yes                        |
    And I should see in the 2nd "GBV Detail" subform with the follow:
      | Type of service provider where the survivor reported the incident | Psychosocial/Counseling Services  |
      | Name of the service provider                                      | Organization 2                    |
      | Is this a GBV reporting organization?                             | No                                |
    And I should see a value for "Has the client had any previous incidents of GBV perpetrated against them?" on the show page with the value of "No"