# r = Report.create!(
#   name: 'Test 2x2',
#   module_id: 'primeromodule-cp',
#   record_type: 'case',
#   aggregate_by: ["location_current", "protection_concerns"],
#   disaggregate_by: ["age", "sex"],
# )

sexes = ['Male', 'Female']
nationality = ['Kenya', 'Uganda', 'Somalia', 'Ethiopia', 'Rwanda', 'Burundi', 'South Sudan', 'Tanzania']
locations = ['Kakuma', 'Dadaab', 'Dolo Ado', 'Nairobi']
displacement_status = [
  "Resident",
  "IDP",
  "Refugee",
  "Stateless Person",
  "Returnee",
  "Foreign National",
  "Asylum Seeker"
]

protection_concerns = [
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
  "Word Forms of Child Labor",
  "Child Headed Household",
  "Mentally Distressed",
  "Other"
]
status = ['open', 'closed']
case_module_ids = ['primeromodule-cp', 'primeromodule-gbv']

(0..200).each do |i|
  concerns = []
  (0..rand(4)).each do |j|
    concerns << protection_concerns[rand(protection_concerns.size)] if j > 0
  end

  Child.create!(
    name: "Test Case #{i.to_s}",
    age: rand(18),
    sex: sexes[rand(sexes.size)],
    location_current: locations[rand(locations.size)],
    protection_concerns: concerns,
    status: status[rand(status.size)],
    record_state: true,
    module_id: case_module_ids[rand(case_module_ids.size)],
    nationality: [nationality[rand(nationality.size)]],
    displacement_status: displacement_status[rand(displacement_status.size)]
  )
end