# JIRA PRIMERO-327
# JIRA PRIMERO-352
# JIRA PRIMERO-363
# JIRA PRIMERO-402
# JIRA PRIMERO-365

@javascript @primero
Feature: Services Form
  As a Social Worker / Data Entry Person, I want capture information about referrals for services so that I can record the status about these services in relation to the survivor

  Scenario: As a logged in user, I will create a incident for services
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Services" button
    And I fill in the following:
      | Who referred the client to you?                        | <Choose>Other         |
      | If survivor referred from Other, please specify.       | Other service leader  |
      | Did you refer the client to a safe house/safe shelter? | <Select> Referred     |
      | Appointment Date                                       | 21-Jul-2014           |
      | Appointment Time                                       | 03:30 p.m.            |
      | Service Provider                                       | Service provider name |
      | Service Location                                       | Service location      |
      | Notes                                                  | Some nothes           |
    And I fill in the 1st "Health_Medical Referral Subform Section" subform with the follow:
      | Did you refer the client to Health/Medical Services? | <Select> No referral, Service provided by your agency |
      | Appointment Date                                     | 22-07-2014                                            |
      | Appointment Time                                     | 10:00 a.m.                                            |
      | Service Provider                                     | Health/Medical Service provider name                  |
      | Service Location                                     | Health/Medical Service location                       |
      | Notes                                                | Health/Medical Notes                                  |
    And I fill in the 1st "Psychosocial_Counseling Services Subform Section" subform with the follow:
      | Did you refer the client to Psychosocial/Counseling services? | <Select> No referral, Services already received from another agency |
      | Appointment Date                                              | 23-Jul-2014                                                         |
      | Appointment Time                                              | 11:00 a.m.                                                          |
      | Service Provider                                              | Psychosocial/Counseling Service provider name                       |
      | Service Location                                              | Psychosocial/Counseling Service location                            |
      | Notes                                                         | Psychosocial/Counseling Notes                                       |
      | Does the client want to pursue legal action?                  | <Radio> Yes                                                         |
    And I fill in the 1st "Legal Assistance Services Subform Section" subform with the follow:
      | Did you refer the client to Legal services? | <Select> No referral, Service not applicable |
      | Appointment Date                            | 24-Jul-2014                                  |
      | Appointment Time                            | 12:00 p.m.                                   |
      | Service Provider                            | Legal Service provider name                  |
      | Service Location                            | Legal Service location                       |
      | Notes                                       | Legal Services Notes                         |
    And I fill in the 1st "Police or Other Type of Security Services Subform Section" subform with the follow:
      | Did you refer the client to Police/Other services?   | <Select> No, Referral declined by survivor |
      | Appointment Date                                     | 25-Jul-2014                                |
      | Appointment Time                                     | 01:00 p.m.                                 |
      | Service Provider                                     | Police/Other Service provider name         |
      | Service Location                                     | Police/Other Service location              |
      | Notes                                                | Police/Other Notes                         |
    And I fill in the 1st "Livelihoods Services Subform Section" subform with the follow:
      | Did you refer the client to a livelihoods program? | <Select> No referral, Service provided by your agency |
      | Appointment Date                                   | 26-Jul-2014                                           |
      | Appointment Time                                   | 10:00 a.m.                                            |
      | Service Provider                                   | Livelihoods program provider name                     |
      | Service Location                                   | Livelihoods program location                          |
      | Notes                                              | Livelihoods program Notes                             |
    And I fill in the 1st "Child Protection Services Subform Section" subform with the follow:
      | Did you refer the client to Child Protection services? | <Select> No referral, Service provided by your agency |
      | Appointment Date                                       | 26-Jul-2014                                           |
      | Appointment Time                                       | 10:00 a.m.                                            |
      | Service Provider                                       | Chid Protection provider name                         |
      | Service Location                                       | Chid Protection location                              |
      | Notes                                                  | Chid Protection Notes                                 |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    # And I should see 1 subform on the show page for "Killing"
    And I should see in the 1st "Health Medical Referral Subform Section" subform with the follow:
      | Did you refer the client to Health/Medical Services? | No referral, Service provided by your agency |
      | Appointment Date                                     | 22-Jul-2014                                  |
      | Appointment Time                                     | 10:00 a.m.                                   |
      | Service Provider                                     | Health/Medical Service provider name         |
      | Service Location                                     | Health/Medical Service location              |
      | Notes                                                | Health/Medical Notes                         |
    And I should see in the 1st "Psychosocial Counseling Services Subform Section" subform with the follow:
      | Did you refer the client to Psychosocial/Counseling services? | No referral, Services already received from another agency |
      | Appointment Date                                              | 23-Jul-2014                                                |
      | Appointment Time                                              | 11:00 a.m.                                                 |
      | Service Provider                                              | Psychosocial/Counseling Service provider name              |
      | Service Location                                              | Psychosocial/Counseling Service location                   |
      | Notes                                                         | Psychosocial/Counseling Notes                              |
      | Does the client want to pursue legal action?                  | Yes                                                        |
    And I should see in the 1st "Legal Assistance Services Subform Section" subform with the follow:
      | Did you refer the client to Legal services? | No referral, Service not applicable |
      | Appointment Date                            | 24-Jul-2014                         |
      | Appointment Time                            | 12:00 p.m.                          |
      | Service Provider                            | Legal Service provider name         |
      | Service Location                            | Legal Service location              |
      | Notes                                       | Legal Services Notes                |
    And I should see in the 1st "Police or Other Type of Security Services Subform Section" subform with the follow:
      | Did you refer the client to Police/Other services?   | No, Referral declined by survivor  |
      | Appointment Date                                     | 25-Jul-2014                        |
      | Appointment Time                                     | 01:00 p.m.                         |
      | Service Provider                                     | Police/Other Service provider name |
      | Service Location                                     | Police/Other Service location      |
      | Notes                                                | Police/Other Notes                 |
    And I should see in the 1st "Livelihoods Services Subform Section" subform with the follow:
      | Did you refer the client to a livelihoods program? | No referral, Service provided by your agency |
      | Appointment Date                                   | 26-Jul-2014                                  |
      | Appointment Time                                   | 10:00 a.m.                                   |
      | Service Provider                                   | Livelihoods program provider name            |
      | Service Location                                   | Livelihoods program location                 |
      | Notes                                              | Livelihoods program Notes                    |
    And I should see in the 1st "Child Protection Services Subform Section" subform with the follow:
      | Did you refer the client to Child Protection services? | No referral, Service provided by your agency |
      | Appointment Date                                       | 26-Jul-2014                                  |
      | Appointment Time                                       | 10:00 a.m.                                   |
      | Service Provider                                       | Chid Protection provider name                |
      | Service Location                                       | Chid Protection location                     |
      | Notes                                                  | Chid Protection Notes                        |