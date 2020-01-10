require 'rails_helper'

describe PrimeroProgram do
  it'should not be valid if name is empty' do
    program = PrimeroProgram.new
    expect(program).to be_invalid
    expect(program.errors[:name]).to include('errors.models.primero_program.name_present')
  end

  it 'should generate id' do
    PrimeroProgram.destroy_all
    program = create :primero_program, name: 'test program 1234'
    expect(program.unique_id).to eq('primeroprogram-test-program-1234')
  end
end