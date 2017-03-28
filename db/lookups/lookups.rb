def create_or_update_lookup(lookup_hash)
  lookup_id = lookup_hash[:id]
  lookup = Lookup.get lookup_id

  if lookup.nil?
    puts "Creating lookup #{lookup_id}"
    Lookup.create! lookup_hash
  else
    puts "Updating lookup #{lookup_id}"
    lookup.update_attributes lookup_hash
  end
end

create_or_update_lookup(
  :id => "lookup-location-type",
  :name => "Location Type",
  :locked => true,
  :lookup_values => [
    {id: "country", display_text: "Country"}.with_indifferent_access,
    {id: "region", display_text: "Region"}.with_indifferent_access,
    {id: "province", display_text: "Province"}.with_indifferent_access,
    {id: "district", display_text: "District"}.with_indifferent_access,
    {id: "governorate", display_text: "Governorate"}.with_indifferent_access,
    {id: "chiefdom", display_text: "Chiefdom"}.with_indifferent_access,
    {id: "state", display_text: "State"}.with_indifferent_access,
    {id: "city", display_text: "City"}.with_indifferent_access,
    {id: "camp", display_text: "Camp"}.with_indifferent_access,
    {id: "site", display_text: "Site"}.with_indifferent_access,
    {id: "village", display_text: "Village"}.with_indifferent_access,
    {id: "zone", display_text: "Zone"}.with_indifferent_access,
    {id: "sub_district", display_text: "Sub District"}.with_indifferent_access,
    {id: "locality", display_text: "Locality"}.with_indifferent_access,
    {id: "other", display_text: "Other"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-country",
  :name => "Country",
  :lookup_values => [
    {id: "country1", display_text: "Country1"}.with_indifferent_access,
    {id: "country2", display_text: "Country2"}.with_indifferent_access,
    {id: "country3", display_text: "Country3"}.with_indifferent_access,
    {id: "country4", display_text: "Country4"}.with_indifferent_access,
    {id: "country5", display_text: "Country5"}.with_indifferent_access,
    {id: "country6", display_text: "Country6"}.with_indifferent_access,
    {id: "country7", display_text: "Country7"}.with_indifferent_access,
    {id: "country8", display_text: "Country8"}.with_indifferent_access,
    {id: "country9", display_text: "Country9"}.with_indifferent_access,
    {id: "country10", display_text: "Country10"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-nationality",
  :name => "Nationality",
  :lookup_values => [
    {id: "nationality1", display_text: "Nationality1"}.with_indifferent_access,
    {id: "nationality2", display_text: "Nationality2"}.with_indifferent_access,
    {id: "nationality3", display_text: "Nationality3"}.with_indifferent_access,
    {id: "nationality4", display_text: "Nationality4"}.with_indifferent_access,
    {id: "nationality5", display_text: "Nationality5"}.with_indifferent_access,
    {id: "nationality6", display_text: "Nationality6"}.with_indifferent_access,
    {id: "nationality7", display_text: "Nationality7"}.with_indifferent_access,
    {id: "nationality8", display_text: "Nationality8"}.with_indifferent_access,
    {id: "nationality9", display_text: "Nationality9"}.with_indifferent_access,
    {id: "nationality10", display_text: "Nationality10"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-ethnicity",
  :name => "Ethnicity",
  :lookup_values => [
    {id: "ethnicity1", display_text: "Ethnicity1"}.with_indifferent_access,
    {id: "ethnicity2", display_text: "Ethnicity2"}.with_indifferent_access,
    {id: "ethnicity3", display_text: "Ethnicity3"}.with_indifferent_access,
    {id: "ethnicity4", display_text: "Ethnicity4"}.with_indifferent_access,
    {id: "ethnicity5", display_text: "Ethnicity5"}.with_indifferent_access,
    {id: "ethnicity6", display_text: "Ethnicity6"}.with_indifferent_access,
    {id: "ethnicity7", display_text: "Ethnicity7"}.with_indifferent_access,
    {id: "ethnicity8", display_text: "Ethnicity8"}.with_indifferent_access,
    {id: "ethnicity9", display_text: "Ethnicity9"}.with_indifferent_access,
    {id: "ethnicity10", display_text: "Ethnicity10"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-language",
  :name => "Language",
  :lookup_values => [
    {id: "language1", display_text: "Language1"}.with_indifferent_access,
    {id: "language2", display_text: "Language2"}.with_indifferent_access,
    {id: "language3", display_text: "Language3"}.with_indifferent_access,
    {id: "language4", display_text: "Language4"}.with_indifferent_access,
    {id: "language5", display_text: "Language5"}.with_indifferent_access,
    {id: "language6", display_text: "Language6"}.with_indifferent_access,
    {id: "language7", display_text: "Language7"}.with_indifferent_access,
    {id: "language8", display_text: "Language8"}.with_indifferent_access,
    {id: "language9", display_text: "Language9"}.with_indifferent_access,
    {id: "language10", display_text: "Language10"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-religion",
  :name => "Religion",
  :lookup_values => [
    {id: "religion1", display_text: "Religion1"}.with_indifferent_access,
    {id: "religion2", display_text: "Religion2"}.with_indifferent_access,
    {id: "religion3", display_text: "Religion3"}.with_indifferent_access,
    {id: "religion4", display_text: "Religion4"}.with_indifferent_access,
    {id: "religion5", display_text: "Religion5"}.with_indifferent_access,
    {id: "religion6", display_text: "Religion6"}.with_indifferent_access,
    {id: "religion7", display_text: "Religion7"}.with_indifferent_access,
    {id: "religion8", display_text: "Religion8"}.with_indifferent_access,
    {id: "religion9", display_text: "Religion9"}.with_indifferent_access,
    {id: "religion10", display_text: "Religion10"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-case-status",
  :name => "Case Status",
  :lookup_values => [
    {id: "open", display_text: "Open"}.with_indifferent_access,
    {id: "closed", display_text: "Closed"}.with_indifferent_access,
    {id: "transferred", display_text: "Transferred"}.with_indifferent_access,
    {id: "duplicate", display_text: "Duplicate"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-incident-status",
  :name => "Incident Status",
  :lookup_values => [
    {id: "open", display_text: "Open"}.with_indifferent_access,
    {id: "closed", display_text: "Closed"}.with_indifferent_access,
    {id: "duplicate", display_text: "Duplicate"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-displacement-status",
  :name => "Displacement Status",
  :lookup_values => [
    {id: "resident", display_text: "Resident"}.with_indifferent_access,
    {id: "idp", display_text: "IDP"}.with_indifferent_access,
    {id: "refugee", display_text: "Refugee"}.with_indifferent_access,
    {id: "stateless_person", display_text: "Stateless Person"}.with_indifferent_access,
    {id: "returnee", display_text: "Returnee"}.with_indifferent_access,
    {id: "foreign_national", display_text: "Foreign National"}.with_indifferent_access,
    {id: "asylum_seeker", display_text: "Asylum Seeker"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-unaccompanied-separated status",
  :name => "Unaccompanied Separated Status",
  :lookup_values => [
    {id: "no", display_text: "No"}.with_indifferent_access,
    {id: "unaccompanied_minor", display_text: "Unaccompanied Minor"}.with_indifferent_access,
    {id: "separated_child", display_text: "Separated Child"}.with_indifferent_access,
    {id: "other_vulnerable_child", display_text: "Other Vulnerable Child"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-protection-status",
  :name => "Protection Status",
  :lookup_values => [
    {id: "unaccompanied", display_text: "Unaccompanied"}.with_indifferent_access,
    {id: "separated", display_text: "Separated"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-verification-status",
  :name => "Verification Status",
  :lookup_values => [
    {id: "verified", display_text: "Verified"}.with_indifferent_access,
    {id: "unverified", display_text: "Unverified"}.with_indifferent_access,
    {id: "pending_verification", display_text: "Pending Verification"}.with_indifferent_access,
    {id: "falsely_attributed", display_text: "Falsely Attributed"}.with_indifferent_access,
    {id: "rejected", display_text: "Rejected"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-risk-level",
  :name => "risk_level",
  :lookup_values => [
    {id: "high", display_text: "High"}.with_indifferent_access,
    {id: "medium", display_text: "Medium"}.with_indifferent_access,
    {id: "low", display_text: "Low"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-gbv-sexual-violence-type",
  :name => "Gbv Sexual Violence Type",
  :lookup_values => [
    {id: "rape", display_text: "Rape"}.with_indifferent_access,
    {id: "sexual_assault", display_text: "Sexual Assault"}.with_indifferent_access,
    {id: "physical_assault", display_text: "Physical Assault"}.with_indifferent_access,
    {id: "forced_marriage", display_text: "Forced Marriage"}.with_indifferent_access,
    {id: "denial_of_resources_opportunities_or_services", display_text: "Denial of Resources, Opportunities, or Services"}.with_indifferent_access,
    {id: "psychological_emotional_abuse", display_text: "Psychological / Emotional Abuse"}.with_indifferent_access,
    {id: "non-gbv", display_text: "Non-GBV"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-armed-force-group-type",
  :name => "Armed Force Group Type",
  :lookup_values => [
    {id: "national_army", display_text: "National Army"}.with_indifferent_access,
    {id: "security_forces", display_text: "Security Forces"}.with_indifferent_access,
    {id: "international_forces", display_text: "International Forces"}.with_indifferent_access,
    {id: "police_forces", display_text: "Police Forces"}.with_indifferent_access,
    {id: "para-military_forces", display_text: "Para-Military Forces"}.with_indifferent_access,
    {id: "unknown", display_text: "Unknown"}.with_indifferent_access,
    {id: "other", display_text: "Other"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-armed-force-group-name",
  :name => "Armed Force Group Name",
  :lookup_values => [
    {id: "armed_force_or_group_1", display_text: "Armed Force or Group 1"}.with_indifferent_access,
    {id: "armed_force_or_group_2", display_text: "Armed Force or Group 2"}.with_indifferent_access,
    {id: "armed_force_or_group_3", display_text: "Armed Force or Group 3"}.with_indifferent_access,
    {id: "other_please_specify", display_text: "Other, please specify"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id =>"lookup-separation-cause",
  :name => "Separation Cause",
  :lookup_values => [
    {id: "conflict", display_text: "Conflict"}.with_indifferent_access,
    {id: "death", display_text: "Death"}.with_indifferent_access,
    {id: "family_abuse_violence_exploitation", display_text: "Family abuse/violence/exploitation"}.with_indifferent_access,
    {id: "lack_of_access_to_services_support", display_text: "Lack of access to services/support"}.with_indifferent_access,
    {id: "caafag", display_text: "CAAFAG"}.with_indifferent_access,
    {id: "sickness_of_family_member", display_text: "Sickness of family member"}.with_indifferent_access,
    {id: "entrusted_into_the_care_of_an_individual", display_text: "Entrusted into the care of an individual"}.with_indifferent_access,
    {id: "arrest_and_detention", display_text: "Arrest and detention"}.with_indifferent_access,
    {id: "abandonment", display_text: "Abandonment"}.with_indifferent_access,
    {id: "repatriation", display_text: "Repatriation"}.with_indifferent_access,
    {id: "population_movement", display_text: "Population movement"}.with_indifferent_access,
    {id: "migration", display_text: "Migration"}.with_indifferent_access,
    {id: "poverty", display_text: "Poverty"}.with_indifferent_access,
    {id: "natural_disaster", display_text: "Natural disaster"}.with_indifferent_access,
    {id: "divorce_remarriage", display_text: "Divorce/remarriage"}.with_indifferent_access,
    {id: "poverty", display_text: "Poverty"}.with_indifferent_access,
    {id: "other_please_specify", display_text: "Other (please specify)"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-service-type",
  :name => "Service Type",
  :lookup_values => [
    {id: "safehouse_service", display_text: "Safehouse Service"}.with_indifferent_access,
    {id: "health_medical_service", display_text: "Health/Medical Service"}.with_indifferent_access,
    {id: "psychosocial_service", display_text: "Psychosocial Service"}.with_indifferent_access,
    {id: "police_other_service", display_text: "Police/Other Service"}.with_indifferent_access,
    {id: "legal_assistance_service", display_text: "Legal Assistance Service"}.with_indifferent_access,
    {id: "livelihoods_service", display_text: "Livelihoods Service"}.with_indifferent_access,
    {id: "child_protection_service", display_text: "Child Protection Service"}.with_indifferent_access,
    {id: "family_mediation_service", display_text: "Family Mediation Service"}.with_indifferent_access,
    {id: "family_seunification_service", display_text: "Family Reunification Service"}.with_indifferent_access,
    {id: "education_service", display_text: "Education Service"}.with_indifferent_access,
    {id: "nfi_clothes_shoes_service", display_text: "NFI/Clothes/Shoes Service"}.with_indifferent_access,
    {id: "water_sanitation_service", display_text: "Water/Sanitation Service"}.with_indifferent_access,
    {id: "registration_service", display_text: "Registration Service"}.with_indifferent_access,
    {id: "food_service", display_text: "Food Service"}.with_indifferent_access,
    {id: "other_service", display_text: "Other Service"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-protection-concerns",
  :name => "Protection Concerns",
  :lookup_values => [
    {id: "sexually_exploited", display_text: "Sexually Exploited"}.with_indifferent_access,
    {id: "gbv_survivor", display_text: "GBV survivor"}.with_indifferent_access,
    {id: "trafficked_smuggled", display_text: "Trafficked/smuggled"}.with_indifferent_access,
    {id: "statelessness", display_text: "Statelessness"}.with_indifferent_access,
    {id: "arrested_detained", display_text: "Arrested/Detained"}.with_indifferent_access,
    {id: "migrant", display_text: "Migrant"}.with_indifferent_access,
    {id: "disabled", display_text: "Disabled"}.with_indifferent_access,
    {id: "serious_health_issue", display_text: "Serious health issue"}.with_indifferent_access,
    {id: "refugee", display_text: "Refugee"}.with_indifferent_access,
    {id: "caafag", display_text: "CAAFAG"}.with_indifferent_access,
    {id: "street_child", display_text: "Street child"}.with_indifferent_access,
    {id: "child_mother", display_text: "Child Mother"}.with_indifferent_access,
    {id: "physically_or_mentally_abused", display_text: "Physically or Mentally Abused"}.with_indifferent_access,
    {id: "living_with_vulnerable_person", display_text: "Living with vulnerable person"}.with_indifferent_access,
    {id: "worst_forms_of_child_labor", display_text: "Worst Forms of Child Labor"}.with_indifferent_access,
    {id: "child_headed_household", display_text: "Child Headed Household"}.with_indifferent_access,
    {id: "mentally_distressed", display_text: "Mentally Distressed"}.with_indifferent_access,
    {id: "other", display_text: "Other"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :id => "lookup-unhcr-needs-codes",
  :name => "UNHCR Needs Codes",
  :lookup_values => [
    {id: "cr-cp", display_text: "CR-CP"}.with_indifferent_access,
    {id: "cr-cs", display_text: "CR-CS"}.with_indifferent_access,
    {id: "cr-cc", display_text: "CR-CC"}.with_indifferent_access,
    {id: "cr-tp", display_text: "CR-TP"}.with_indifferent_access,
    {id: "cr-lw", display_text: "CR-LW"}.with_indifferent_access,
    {id: "cr-lo", display_text: "CR-LO"}.with_indifferent_access,
    {id: "cr-ne", display_text: "CR-NE"}.with_indifferent_access,
    {id: "cr-se", display_text: "CR-SE"}.with_indifferent_access,
    {id: "cr-af", display_text: "CR-AF"}.with_indifferent_access,
    {id: "cr-cl", display_text: "CR-CL"}.with_indifferent_access,
    {id: "sc-ch", display_text: "SC-CH"}.with_indifferent_access,
    {id: "sc-ic", display_text: "SC-IC"}.with_indifferent_access,
    {id: "sc-fc", display_text: "SC-FC"}.with_indifferent_access,
    {id: "ds-bd", display_text: "DS-BD"}.with_indifferent_access,
    {id: "ds-df", display_text: "DS-DF"}.with_indifferent_access,
    {id: "ds-pm", display_text: "DS-PM"}.with_indifferent_access,
    {id: "ds-ps", display_text: "DS-PS"}.with_indifferent_access,
    {id: "ds-mm", display_text: "DS-MM"}.with_indifferent_access,
    {id: "ds-ms", display_text: "DS-MS"}.with_indifferent_access,
    {id: "ds-sd", display_text: "DS-SD"}.with_indifferent_access,
    {id: "sm-mi", display_text: "SM-MI"}.with_indifferent_access,
    {id: "sm-mn", display_text: "SM-MN"}.with_indifferent_access,
    {id: "sm-ci", display_text: "SM-CI"}.with_indifferent_access,
    {id: "sm-cc", display_text: "SM-CC"}.with_indifferent_access,
    {id: "sm-ot", display_text: "SM-OT"}.with_indifferent_access,
    {id: "fu-tr", display_text: "FU-TR"}.with_indifferent_access,
    {id: "fu-fr", display_text: "FU-FR"}.with_indifferent_access,
    {id: "lp-nd", display_text: "LP-ND"}.with_indifferent_access,
    {id: "tr-pi", display_text: "TR-PI"}.with_indifferent_access,
    {id: "tr-ho", display_text: "TR-HO"}.with_indifferent_access,
    {id: "tr-wv", display_text: "TR-WV"}.with_indifferent_access,
    {id: "sv-va", display_text: "SV-VA"}.with_indifferent_access,
    {id: "lp-an", display_text: "LP-AN"}.with_indifferent_access,
    {id: "lp-md", display_text: "LP-MD"}.with_indifferent_access,
    {id: "lp-ms", display_text: "LP-MS"}.with_indifferent_access,
    {id: "lp-rr", display_text: "LP-RR"}.with_indifferent_access
  ]
)

create_or_update_lookup(
    :id => "lookup-yes-no",
    :name => "Yes or No",
    :lookup_values => [
        {id: "true", display_text: "Yes"}.with_indifferent_access,
        {id: "false", display_text: "No"}.with_indifferent_access
    ]
)

#TODO i18n - cast unknown to nil
create_or_update_lookup(
    :id => "lookup-yes-no-unknown",
    :name => "Yes, No, or Unknown",
    :lookup_values => [
        {id: "true", display_text: "Yes"}.with_indifferent_access,
        {id: "false", display_text: "No"}.with_indifferent_access,
        {id: "default_convert_unknown_id_to_nil", display_text: "Unknown"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :id => "lookup-approval-status",
    :name => "Approval Status",
    :lookup_values => [
        {id: "pending", display_text: "Pending"}.with_indifferent_access,
        {id: "approved", display_text: "Approved"}.with_indifferent_access,
        {id: "rejected", display_text: "Rejected"}.with_indifferent_access
    ]
)

