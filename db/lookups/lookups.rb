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
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo, Republic of the",
    "Congo, Democratic Republic of the",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "St. Kitts and Nevis",
    "St. Lucia",
    "St. Vincent and The Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "UK (United Kingdom)",
    "USA (United States of America)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City (Holy See)",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
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
    "Orphan or Vulnerable Child"
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
    "Denial of Resources, Opportunities or Services",
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
    :name => "service_referred",
    :lookup_values => [
        "Referred",
        "Service provided by your agency",
        "Services already received from another agency",
        "Service not applicable",
        "Referral declined by survivor",
        "Service unavailable"
    ]
)
