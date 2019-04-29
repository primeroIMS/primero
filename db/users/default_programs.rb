def create_or_update_program(program_hash)
  program = PrimeroProgram.find_by(unique_id: program_hash[:unique_id])

  if program.nil?
    puts "Creating program #{program_hash[:unique_id]}"
    PrimeroProgram.create! program_hash
  else
    puts "Updating program #{program_hash[:unique_id]}"
    program.update_attributes program_hash
  end

end


create_or_update_program(
  unique_id: "primeroprogram-primero",
  name: "Primero",
  description: "Default Primero Program"
)

