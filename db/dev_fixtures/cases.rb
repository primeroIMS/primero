
# Create enough cases to make a second page in the index view
filler_cases = (0..25).inject({}) do |acc, i|
  acc.merge({("ff928802-455b-4735-9e5c-4ed9acace1%.2d" % i) => ->(c) do
    c.name = "Child #{i}"
    c.created_at = DateTime.new(2014, 01, 01)
    c.module_id = 'primeromodule-cp'
  end})
end

{
  "ff928802-455b-4735-9e5c-4ed9acace001" => ->(c) do
    c.module_id = 'primeromodule-cp'
    c.name = 'David Thomas'
    c.hidden_name = true
    c.family_details_section = [
      {:relation_name => 'Jacob', :relation => 'Father'},
      {:relation_name => 'Martha', :relation => 'Mother'},
    ],
    c.followup_subform_section = [
      {:reason_child_not_seen => ['At School']},
      {:reason_child_not_seen => ['At School', 'Abducted', 'Child in Detention']},
      {:reason_child_not_seen => ['At School', 'Other, please specify']},
    ]
    c.date_of_birth = Date.new(2005, 01, 01)
    c.sex = 'Male'
    c.address_is_permanent = true
    c.address_current = '1 Arid Way'
    c.protection_concerns = ["Migrant", "Disabled"]
  end,

  "ef928802-455b-4735-9e5c-4ed9acace002" => ->(c) do
    c.name = 'Jonah Jacobson'
    c.module_id = 'primeromodule-cp'
    c.sex = 'Male'
    c.religion = ['Religion1']
    c.ethnicity = ['Kenyan']
    c.address_is_permanent = true
    c.address_current = '123 Main St'
    c.protection_concerns = ["Migrant", "Disabled", "Refugee"]
  end,

  "df928802-455b-4735-9e5c-4ed9acace003" => ->(c) do
    c.module_id = 'primeromodule-gbv'
    c.name = 'Mary Davidson'
    c.sex = 'Female'
  end,

  "df928802-455b-4735-9e5c-4ed9acace004" => ->(c) do
    c.module_id = 'primeromodule-cp'
    c.name = 'Child Low Risk Level'
    c.sex = 'Female'
    c.registration_date = Date.today - 1.month
    c.risk_level = "Low"
    c.system_generated_followup = true
    c.flags = [
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today - 2.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      }
    ]
  end,

  "df928802-455b-4735-9e5c-4ed9acace005" => ->(c) do
    c.module_id = 'primeromodule-cp'
    c.name = 'Child Medium Risk Level'
    c.sex = 'Female'
    c.registration_date = Date.today - 1.month
    c.risk_level = "Medium"
    c.system_generated_followup = true
    c.flags = [
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today - 2.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      },
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today - 1.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      }
    ]
    c.consent_info_sharing = ["Family", "UNHCR"]
  end,

  "df928802-455b-4735-9e5c-4ed9acace006" => ->(c) do
    c.module_id = 'primeromodule-cp'
    c.name = 'Child High Risk Level'
    c.sex = 'Female'
    c.registration_date = Date.today - 1.month
    c.risk_level = "High"
    c.system_generated_followup = true
    c.flags = [
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today - 2.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      },
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today - 1.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      },
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      },
      {:message => I18n.t("followup_reminders.system_generated_followup_flag"),
       :date => Date.today + 1.weeks,
       :created_at => Date.today - 2.weeks,
       :system_generated_followup => true
      }
    ]
  end

}.merge(filler_cases).each do |k, v|
  default_owner = User.find_by_user_name("primero")
  c = Child.find_by_unique_identifier(k) || Child.new_with_user_name(default_owner, {:unique_identifier => k})
  v.call(c)
  puts "Child #{c.new? ? 'created' : 'updated'}: #{c.unique_identifier}"
  c.save!
end
