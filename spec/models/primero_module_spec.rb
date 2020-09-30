# frozen_string_literal: true

require 'rails_helper'

describe PrimeroModule do
  before :each do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram)
  end

  it 'should not be valid if name is empty' do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:name].should == ['Name must not be blank']
  end

  it 'should not be valid if a module name has been taken already' do
    create(:primero_module, name: 'Unique')
    primero_module = build(:primero_module, name: 'Unique')
    primero_module.should_not be_valid
    expect(primero_module.errors[:name]).to be
  end

  it 'should not be valid if it assigned record types are missing' do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    expect(primero_module.errors[:associated_record_types]).to be
  end

  it 'should generate id' do
    primero_module = create(:primero_module, name: 'test module 1234')
    primero_module.unique_id.should == 'primeromodule-test-module-1234'
  end
end
