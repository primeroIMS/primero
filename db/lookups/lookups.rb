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
    "Nationality10",
    "Unknown"
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
    "Ethnicity10",
    "Unknown"
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
    "Religion10",
    "Unknown"
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
    "Report pending verification",
    "Not MRM",
    "Verification found that incident did not occur"
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

#TODO See if this can be deleted
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
    :name => "armed_force_name",
    :lookup_values => [
        "Armed Force 1",
        "Armed Force 2",
        "Armed Force 3",
        "Unknown"
    ]
)

create_or_update_lookup(
    :name => "armed_group_name",
    :lookup_values => [
        "Armed Group 1",
        "Armed Group 2",
        "Armed Group 3",
        "Unknown"
    ]
)

create_or_update_lookup(
    :name => "other_party_name",
    :lookup_values => [
        "Other Party 1",
        "Other Party 2",
        "Other Party 3",
        "Unknown"
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
            "CR-CP",
            "CR-CS",
            "CR-CC",
            "CR-TP",
            "CR-LW",
            "CR-LO",
            "CR-NE",
            "CR-SE",
            "CR-AF",
            "CR-CL",
            "SC-CH",
            "SC-IC",
            "SC-FC",
            "DS-BD",
            "DS-DF",
            "DS-PM",
            "DS-PS",
            "DS-MM",
            "DS-MS",
            "DS-SD",
            "SM-MI",
            "SM-MN",
            "SM-CI",
            "SM-CC",
            "SM-OT",
            "FU-TR",
            "FU-FR",
            "LP-ND",
            "TR-PI",
            "TR-HO",
            "TR-WV",
            "SV-VA",
            "LP-AN",
            "LP-MD",
            "LP-MS",
            "LP-RR"
    ]
)

create_or_update_lookup(
    :name => "weapon_type",
    :lookup_values => [
      "Aerial bomb",
      "Barrel bomb",
      "Baton",
      "Beheading",
      "Burned alive",
      "Booby trap",
      "Biological weapons",
      "Chemical weapons",
      "Dirty/atomic weapons (e.g. depleted uranium ammunition)",
      "Hanging",
      "Explosive remnant of war – ERW (includes unexploded ordnance and abandoned ordnance)",
      "Improvised Explosive Device (IED) – Command-wire operated",
      "Improvised Explosive Device (IED) – Flying IED",
      "Improvised Explosive Device (IED) - Person-borne IED",
      "Improvised Explosive Device (IED) - Remote-controlled IED",
      "Improvised Explosive Device (IED) - Timer-operated IED",
      "Improvised Explosive Device (IED) - Vehicle-borne IED",
      "Improvised Explosive Device (IED) - Grenade",
      "Landmine (includes anti-personnel and anti-vehicle landmine, both factory-made and improvised, and pressure-plate IEDs)",
      "Light weapons (designed to be used by several persons, i.e. heavy machine guns, air defence weapons, etc.)",
      "Missile",
      "Mortar/Rocket",
      "Sharp weapon",
      "Small arm (e.g. AK-47)",
      "Submunition (e.g. cluster munitions)",
      "Stoning",
      "Tear gas",
      "Unmaned aerial vehicle",
      "Water cannons",
      "Other weapon",
      "Unknown"
    ]
)

create_or_update_lookup(
    :name => "attack_type",
    :lookup_values => [
      "Aerial attack",
      "Arson",
      "Land-based attack",
      "Sea-based attack",
      "Shooting (e.g. sniper)",
      "Suicide attack",
      "Other"
    ]
)

create_or_update_lookup(
    :name => "violation_type",
    :lookup_values => [
      "Killing",
      "Maiming",
      "Recruitment and/or use",
      "Rape and/or other grave sexual violence",
      "Abduction",
      "Attacks on schools and/or hospitals",
      "Military use of schools and/or hospitals",
      "Denial of humanitarian access for children"
    ]
)

create_or_update_lookup(
    :name => "vulnerability_type",
    :lookup_values => [
        "Abducted",
        "Asylum seeker",
        "Detained",
        "Disabled",
        "Internally Displaced",
        "Unaccompanied",
        "Recruited",
        "Refugee",
        "Returnee",
        "Separated",
        "Stateless",
        "Unknown"
    ]
)

create_or_update_lookup(
    :name => "school_type",
    :lookup_values => [
      "Early childhood/pre-primary",
      "Primary",
      "Secondary",
      "Vocational",
      "Religious",
      "Secular",
      "Formal",
      "Informal",
      "Other"
    ]
)

create_or_update_lookup(
    :name => "school_age_level",
    :lookup_values => [
      "0 - 5",
      "6 - 10",
      "11 - 13",
      "14 - 18"
    ]
)

create_or_update_lookup(
    :name => "school_sex_type",
    :lookup_values => [
      "Male school",
      "Female school",
      "Mixed school",
      "Unknown"
    ]
)

create_or_update_lookup(
    :name => "healthcare_facility_type",
    :lookup_values => [
      "Hospital",
      "Health centre",
      "Dispensary",
      "Mobile health unit",
      "Ambulance",
      "Other"
    ]
)

create_or_update_lookup(
    :name => "facility_impact_type",
    :lookup_values => [
      "Total destruction",
      "Serious damage",
      "Minor damage",
      "None"
    ]
)

create_or_update_lookup(
    :name => "ctfmr_followup_partner",
    :lookup_values => [
      "Partner 1",
      "Partner 2",
      "Partner 3",
      "Other"
    ]
)

create_or_update_lookup(
    :name => "ctfmr_member_or_partner",
    :lookup_values => [
      "Partner 1",
      "Partner 2",
      "Partner 3",
      "Other"
    ]
)

create_or_update_lookup(
    :name => "ill_treatment_violations",
    :lookup_values => [
      "Blindfolded",
      "Denial of access to toilets",
      "Denial of adequate food and water",
      "Detained outside national territory/ in foreign country",
      "Hand ties",
      "Leg ties",
      "Night Arrest",
      "No lawyer/parent present",
      "Not informed of rights",
      "Physical Violence",
      "Signed Paper/Confession in foreign language",
      "Solitary confinement",
      "Strip searched",
      "Threats to family",
      "Threats to self (non-sexual)",
      "Transferred on Vehicle Floor",
      "Verbal abuse",
      "Attempt to recruit as informant",
      "Position abuse, Attempt to sexual abuse"
    ]
)