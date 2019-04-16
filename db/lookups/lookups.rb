def create_or_update_lookup(lookup_hash)
  lookup_id = lookup_hash[:unique_id]
  lookup = Lookup.find_by(unique_id:lookup_id)

  if lookup.nil?
    puts "Creating lookup #{lookup_id}"
    Lookup.create! lookup_hash
  else
    puts "Updating lookup #{lookup_id}"
    lookup.update_attributes lookup_hash
  end
end

create_or_update_lookup(
  :unique_id => "lookup-location-type",
  :name_en => "Location Type",
  :locked => true,
  :lookup_values_en => [
    {id: "country", display_text: "Country"},
    {id: "region", display_text: "Region"},
    {id: "province", display_text: "Province"},
    {id: "district", display_text: "District"},
    {id: "governorate", display_text: "Governorate"},
    {id: "chiefdom", display_text: "Chiefdom"},
    {id: "state", display_text: "State"},
    {id: "city", display_text: "City"},
    {id: "county", display_text: "County"},
    {id: "camp", display_text: "Camp"},
    {id: "site", display_text: "Site"},
    {id: "village", display_text: "Village"},
    {id: "zone", display_text: "Zone"},
    {id: "sub_district", display_text: "Sub District"},
    {id: "locality", display_text: "Locality"},
    {id: "prefecture", display_text: "Prefecture"},
    {id: "sub-prefecture", display_text: "Sub-Prefecture"},
    {id: "commune", display_text: "Commune"},
    {id: "payam", display_text: "Payam"},
    {id: "other", display_text: "Other"}
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-country",
  :name_en => "Country",
  :lookup_values_en => [
    {id: "afghanistan", display_text: "Afghanistan"}.with_indifferent_access,
    {id: "albania", display_text: "Albania"}.with_indifferent_access,
    {id: "algeria", display_text: "Algeria"}.with_indifferent_access,
    {id: "andorra", display_text: "Andorra"}.with_indifferent_access,
    {id: "angola", display_text: "Angola"}.with_indifferent_access,
    {id: "antigua_and_barbuda", display_text: "Antigua and Barbuda"}.with_indifferent_access,
    {id: "argentina", display_text: "Argentina"}.with_indifferent_access,
    {id: "armenia", display_text: "Armenia"}.with_indifferent_access,
    {id: "australia", display_text: "Australia"}.with_indifferent_access,
    {id: "austria", display_text: "Austria"}.with_indifferent_access,
    {id: "azerbaijan", display_text: "Azerbaijan"}.with_indifferent_access,
    {id: "bahamas", display_text: "Bahamas"}.with_indifferent_access,
    {id: "bahrain", display_text: "Bahrain"}.with_indifferent_access,
    {id: "bangladesh", display_text: "Bangladesh"}.with_indifferent_access,
    {id: "barbados", display_text: "Barbados"}.with_indifferent_access,
    {id: "belarus", display_text: "Belarus"}.with_indifferent_access,
    {id: "belgium", display_text: "Belgium"}.with_indifferent_access,
    {id: "belize", display_text: "Belize"}.with_indifferent_access,
    {id: "benin", display_text: "Benin"}.with_indifferent_access,
    {id: "bhutan", display_text: "Bhutan"}.with_indifferent_access,
    {id: "bolivia", display_text: "Bolivia"}.with_indifferent_access,
    {id: "bosnia_and_herzegovina", display_text: "Bosnia and Herzegovina"}.with_indifferent_access,
    {id: "botswana", display_text: "Botswana"}.with_indifferent_access,
    {id: "brazil", display_text: "Brazil"}.with_indifferent_access,
    {id: "brunei", display_text: "Brunei"}.with_indifferent_access,
    {id: "bulgaria", display_text: "Bulgaria"}.with_indifferent_access,
    {id: "burkina_faso", display_text: "Burkina Faso"}.with_indifferent_access,
    {id: "burundi", display_text: "Burundi"}.with_indifferent_access,
    {id: "cabo_verde", display_text: "Cabo Verde"}.with_indifferent_access,
    {id: "cambodia", display_text: "Cambodia"}.with_indifferent_access,
    {id: "cameroon", display_text: "Cameroon"}.with_indifferent_access,
    {id: "canada", display_text: "Canada"}.with_indifferent_access,
    {id: "central_african_republic", display_text: "Central African Republic"}.with_indifferent_access,
    {id: "chad", display_text: "Chad"}.with_indifferent_access,
    {id: "chile", display_text: "Chile"}.with_indifferent_access,
    {id: "china", display_text: "China"}.with_indifferent_access,
    {id: "colombia", display_text: "Colombia"}.with_indifferent_access,
    {id: "comoros", display_text: "Comoros"}.with_indifferent_access,
    {id: "congo", display_text: "Congo, Republic of the"}.with_indifferent_access,
    {id: "drc", display_text: "Congo, Democratic Republic of the"}.with_indifferent_access,
    {id: "costa_rica", display_text: "Costa Rica"}.with_indifferent_access,
    {id: "cote_divoire", display_text: "Cote d'Ivoire"}.with_indifferent_access,
    {id: "croatia", display_text: "Croatia"}.with_indifferent_access,
    {id: "cuba", display_text: "Cuba"}.with_indifferent_access,
    {id: "cyprus", display_text: "Cyprus"}.with_indifferent_access,
    {id: "czech_republic", display_text: "Czech Republic"}.with_indifferent_access,
    {id: "denmark", display_text: "Denmark"}.with_indifferent_access,
    {id: "djibouti", display_text: "Djibouti"}.with_indifferent_access,
    {id: "dominica", display_text: "Dominica"}.with_indifferent_access,
    {id: "dominican_republic", display_text: "Dominican Republic"}.with_indifferent_access,
    {id: "ecuador", display_text: "Ecuador"}.with_indifferent_access,
    {id: "egypt", display_text: "Egypt"}.with_indifferent_access,
    {id: "el_salvador", display_text: "El Salvador"}.with_indifferent_access,
    {id: "equatorial_guinea", display_text: "Equatorial Guinea"}.with_indifferent_access,
    {id: "eritrea", display_text: "Eritrea"}.with_indifferent_access,
    {id: "estonia", display_text: "Estonia"}.with_indifferent_access,
    {id: "ethiopia", display_text: "Ethiopia"}.with_indifferent_access,
    {id: "fiji", display_text: "Fiji"}.with_indifferent_access,
    {id: "finland", display_text: "Finland"}.with_indifferent_access,
    {id: "france", display_text: "France"}.with_indifferent_access,
    {id: "gabon", display_text: "Gabon"}.with_indifferent_access,
    {id: "gambia", display_text: "Gambia"}.with_indifferent_access,
    {id: "georgia", display_text: "Georgia"}.with_indifferent_access,
    {id: "germany", display_text: "Germany"}.with_indifferent_access,
    {id: "ghana", display_text: "Ghana"}.with_indifferent_access,
    {id: "greece", display_text: "Greece"}.with_indifferent_access,
    {id: "grenada", display_text: "Grenada"}.with_indifferent_access,
    {id: "guatemala", display_text: "Guatemala"}.with_indifferent_access,
    {id: "guinea", display_text: "Guinea"}.with_indifferent_access,
    {id: "guinea_bissau", display_text: "Guinea-Bissau"}.with_indifferent_access,
    {id: "guyana", display_text: "Guyana"}.with_indifferent_access,
    {id: "haiti", display_text: "Haiti"}.with_indifferent_access,
    {id: "honduras", display_text: "Honduras"}.with_indifferent_access,
    {id: "hungary", display_text: "Hungary"}.with_indifferent_access,
    {id: "iceland", display_text: "Iceland"}.with_indifferent_access,
    {id: "india", display_text: "India"}.with_indifferent_access,
    {id: "indonesia", display_text: "Indonesia"}.with_indifferent_access,
    {id: "iran", display_text: "Iran"}.with_indifferent_access,
    {id: "iraq", display_text: "Iraq"}.with_indifferent_access,
    {id: "ireland", display_text: "Ireland"}.with_indifferent_access,
    {id: "israel", display_text: "Israel"}.with_indifferent_access,
    {id: "italy", display_text: "Italy"}.with_indifferent_access,
    {id: "jamaica", display_text: "Jamaica"}.with_indifferent_access,
    {id: "japan", display_text: "Japan"}.with_indifferent_access,
    {id: "jordan", display_text: "Jordan"}.with_indifferent_access,
    {id: "kazakhstan", display_text: "Kazakhstan"}.with_indifferent_access,
    {id: "kenya", display_text: "Kenya"}.with_indifferent_access,
    {id: "kiribati", display_text: "Kiribati"}.with_indifferent_access,
    {id: "kosovo", display_text: "Kosovo"}.with_indifferent_access,
    {id: "kuwait", display_text: "Kuwait"}.with_indifferent_access,
    {id: "kyrgyzstan", display_text: "Kyrgyzstan"}.with_indifferent_access,
    {id: "laos", display_text: "Laos"}.with_indifferent_access,
    {id: "latvia", display_text: "Latvia"}.with_indifferent_access,
    {id: "lebanon", display_text: "Lebanon"}.with_indifferent_access,
    {id: "lesotho", display_text: "Lesotho"}.with_indifferent_access,
    {id: "liberia", display_text: "Liberia"}.with_indifferent_access,
    {id: "libya", display_text: "Libya"}.with_indifferent_access,
    {id: "liechtenstein", display_text: "Liechtenstein"}.with_indifferent_access,
    {id: "lithuania", display_text: "Lithuania"}.with_indifferent_access,
    {id: "luxembourg", display_text: "Luxembourg"}.with_indifferent_access,
    {id: "macedonia", display_text: "Macedonia"}.with_indifferent_access,
    {id: "madagascar", display_text: "Madagascar"}.with_indifferent_access,
    {id: "malawi", display_text: "Malawi"}.with_indifferent_access,
    {id: "malaysia", display_text: "Malaysia"}.with_indifferent_access,
    {id: "maldives", display_text: "Maldives"}.with_indifferent_access,
    {id: "mali", display_text: "Mali"}.with_indifferent_access,
    {id: "malta", display_text: "Malta"}.with_indifferent_access,
    {id: "marshall_islands", display_text: "Marshall Islands"}.with_indifferent_access,
    {id: "mauritania", display_text: "Mauritania"}.with_indifferent_access,
    {id: "mauritius", display_text: "Mauritius"}.with_indifferent_access,
    {id: "mexico", display_text: "Mexico"}.with_indifferent_access,
    {id: "micronesia", display_text: "Micronesia"}.with_indifferent_access,
    {id: "moldova", display_text: "Moldova"}.with_indifferent_access,
    {id: "monaco", display_text: "Monaco"}.with_indifferent_access,
    {id: "mongolia", display_text: "Mongolia"}.with_indifferent_access,
    {id: "montenegro", display_text: "Montenegro"}.with_indifferent_access,
    {id: "morocco", display_text: "Morocco"}.with_indifferent_access,
    {id: "mozambique", display_text: "Mozambique"}.with_indifferent_access,
    {id: "myanmar", display_text: "Myanmar"}.with_indifferent_access,
    {id: "namibia", display_text: "Namibia"}.with_indifferent_access,
    {id: "nauru", display_text: "Nauru"}.with_indifferent_access,
    {id: "nepal", display_text: "Nepal"}.with_indifferent_access,
    {id: "netherlands", display_text: "Netherlands"}.with_indifferent_access,
    {id: "new_zealand", display_text: "New Zealand"}.with_indifferent_access,
    {id: "nicaragua", display_text: "Nicaragua"}.with_indifferent_access,
    {id: "niger", display_text: "Niger"}.with_indifferent_access,
    {id: "nigeria", display_text: "Nigeria"}.with_indifferent_access,
    {id: "north_korea", display_text: "North Korea"}.with_indifferent_access,
    {id: "norway", display_text: "Norway"}.with_indifferent_access,
    {id: "oman", display_text: "Oman"}.with_indifferent_access,
    {id: "pakistan", display_text: "Pakistan"}.with_indifferent_access,
    {id: "palau", display_text: "Palau"}.with_indifferent_access,
    {id: "palestine", display_text: "Palestine"}.with_indifferent_access,
    {id: "panama", display_text: "Panama"}.with_indifferent_access,
    {id: "papua_new_guinea", display_text: "Papua New Guinea"}.with_indifferent_access,
    {id: "paraguay", display_text: "Paraguay"}.with_indifferent_access,
    {id: "peru", display_text: "Peru"}.with_indifferent_access,
    {id: "philippines", display_text: "Philippines"}.with_indifferent_access,
    {id: "poland", display_text: "Poland"}.with_indifferent_access,
    {id: "portugal", display_text: "Portugal"}.with_indifferent_access,
    {id: "qatar", display_text: "Qatar"}.with_indifferent_access,
    {id: "romania", display_text: "Romania"}.with_indifferent_access,
    {id: "russia", display_text: "Russia"}.with_indifferent_access,
    {id: "rwanda", display_text: "Rwanda"}.with_indifferent_access,
    {id: "st_kitts_and_nevis", display_text: "St. Kitts and Nevis"}.with_indifferent_access,
    {id: "st_lucia", display_text: "St. Lucia"}.with_indifferent_access,
    {id: "st_vincent_and_the_grenadines", display_text: "St. Vincent and The Grenadines"}.with_indifferent_access,
    {id: "samoa", display_text: "Samoa"}.with_indifferent_access,
    {id: "san_marino", display_text: "San Marino"}.with_indifferent_access,
    {id: "sao_tome_and_principe", display_text: "Sao Tome and Principe"}.with_indifferent_access,
    {id: "saudi_arabia", display_text: "Saudi Arabia"}.with_indifferent_access,
    {id: "senegal", display_text: "Senegal"}.with_indifferent_access,
    {id: "serbia", display_text: "Serbia"}.with_indifferent_access,
    {id: "seychelles", display_text: "Seychelles"}.with_indifferent_access,
    {id: "sierra_leone", display_text: "Sierra Leone"}.with_indifferent_access,
    {id: "singapore", display_text: "Singapore"}.with_indifferent_access,
    {id: "slovakia", display_text: "Slovakia"}.with_indifferent_access,
    {id: "slovenia", display_text: "Slovenia"}.with_indifferent_access,
    {id: "solomon_islands", display_text: "Solomon Islands"}.with_indifferent_access,
    {id: "somalia", display_text: "Somalia"}.with_indifferent_access,
    {id: "south_africa", display_text: "South Africa"}.with_indifferent_access,
    {id: "south_korea", display_text: "South Korea"}.with_indifferent_access,
    {id: "south_sudan", display_text: "South Sudan"}.with_indifferent_access,
    {id: "spain", display_text: "Spain"}.with_indifferent_access,
    {id: "sri_lanka", display_text: "Sri Lanka"}.with_indifferent_access,
    {id: "sudan", display_text: "Sudan"}.with_indifferent_access,
    {id: "suriname", display_text: "Suriname"}.with_indifferent_access,
    {id: "swaziland", display_text: "Swaziland"}.with_indifferent_access,
    {id: "sweden", display_text: "Sweden"}.with_indifferent_access,
    {id: "switzerland", display_text: "Switzerland"}.with_indifferent_access,
    {id: "syria", display_text: "Syria"}.with_indifferent_access,
    {id: "taiwan", display_text: "Taiwan"}.with_indifferent_access,
    {id: "tajikistan", display_text: "Tajikistan"}.with_indifferent_access,
    {id: "tanzania", display_text: "Tanzania"}.with_indifferent_access,
    {id: "thailand", display_text: "Thailand"}.with_indifferent_access,
    {id: "timor_leste", display_text: "Timor-Leste"}.with_indifferent_access,
    {id: "togo", display_text: "Togo"}.with_indifferent_access,
    {id: "tonga", display_text: "Tonga"}.with_indifferent_access,
    {id: "trinidad_and_tobago", display_text: "Trinidad and Tobago"}.with_indifferent_access,
    {id: "tunisia", display_text: "Tunisia"}.with_indifferent_access,
    {id: "turkey", display_text: "Turkey"}.with_indifferent_access,
    {id: "turkmenistan", display_text: "Turkmenistan"}.with_indifferent_access,
    {id: "tuvalu", display_text: "Tuvalu"}.with_indifferent_access,
    {id: "uganda", display_text: "Uganda"}.with_indifferent_access,
    {id: "ukraine", display_text: "Ukraine"}.with_indifferent_access,
    {id: "united_arab_emirates", display_text: "United Arab Emirates"}.with_indifferent_access,
    {id: "uk", display_text: "UK (United Kingdom)"}.with_indifferent_access,
    {id: "usa", display_text: "USA (United States of America)"}.with_indifferent_access,
    {id: "uruguay", display_text: "Uruguay"}.with_indifferent_access,
    {id: "uzbekistan", display_text: "Uzbekistan"}.with_indifferent_access,
    {id: "vanuatu", display_text: "Vanuatu"}.with_indifferent_access,
    {id: "vatican", display_text: "Vatican City (Holy See)"}.with_indifferent_access,
    {id: "venezuela", display_text: "Venezuela"}.with_indifferent_access,
    {id: "vietnam", display_text: "Vietnam"}.with_indifferent_access,
    {id: "yemen", display_text: "Yemen"}.with_indifferent_access,
    {id: "zambia", display_text: "Zambia"}.with_indifferent_access,
    {id: "zimbabwe", display_text: "Zimbabwe"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-nationality",
  :name_en => "Nationality",
  :lookup_values_en => [
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
  :unique_id => "lookup-ethnicity",
  :name_en => "Ethnicity",
  :lookup_values_en => [
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
  :unique_id => "lookup-language",
  :name_en => "Language",
  :lookup_values_en => [
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
  :unique_id => "lookup-religion",
  :name_en => "Religion",
  :lookup_values_en => [
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
  :unique_id => "lookup-case-status",
  :name_en => "Case Status",
  :lookup_values_en => [
    {id: "open", display_text: "Open"}.with_indifferent_access,
    {id: "closed", display_text: "Closed"}.with_indifferent_access,
    {id: "transferred", display_text: "Transferred"}.with_indifferent_access,
    {id: "duplicate", display_text: "Duplicate"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-conference-case-status",
  :name_en => "Conference Case Status",
  :lookup_values_en => [
    {id: "open", display_text: "The case will remain open"},
    {id: "closed", display_text: "The case will be closed"},
    {id: "transferred", display_text: "The case will be transferred"},
    {id: "other", display_text: "Other"}
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-incident-status",
  :name_en => "Incident Status",
  :lookup_values_en => [
    {id: "open", display_text: "Open"}.with_indifferent_access,
    {id: "closed", display_text: "Closed"}.with_indifferent_access,
    {id: "duplicate", display_text: "Duplicate"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-displacement-status",
  :name_en => "Displacement Status",
  :lookup_values_en => [
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
  :unique_id => "lookup-unaccompanied-separated-status",
  :name_en => "Unaccompanied Separated Status",
  :lookup_values_en => [
    {id: "no", display_text: "No"}.with_indifferent_access,
    {id: "unaccompanied_minor", display_text: "Unaccompanied Minor"}.with_indifferent_access,
    {id: "separated_child", display_text: "Separated Child"}.with_indifferent_access,
    {id: "other_vulnerable_child", display_text: "Orphan or Vulnerable Child"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-protection-status",
  :name_en => "Protection Status",
  :lookup_values_en => [
    {id: "unaccompanied", display_text: "Unaccompanied"}.with_indifferent_access,
    {id: "separated", display_text: "Separated"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-verification-status",
  :name_en => "Verification Status",
  :lookup_values_en => [
    {id: "verified", display_text: "Verified"}.with_indifferent_access,
    {id: "unverified", display_text: "Unverified"}.with_indifferent_access,
    {id: "pending_verification", display_text: "Pending Verification"}.with_indifferent_access,
    {id: "falsely_attributed", display_text: "Falsely Attributed"}.with_indifferent_access,
    {id: "rejected", display_text: "Rejected"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-risk-level",
  :name_en => "risk_level",
  :lookup_values_en => [
    {id: "high", display_text: "High"}.with_indifferent_access,
    {id: "medium", display_text: "Medium"}.with_indifferent_access,
    {id: "low", display_text: "Low"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-gbv-sexual-violence-type",
  :name_en => "Gbv Sexual Violence Type",
  :lookup_values_en => [
    {id: "rape", display_text: "Rape"}.with_indifferent_access,
    {id: "sexual_assault", display_text: "Sexual Assault"}.with_indifferent_access,
    {id: "physical_assault", display_text: "Physical Assault"}.with_indifferent_access,
    {id: "forced_marriage", display_text: "Forced Marriage"}.with_indifferent_access,
    {id: "denial_of_resources_opportunities_or_services", display_text: "Denial of Resources, Opportunities or Services"}.with_indifferent_access,
    {id: "psychological_emotional_abuse", display_text: "Psychological / Emotional Abuse"}.with_indifferent_access,
    {id: "non-gbv", display_text: "Non-GBV"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-cp-violence-type",
  :name_en => "CP Violence Type",
  :lookup_values_en => [
    {id: "rape", display_text: "Rape"}.with_indifferent_access,
    {id: "sexual_assault", display_text: "Sexual Assault"}.with_indifferent_access,
    {id: "physical_assault", display_text: "Physical Assault"}.with_indifferent_access,
    {id: "forced_marriage", display_text: "Forced Marriage"}.with_indifferent_access,
    {id: "denial_of_resources_opportunities_or_services", display_text: "Denial of Resources, Opportunities or Services"}.with_indifferent_access,
    {id: "psychological_emotional_abuse", display_text: "Psychological / Emotional Abuse"}.with_indifferent_access,
    {id: "non-gbv", display_text: "Non-GBV"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-armed-force-group-type",
  :name_en => "Armed Force Group Type",
  :lookup_values_en => [
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
  :unique_id => "lookup-armed-force-group-name",
  :name_en => "Armed Force Group Name",
  :lookup_values_en => [
    {id: "armed_force_or_group_1", display_text: "Armed Force or Group 1"}.with_indifferent_access,
    {id: "armed_force_or_group_2", display_text: "Armed Force or Group 2"}.with_indifferent_access,
    {id: "armed_force_or_group_3", display_text: "Armed Force or Group 3"}.with_indifferent_access,
    {id: "other_please_specify", display_text: "Other, please specify"}.with_indifferent_access
  ]
)

create_or_update_lookup(
  :unique_id =>"lookup-separation-cause",
  :name_en => "Separation Cause",
  :lookup_values_en => [
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
  :unique_id => "lookup-service-type",
  :name_en => "Service Type",
  :lookup_values_en => [
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
  :unique_id => "lookup-followup-type",
  :name_en => "Followup Type",
  :lookup_values_en => [
     {id: 'after_reunification', display_text: "Follow up After Reunification"},
     {id: 'in_care', display_text: "Follow up in Care"},
     {id: 'for_service', display_text: "Follow up for Service"},
     {id: 'for_assesment', display_text: "Follow up for Assessment"}
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-protection-concerns",
  :name_en => "Protection Concerns",
  :lookup_values_en => [
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
  :unique_id => "lookup-unhcr-needs-codes",
  :name_en => "UNHCR Needs Codes",
  :lookup_values_en => [
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
    :unique_id => "lookup-yes-no",
    :name_en => "Yes or No",
    :locked => true,
    :lookup_values_en => [
        {id: "true", display_text: "Yes"}.with_indifferent_access,
        {id: "false", display_text: "No"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-yes-no-unknown",
    :name_en => "Yes, No, or Unknown",
    :lookup_values_en => [
        {id: "true", display_text: "Yes"}.with_indifferent_access,
        {id: "false", display_text: "No"}.with_indifferent_access,
        {id: "unknown", display_text: "Unknown"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-yes-no-undecided",
    :name_en => "Yes, No, or Undecided",
    :lookup_values_en => [
        {id: "true", display_text: "Yes"}.with_indifferent_access,
        {id: "false", display_text: "No"}.with_indifferent_access,
        {id: "undecided", display_text: "Undecided"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-yes-no-not-applicable",
    :name_en => "Yes, No, or Not Applicable",
    :lookup_values_en => [
        {id: "true", display_text: "Yes"},
        {id: "false", display_text: "No"},
        {id: "not_applicable", display_text: "Not Applicable"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-gbv-reported-elsewhere",
    :name_en => "Yes, No, or Unknown",
    :lookup_values_en => [
        {id: "no", display_text: "No"}.with_indifferent_access,
        {id: "gbvims-org", display_text: "Yes-GBVIMS Org / Agency"}.with_indifferent_access,
        {id: "non-gbvims-org", display_text: "Yes-Non GBVIMS Org / Agency"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-approval-type",
    :name_en => "Approval Type",
    :locked => true,
    :lookup_values => [
        {id: "case_plan", display_text: "Case Plan"},
        {id: "action_plan", display_text: "Action Plan"},
        {id: "service_provision", display_text: "Service Provision"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-gbv-approval-types",
    :name_en => "Approval Type for GBV users",
    :locked => true,
    :lookup_values => [
        {id: "case_plan", display_text: "Case Plan"},
        {id: "closure", display_text: "Closure"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-approval-status",
    :name_en => "Approval Status",
    :lookup_values_en => [
        {id: "requested", display_text: "Requested"}.with_indifferent_access,
        {id: "pending", display_text: "Pending"}.with_indifferent_access,
        {id: "approved", display_text: "Approved"}.with_indifferent_access,
        {id: "rejected", display_text: "Rejected"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-gender",
    :name_en => "gender",
    :lookup_values_en => [
        {id: "male", display_text: "Male"}.with_indifferent_access,
        {id: "female", display_text: "Female"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-inquiry-status",
    :name_en => "Inquiry Status",
    :lookup_values_en => [
        {id: "open", display_text: "Open"}.with_indifferent_access,
        {id: "closed", display_text: "Closed"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-service-referred",
    :name_en => "Service Referred",
    :lookup_values_en => [
        {id: "referred", display_text: "Referred"}.with_indifferent_access,
        {id: "service_provided_by_your_agency", display_text: "Service provided by your agency"}.with_indifferent_access,
        {id: "services_already_received_from_another_agency", display_text: "Services already received from another agency"}.with_indifferent_access,
        {id: "service_not_applicable", display_text: "Service not applicable"}.with_indifferent_access,
        {id: "referral_declined_by_survivor", display_text: "Referral declined by survivor"}.with_indifferent_access,
        {id: "service_unavailable", display_text: "Service unavailable"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-workflow",
    :name_en => "Workflow",
    :locked => true,
    :lookup_values_en => [
        {id: "new", display_text: "New case"}.with_indifferent_access,
        {id: "closed", display_text: "Case closed"}.with_indifferent_access,
        {id: "reopened", display_text: "Case reopened"}.with_indifferent_access,
        {id: "service_provision", display_text: "Service provision"}.with_indifferent_access,
        {id: "services_implemented", display_text: "All response services implemented"}.with_indifferent_access,
        {id: "case_plan", display_text: "Case Plan"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-service-implemented",
    :name_en => "Service Implemented",
    :locked => true,
    :lookup_values_en => [
        {id: "not-implemented", display_text: "Not Implemented"},
        {id: "implemented", display_text: "Implemented"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-service-response-type",
    :name_en => "Service Response Type",
    :locked => true,
    :lookup_values_en => [
        {id: "care_plan", display_text: "Care plan"}.with_indifferent_access,
        {id: "action_plan", display_text: "Action plan"}.with_indifferent_access,
        {id: "service_provision", display_text: "Service provision"}.with_indifferent_access
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-marital-status",
    :name_en => "Marital Status",
    :lookup_values_en => [
      {id: "single", display_text: "Single"},
      {id: "married_cohabitating", display_text: "Married/Cohabitating"},
      {id: "divorced_separated", display_text: "Divorced/Separated"},
      {id: "widowed", display_text: "Widowed"}
    ]
)

create_or_update_lookup(
  :unique_id => "lookup-marital-status-with-spouse",
  :name_en => "Marital Status",
  :lookup_values_en => [
    {id: "single", display_text: "Single"},
    {id: "married_cohabitating", display_text: "Married/Cohabitating"},
    {id: "divorced_separated", display_text: "Divorced/Separated"},
    {id: "widowed", display_text: "Widowed"},
    {id: "with_spouse", display_text: "With Partner/Spouse"}
  ]
)

create_or_update_lookup(
  :unique_id => "lookup-marital-status-unknown",
  :name_en => "Marital Status",
  :lookup_values_en => [
    {id: "single", display_text: "Single"},
    {id: "married_cohabitating", display_text: "Married/Cohabitating"},
    {id: "divorced_separated", display_text: "Divorced/Separated"},
    {id: "unknown_not_applicable", display_text: "Unknown/Not Applicable"}
  ]
)

create_or_update_lookup(
    :unique_id => "lookup-perpetrator-relationship",
    :name_en => "Perpetrator Relationship",
    :lookup_values_en => [
        {id: "intimate_partner_former_partner", display_text: "Intimate Partner / Former Partner"},
        {id: "primary_caregiver", display_text: "Primary Caregiver"},
        {id: "family_other_than_spouse_or_caregiver", display_text: "Family other than spouse or caregiver"},
        {id: "supervisor_employer", display_text: "Supervisor / Employer"},
        {id: "schoolmate", display_text: "Schoolmate"},
        {id: "teacher_school_official", display_text: "Teacher / School Official"},
        {id: "service_provider", display_text: "Service Provider"},
        {id: "cotenant_housemate", display_text: "Cotenant / Housemate"},
        {id: "family_friend_neighbor", display_text: "Family Friend/Neighbor"},
        {id: "other_refugee_idp_returnee", display_text: "Other refugee / IDP / Returnee"},
        {id: "other_resident_community_member", display_text: "Other resident community member"},
        {id: "other", display_text: "Other"},
        {id: "no_relation", display_text: "No relation"},
        {id: "unknown", display_text: "Unknown"}
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-time-of-day",
    :name_en => "Time of Day",
    :lookup_values_en => [
        {id: "morning", display_text: "Morning"},
        {id: "noon", display_text: "Noon"},
        {id: "evening", display_text: "Evening"},
        {id: "night", display_text: "Night"}
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-incident-location",
    :name_en => "Incident Location",
    :lookup_values_en => [
        {id: "home", display_text: "Home"},
        {id: "street", display_text: "Street"},
        {id: "school", display_text: "School"},
        {id: "work_place", display_text: "Work Place"},
        {id: "other", display_text: "Other"}
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-incident-identification",
    :name_en => "Incident Identification",
    :lookup_values_en => [
        {id: "disclosure_complaint_by_the_abused_person_or_family_member", display_text: "Disclosure / complaint by the abused person or family member"},
        {id: "discovered_by_service_provider", display_text: "Discovered by service provider"},
        {id: "report_by_the_institution_providing_the_service_discovery", display_text: "Report by the institution providing the service (discovery)"},
        {id: "other", display_text: "Other"}
    ]
)

create_or_update_lookup(
    :unique_id => "lookup-disability-type",
    :name_en => "Disability Type",
    :lookup_values_en => [
        {id: "mental_disability", display_text: "Mental Disability"},
        {id: "physical_disability", display_text: "Physical Disability"},
        {id: "both", display_text: "Both"}
    ]
)

create_or_update_lookup(
  :unique_id => "lookup-disability-type-with-no",
  :name_en => "Disability Type",
  :lookup_values_en => [
    {id: "no", display_text: "No"},
    {id: "mental_disability", display_text: "Mental Disability"},
    {id: "physical_disability", display_text: "Physical Disability"},
    {id: "both", display_text: "Both"}
  ]
)

create_or_update_lookup(
    :unique_id => "lookup-transition-type",
    :name_en => "Transition Type",
    :lookup_values_en => [
        {id: "referral", display_text: "Referral"},
        {id: "reassign", display_text: "Reassign"},
        {id: "transfer", display_text: "Transfer"},
        {id: "transfer_request", display_text: "Transfer Request"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-assessment-duration",
    :name_en => "Assessment Duration",
    :lookup_values_en => [
        { id: 'less_than_15_minutes', display_text: "Less than 15 minutes" },
        { id: '16_30_minutes', display_text: "16-30 minutes" },
        { id: '31_minutes_1_hour', display_text: "31 minutes - 1 hour" },
        { id: '1_2_hours', display_text: "1-2 hours" },
        { id: 'more_than_2_hours', display_text: "More than 2 hours" }
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-child-minor-age-group",
    :name_en => "Child / Minor Age Group",
    :lookup_values_en => [
        {id: "0_5_year_old", display_text: "0-5 year-old"},
        {id: "6_12_year_old", display_text: "6-12 year-old"},
        {id: "13_17_year_old", display_text: "13-17 year-old"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-age-group-type",
  :name_en => "Age Group Type",
  :lookup_values_en => [
    {id: "adult", display_text: "Adult"},
    {id: "minor", display_text: "Minor"},
    {id: "unknown", display_text: "Unknown"}
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-discovery-method",
    :name_en => "Discovery Method",
    :lookup_values_en => [
        {id: "family_or_friend", display_text: "Family or friend"},
        {id: "referral", display_text: "Referral from another organization"},
        {id: "neighbor", display_text: "Neighbor or community member"},
        {id: "community_discussion", display_text: "Community discussion"},
        {id: "pamphlet", display_text: "Flyer or pamphlet you saw or received"},
        {id: "other", display_text: "Other"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
    :unique_id => "lookup-assessment-progress",
    :name_en => "Assessment Progress",
    :lookup_values_en => [
      {id: "n_a", display_text: "N/A"},
      {id: "in_progress", display_text: "In progress"},
      {id: "met", display_text: "Met"}
    ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-further-action_needed",
  :name_en => "Further Action Needed",
  :lookup_values_en => [
    { id: 'no_further_action_needed', display_text: "No Further Action Needed" },
    { id: 'ongoing_monitoring', display_text: "Ongoing Monitoring" },
    { id: 'urgent_intervention', display_text: "Urgent Intervention" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-family-relationship",
  :name_en => "Family Relationship",
  :lookup_values_en => [
    { id: 'mother', display_text: "Mother" },
    { id: 'father', display_text: "Father" },
    { id: 'aunt', display_text: "Aunt" },
    { id: 'uncle', display_text: "Uncle" },
    { id: 'grandmother', display_text: "Grandmother" },
    { id: 'grandfather', display_text: "Grandfather" },
    { id: 'brother', display_text: "Brother" },
    { id: 'sister', display_text: "Sister" },
    { id: 'husband', display_text: "Husband" },
    { id: 'wife', display_text: "Wife" },
    { id: 'partner', display_text: "Partner" },
    { id: 'other_family', display_text: "Other Family" },
    { id: 'other_nonfamily', display_text: "Other Nonfamily" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-tracing-status",
  :name_en => "Tracing Status",
  :lookup_values_en => [
    { id: 'open', display_text: "Open" },
    { id: 'tracing_in_progress', display_text: "Tracing in Progress" },
    { id: 'verified', display_text: "Verified" },
    { id: 'reunified', display_text: "Reunified" },
    { id: 'closed', display_text: "Closed" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-form-group-cp-case",
  :name_en => "Form Groups - CP Case",
  :lookup_values_en => [
    { id: 'record_information', display_text: "Record Information" },
    { id: 'approvals', display_text: "Approvals" },
    { id: 'case_conference_details', display_text: "Case Conference Details" },
    { id: 'identification_registration', display_text: "Identification / Registration" },
    { id: 'data_confidentiality', display_text: "Data Confidentiality" },
    { id: 'assessment', display_text: "Assessment" },
    { id: 'family_partner_details', display_text: "Family / Partner Details" },
    { id: 'case_plan', display_text: "Case Plan" },
    { id: 'services_follow_up', display_text: "Services / Follow Up" },
    { id: 'closure', display_text: "Closure" },
    { id: 'tracing', display_text: "Tracing" },
    { id: 'bia_form', display_text: "BIA Form" },
    { id: 'photos_audio', display_text: "Photos and Audio" },
    { id: 'other_documents', display_text: "Other Documents" },
    { id: 'referrals_transfers', display_text: "Referrals and Transfers" },
    { id: 'notes', display_text: "Notes" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-form-group-cp-tracing-request",
  :name_en => "Form Groups - CP Tracing Request",
  :lookup_values_en => [
    { id: 'record_owner', display_text: "Record Owner" },
    { id: 'inquirer', display_text: "Inquirer" },
    { id: 'tracing_request', display_text: "Tracing Request" },
    { id: 'photos_audio', display_text: "Photos and Audio" },
    { id: 'other_reportable_fields', display_text: "Other Reportable Fields" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-form-group-cp-incident",
  :name_en => "Form Groups - CP Incident",
  :lookup_values_en => [
    { id: 'record_owner', display_text: "Record Owner" },
    { id: 'perpetrator_details', display_text: "Perpetrator Details" },
    { id: 'cp_incident', display_text: "CP Incident" },
    { id: 'cp_individual_details', display_text: "CP Individual Details" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-form-group-gbv-case",
  :name_en => "Form Groups - GBV Case",
  :lookup_values_en => [
    { id: 'record_information', display_text: "Record Information" },
    { id: 'consent_for_services', display_text: "Consent For Services" },
    { id: 'documents', display_text: "Documents" },
    { id: 'consent_for_referrals', display_text: "Consent For Referrals" },
    { id: 'safety_plan', display_text: "Safety Plan" },
    { id: 'action_plan', display_text: "Action Plan" },
    { id: 'survivor_assessment', display_text: "Survivor Assessment" },
    { id: 'case_closure', display_text: "Case Closure" },
    { id: 'client_feedback', display_text: "Client Feedback" },
    { id: 'identification_registration', display_text: "Identification / Registration" },
    { id: 'referrals_transfers', display_text: "Referrals and Transfers" },
    { id: 'other_reportable_fields', display_text: "Other Reportable Fields" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-form-group-gbv-incident",
  :name_en => "Form Groups - GBV Incident",
  :lookup_values_en => [
    { id: 'gbv_individual_details', display_text: "GBV Individual Details" },
    { id: 'incident', display_text: "Incident" },
    { id: 'type_of_violence', display_text: "Type of Violence" },
    { id: 'record_owner', display_text: "Record Owner" },
    { id: 'alleged_perpetrator', display_text: "Alleged Perpetrator" },
    { id: 'service_referral', display_text: "Service Referral" },
    { id: 'other_reportable_fields', display_text: "Other Reportable Fields" }
  ].map(&:with_indifferent_access)
)

create_or_update_lookup(
  :unique_id => "lookup-agency-office",
  :name => "Agency Office",
  :locked => true,
  :lookup_values => [
    {id: "agency_office_1", display_text: "Agency Office 1"},
    {id: "agency_office_2", display_text: "Agency Office 2"},
    {id: "agency_office_3", display_text: "Agency Office 3"},
    {id: "agency_office_4", display_text: "Agency Office 4"},
    {id: "agency_office_5", display_text: "Agency Office 5"}
  ].map(&:with_indifferent_access)
)