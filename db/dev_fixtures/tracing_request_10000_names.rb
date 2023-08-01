# frozen_string_literal: true

def read_file(filename)
  f = File.open(filename, 'r')

  names = []
  f.each_line do |line|
    l = line.delete("\n").delete("\r")
    names.push(l)
  end
  f.close
  names
end

def get_random_user
  users = %w[primero primero_cp]
  User.find_by_user_name(users.sample)
end

def create_tracing_request(id, num_of_tracing_requests, names, lastnames)
  relation = %w[mother father aunt uncle brother sister]

  (0..num_of_tracing_requests).each do |i|
    {
      "#{id}#{i}" => lambda do |c|
        randommonth = rand(10..11)
        randomday = rand(1..29)

        c.module_id = 'primeromodule-cp'
        c.status = %w[open closed].sample
        c.record_state = [true, false].sample
        c.created_at = DateTime.new(2014, randommonth, randomday)
        # random name and last name
        c.relation_name = "#{names[rand(names.size - 1)]} #{lastnames[rand(lastnames.size - 1)]}"
        c.relation_nickname = (names[rand(names.size - 1)]).to_s
        c.tracing_request_subform_section = [
          {
            unique_id: "#{id}#{i}-1",
            name: "#{c.relation_name}1",
            name_nickname: "#{c.relation_nickname}1",
            name_other: "#{c.relation_name}1",
            age: rand(1..15),
            relation: relation.sample
          },
          {
            unique_id: "#{id}#{i}-2",
            name: "#{c.relation_name}2",
            name_nickname: "#{c.relation_nickname}2",
            name_other: "#{c.relation_name}2",
            age: rand(1..15),
            relation: relation.sample
          }
        ]
      end
    }.each do |k, v|
      default_owner = get_random_user
      c = TracingRequest.find_by_unique_identifier(k) || TracingRequest.new_with_user_name(default_owner,
                                                                                           { unique_identifier: k })
      v.call(c)
      puts "TracingRequest #{c.new? ? 'created' : 'updated'}: #{c.unique_identifier} relation_name: #{c.relation_name}"
      c.save!
    end
  end
end

TracingRequest.all.each(&:destroy)

path = 'db/dev_fixtures/names/'
# 1:Arabic names, 2:East african names, 3: English names, 4: Spanish names
num_of_tracing_requests = [4000, 3000, 2000, 1000]
ids = %w[ara ea eng spa]
names = [read_file("#{path}arabic_names.csv"),
         read_file("#{path}swahili_names.csv"),
         read_file("#{path}english_names.csv"),
         read_file("#{path}spanish_names.csv")]

lastnames = [read_file("#{path}arabic_surnames.csv"),
             read_file("#{path}arabic_surnames.csv"),
             read_file("#{path}english_surnames.csv"),
             read_file("#{path}spanish_surnames.csv")]

4.times do |i|
  create_tracing_request(ids[i], num_of_tracing_requests[i], names[i], lastnames[i])
end
