def create_or_update_lookup(lookup_hash)
  lookup_id = Lookup.lookup_id_from_name lookup_hash[:name]
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
  :name => "country",
  :lookup_values => [
    "Country1",
    "Country2",
    "Country3",
    "Country4",
    "Country5",
    "Country6",
    "Country7",
    "Country8",
    "Country9",
    "Country10"
  ]
)

create_or_update_lookup(
  :name => "nationality",
  :lookup_values => [
    "Nationality1",
    "Nationality2",
    "Nationality3",
    "Nationality4",
    "Nationality5",
    "Nationality6",
    "Nationality7",
    "Nationality8",
    "Nationality9",
    "Nationality10"
  ]
)

create_or_update_lookup(
  :name => "ethnicity",
  :lookup_values => [
    "Ethnicity1",
    "Ethnicity2",
    "Ethnicity3",
    "Ethnicity4",
    "Ethnicity5",
    "Ethnicity6",
    "Ethnicity7",
    "Ethnicity8",
    "Ethnicity9",
    "Ethnicity10"
  ]
)

create_or_update_lookup(
  :name => "language",
  :lookup_values => [
    "Language1",
    "Language2",
    "Language3",
    "Language4",
    "Language5",
    "Language6",
    "Language7",
    "Language8",
    "Language9",
    "Language10"
  ]
)

create_or_update_lookup(
  :name => "religion",
  :lookup_values => [
    "Religion1",
    "Religion2",
    "Religion3",
    "Religion4",
    "Religion5",
    "Religion6",
    "Religion7",
    "Religion8",
    "Religion9",
    "Religion10"
  ]
)

create_or_update_lookup(
  :name => "case_status",
  :lookup_values => [
    "Open",
    "Closed",
    "Transferred",
    "Duplicate"
  ]
)

create_or_update_lookup(
  :name => "incident_status",
  :lookup_values => [
    "Open",
    "Closed",
    "Duplicate"
  ]
)

create_or_update_lookup(
  :name => "displacement_status",
  :lookup_values => [
    "Resident",
    "IDP",
    "Refugee",
    "Stateless Person",
    "Returnee",
    "Foreign National",
    "Asylum Seeker"
  ]
)

create_or_update_lookup(
  :name => "unaccompanied_separated_status",
  :lookup_values => [
    "No",
    "Unaccompanied Minor",
    "Separated Child",
    "Other Vulnerable Child"
  ]
)

create_or_update_lookup(
  :name => "protection_status",
  :lookup_values => [
    "Unaccompanied",
    "Separated"
  ]
)

create_or_update_lookup(
  :name => "verification_status",
  :lookup_values => [
    "Verified",
    "Unverified",
    "Pending Verification",
    "Falsely Attributed",
    "Rejected"
  ]
)

create_or_update_lookup(
  :name => "risk_level",
  :lookup_values => [
    "High",
    "Medium",
    "Low"
  ]
)

create_or_update_lookup(
  :name => "gbv_sexual_violence_type",
  :lookup_values => [
    "Rape",
    "Sexual Assault",
    "Physical Assault",
    "Forced Marriage",
    "Denial of Resources, Opportunities, or Services",
    "Psychological / Emotional Abuse",
    "Non-GBV"
  ]
)

create_or_update_lookup(
  :name => "armed_force_group_type",
  :lookup_values => [
    "National Army",
    "Security Forces",
    "International Forces",
    "Police Forces",
    "Para-Military Forces",
    "Unknown",
    "Other"
  ]
)

create_or_update_lookup(
  :name => "armed_force_group_name",
  :lookup_values => [
    "Armed Force or Group 1",
    "Armed Force or Group 2",
    "Armed Force or Group 3",
    "Other, please specify"
  ]
)

create_or_update_lookup(
  :name => "separation_cause",
  :lookup_values => [
    "Conflict",
    "Death",
    "Family abuse/violence/exploitation",
    "Lack of access to services/support",
    "CAAFAG",
    "Sickness of family member",
    "Entrusted into the care of an individual",
    "Arrest and detention",
    "Abandonment",
    "Repatriation",
    "Population movement",
    "Migration",
    "Poverty",
    "Natural disaster",
    "Divorce/remarriage",
    "Other (please specify)"
  ]
)

create_or_update_lookup(
  :name => "service_type",
  :lookup_values => [
    "Safehouse Service",
    "Health/Medical Service",
    "Psychosocial Service",
    "Police/Other Service",
    "Legal Assistance Service",
    "Livelihoods Service",
    "Child Protection Service",
    "Family Mediation Service",
    "Family Reunification Service",
    "Education Service",
    "NFI/Clothes/Shoes Service",
    "Water/Sanitation Service",
    "Registration Service",
    "Food Service",
    "Other Service"
  ]
)

create_or_update_lookup(
    :name => "protection_concerns",
    :lookup_values => [
        "Sexually Exploited",
        "GBV survivor",
        "Trafficked/smuggled",
        "Statelessness",
        "Arrested/Detained",
        "Migrant",
        "Disabled",
        "Serious health issue",
        "Refugee",
        "CAAFAG",
        "Street child",
        "Child Mother",
        "Physically or Mentally Abused",
        "Living with vulnerable person",
        "Worst Forms of Child Labor",
        "Child Headed Household",
        "Mentally Distressed",
        "Other"
    ]
)

create_or_update_lookup(
    :name => "unhcr_needs_codes",
    :lookup_values => [
        "CR-CP: Child parent",
        "CR-CS: Child spouse",
        "CR-CC: Child carer",
        "CR-TP: Teenage pregnancy",
        "CR-LW: Child engaged in worst forms of child labour",
        "CR-LO: Child engaged in other forms of child labour",
        "CR-NE: Child at risk of not attending school",
        "CR-SE: Child with special education needs",
        "CR-AF: Child associated with armed forces or groups",
        "CR-CL: Child in conflict with the law",
        "SC-CH: Child headed household",
        "SC-IC: Child in institutional care",
        "SC-FC: Child in foster care",
        "DS-BD: Visual impairment (including blindness)",
        "DS-DF: Hearing Impairment (including deafness)",
        "DS-PM: Physical disability",
        "DS-PS: Physical disability - severe",
        "DS-MM: Mental disability",
        "DS-MS: Mental disability - severe",
        "DS-SD: Speech impairment/disability",
        "SM-MI: Mental illness",
        "SM-MN: Malnutrition",
        "SM-CI: Chronic illness",
        "SM-CC: Critical medical",
        "SM-OT: Other medical condition",
        "FU-TR: Tracing required",
        "FU-FR: Family reunification required",
        "LP-ND: No legal documentation",
        "TR-PI: Psych. and/or physical impairment due to torture",
        "TR-HO: Forced to egregious acts",
        "TR-WV: Witness of violence to other",
        "SV-VA: SGBV",
        "LP-AN: Violence, abuse or neglect",
        "LP-MD: Multiple displacements",
        "LP-MS: Marginalized from society or community",
        "LP-RR: At risk of refoulement"
    ]
)