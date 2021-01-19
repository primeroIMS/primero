FactoryBot.define do
  factory :primero_configuration, traits: [:active_model] do
    id {counter}
    name {"primero_configuration#{counter}"}
    description {'Primero Config From Factory'}
    data {{
      FormSection: [FactoryBot.create(:form_section)],
      Lookup: [FactoryBot.create(:lookup)],
      Agency: [FactoryBot.create(:agency)],
      Role: [FactoryBot.create(:role)],
      UserGroup: [FactoryBot.create(:user_group)],
      Report: [FactoryBot.create(:report)],
      ContactInformation: []
    }}
  end
end