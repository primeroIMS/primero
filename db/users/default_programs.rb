def create_or_update_program(program_hash)
  program_id = PrimeroProgram.id_from_name(program_hash[:name])
  program = PrimeroProgram.get(program_id)

  if program.nil?
    puts "Creating program #{program_id}"
    PrimeroProgram.create! program_hash
  else
    puts "Updating program #{program_id}"
    program.update_attributes program_hash
  end

end


create_or_update_program(
  name: "Primero",
  description: "Default Primero Program"
)

