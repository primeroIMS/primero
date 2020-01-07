module MrmHelper
  def violation_filters
    {
      killing: [
        {
          name: 'killing_context_km',
          options: [
            "Military clashes",
            "ERW",
            "Political violence",
            "Arrest/search operations",
            "Single murder",
            "Result of torture",
            "Cruel or inhumane treatment"
          ],
          multi: true
        },
        { name: 'killing_attack_type', options: 'Attack Type', multi: true },
        { name: 'killing_weapon_type', options: 'Weapon Type', multi: true },
        { name: 'killing_victim_targeted', options: 'Yes No Unknown' },
        { name: 'killing_victim_a_participant', options: 'Yes No Unknown' },
        { name: 'killing_crossborder', options: 'Yes No Unknown' }
      ],
      maiming: [
        {
          name: 'maiming_context_km',
          options: [
            "Military clashes",
            "ERW",
            "Political violence",
            "Arrest/search operations",
            "Result of torture, cruel or inhumane treatment"
          ]
        },
        { name: 'maiming_attack_type', options: 'Attack Type', multi: true },
        { name: 'maiming_weapon_type', options: 'Weapon Type', multi: true },
        { name: 'maiming_victim_targeted', options: 'Yes No Unknown' },
        { name: 'maiming_victim_a_participant', options: 'Yes No Unknown' },
        { name: 'maiming_crossborder', options: 'Yes No Unknown' }
      ],
      recruitment: [
        { name: 'recruitment_re_recruitment', options: 'Yes No Unknown' },
        { name: 'recruitment_child_role', options: ["Combatant", "Non-combatant", "Unknown"] },
        { name: 'recruitment_crossborder', options: 'Yes No Unknown' }
      ],
      sexual_violence: [
        {
          name: 'sexual_violence_type',
          options: ["Rape", "Gang rape", "Sexual assault", "Sexual slavery and/or trafficking",
          "Enforced prostitution", "Enforced sterilization",
          "Forced pregnancy", "Forced abortion",
          "Forced marriage", "Sexual mutilation"],
          multi: true
        },
        { name: 'sexual_violence_crossborder', options: 'Yes No Unknown' }
      ],
      abduction: [
        {
          name: 'abduction_purpose',
          options: ["Extortion", "Forced marriage", "Indoctrination", "Intimidation",
          "Killing/Maiming", "Punishment", "Recruitment and use",
          "Rape and/or other forms of sexual violence", "Forced labour",
          "Sale of children", "Trafficking of children", "Enslavement",
          "Unknown", "Other"],
          multi: true
        },
        { name: 'abduction_regained_freedom', options: 'Yes No Unknown' },
        {
          name: 'abduction_regained_freedom_how',
          options: ["Release by abductors", "Payment of ransom", "Escape",
          "Military or law enforcement operation", "Dissolution of armed force/group",
          "Formal handover process", "Other"],
          multi: true
        },
        { name: 'abduction_crossborder', options: 'Yes No Unknown' }
      ],
      attack_on: [
        { 
          name: 'attacks_schools_facility_attack_type', 
          options: ["Attack on school(s)", "Attack on education personnel",
            "Threat of attack on school(s)", "Other interference with education",
            "Attack on hospital(s)", "Attack on medical personnel",
            "Threat of attack on hospital(s)", "Other interference with healthcare"],
          multi: true
        },
        { name: 'attacks_schools_attack_type', options: 'Attack Type', multi: true },
        { name: 'attacks_schools_weapon_type', options: 'Weapon Type', multi: true },
        { name: 'attacks_schools_recurrent_attack', options: 'Yes No Unknown' },
        {
          name: 'attacks_schools_facility_operational_before',
          options: ["Yes", "No", "Partially", "Unknown"]
        },
        { name: 'attacks_schools_crossborder', options: 'Yes No Unknown' },
        { name: 'attacks_schools_school_type', options: 'School Type', multi: true },
        { name: 'attacks_schools_health_type', options: 'Healthcare Facility Type' },
        { name: 'attacks_schools_facility_impact', options: 'Facility Impact Type' },
      ],
      military_use: [
        {
          name: 'military_use_type',
          options: ["Military use of school", "Military use of hospital"]
        },
        {
          name: 'military_use_facility_operational_before',
          options: ["Yes", "No", "Partially", "Unknown"]
        },
        { name: 'military_use_crossborder', options: 'Yes No Unknown' },
        { name: 'military_use_school_type', options: 'School Type', multi: true },
        { name: 'military_use_health_type', options: 'Healthcare Facility Type', multi: true },
        { name: 'military_use_facility_impact', options: 'Facility Impact Type' },
      ],
      denial_humanitarian_access: [
        {
          name: 'denial_method',
          options: ["Abduction of humanitarian personnel", "Besiegement",
          "Entry restrictions for humanitarian personnel",
          "Import restrictions for relief goods",
          "Financial restrictions on humanitarian organizations",
          "Property damage", "Theft", "Restrictions of beneficiaries' access",
          "Threats/violence against beneficiaries",
          "Threats/violence against humanitarian personnel",
          "Travel restrictions in country", "Vehicle hijacking", "Other"],
          multi: true
        },
        {
          name: 'denial_organizations_affected',
          options: ["Governmental", "International/Inter-Governmental", "NGO/International",
          "NGO/National", "De-facto authorities", "ICRC-Red Cross/Crescent",
          "Religious/faith based institution", "Community organization",
          "Private (e.g. demining company)", "Unknown", "Other"],
          multi: true
        },
        { name: 'denial_crossborder', options: 'Yes No Unknown' },
        {
          name: 'denial_types_of_aid_disrupted_denial',
          options: ["Food", "Medical care", "Medical equipment", "School supplies",
          "WASH", "Other essential supplies"],
          multi: true
        }
      ]
    }
  end
end