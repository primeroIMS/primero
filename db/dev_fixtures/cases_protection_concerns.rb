def read_file(filename)
  f = File.open(filename, "r")
  names = []
  f.each_line do |line|
    l=line.delete("\n").delete("\r")
    names.push(l)
  end
  f.close
  names
end

def get_random_user
  users = ['primero', 'primero_cp']
  return User.find_by_user_name(users.sample)
end

def create_case(id, names, lastnames, protection_concerns, number_of_children, risk_levels, locations)
  children = (0..number_of_children).each do |i|
    {
      "#{id}#{i}" => ->(c) do
        first_name = names.sample
        last_name = lastnames.sample
        now = Time.now
        random_date = rand(2.years.ago..Time.now)
        age = rand(1..20)
        number_of_protection_concerns = rand(1..5)
        location = locations.sample

        c.module_id = 'primeromodule-cp'
        c.status = ['open', 'closed'].sample
        c.record_state = [true, false].sample
        c.name_first = first_name
        c.name_last = last_name
        c.age = age
        c.registration_date = random_date
        c.risk_level = risk_levels.sample
        c.location_current = location
        c.protection_concern_detail_subform_section = []
        c.protection_concerns = []
        (0..number_of_protection_concerns).each do |k|
          concern = (protection_concerns - c.protection_concerns).sample
          c.protection_concerns << concern
          c.protection_concern_detail_subform_section << {
            unique_id: "#{id}#{i}_protection_#{k}",
            concern_action_taken_already: false,
            concern_is_resolved: false,
            protection_concern_type: concern
          }
        end
      end
    }.each do |k, v|
      default_owner = get_random_user
      c = Child.find_by_unique_identifier(k) || Child.new_with_user_name(default_owner, {:unique_identifier => k})
      v.call(c)
      puts "Child #{c.new? ? 'created' : 'updated'}: #{c.unique_identifier} name: #{c.name}"
      c.save!
    end
  end
end

path_names="db/dev_fixtures/names/"
path_locations="db/dev_fixtures/locations/"
#1:Arabic names, 2:East african names, 3: English names, 4: Spanish names
number_of_children=[5000, 5000, 5000, 5000]
ids = ["ara", "ea", "eng", "spa"]
names = [
  read_file("#{path_names}arabic_names.csv"),
  read_file("#{path_names}swahili_names.csv"),
  read_file("#{path_names}english_names.csv"),
  read_file("#{path_names}spanish_names.csv")
]
lastnames = [
  read_file("#{path_names}arabic_surnames.csv"),
  read_file("#{path_names}arabic_surnames.csv"),
  read_file("#{path_names}english_surnames.csv"),
  read_file("#{path_names}spanish_surnames.csv")
]
locations = read_file("#{path_locations}jordan.csv")
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
  "Worst Forms of Child Labor",
  "Child Headed Household",
  "Mentally Distressed",
  "Other"
]
risk_levels = [
  "High",
  "Medium",
  "Low"
]

(0..3).each do |i|
  children = create_case(ids[i], names[i], lastnames[i], protection_concerns, number_of_children[i], risk_levels, locations)
end
