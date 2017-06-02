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

def create_children(id, num_children, names, lastnames)


  children = (0..num_children).each do |i|

    {
      "#{id}#{i}" => ->(c) do
        randommonth = 10 + rand(2)
        randomday = 1 + rand(29)
        randommonthabbr = [05, 06].sample

        c.module_id = 'primeromodule-cp'
        c.name = ''
        c.child_status = ['open', 'closed'].sample
        c.record_state = [true, false].sample
        c.registration_date = Date.new(2017, randommonthabbr, randomday)
        c.created_at = DateTime.new(2014, randommonth, randomday)
        #random name and last name
        c.name = "#{names[rand(names.size-1)]} #{lastnames[rand(lastnames.size-1)]}"
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

Child.all.each &:destroy

path="db/dev_fixtures/names/"
#1:Arabic names, 2:East african names, 3: English names, 4: Spanish names
number_of_children=[4000, 3000, 2000, 1000]
ids = ["ara", "ea", "eng", "spa"]
names = [read_file("#{path}arabic_names.csv"),
    read_file("#{path}swahili_names.csv"),
    read_file("#{path}english_names.csv"),
    read_file("#{path}spanish_names.csv")]

lastnames = [read_file("#{path}arabic_surnames.csv"),
    read_file("#{path}arabic_surnames.csv"),
    read_file("#{path}english_surnames.csv"),
    read_file("#{path}spanish_surnames.csv")]


(0..3).each do |i|
    children = create_children(ids[i], number_of_children[i], names[i], lastnames[i])
end
