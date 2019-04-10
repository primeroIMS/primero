
require 'rails_helper'

class TestClass < ValueObject
  include Cloneable

  attr_accessor :name, :attr_1,:attr_2,:attr_3

  def save_doc(*args)
    true
  end
end

describe Cloneable do
  before do
    @inst = TestClass.new({name: 'Test Name', attr_1: "abc", attr_2: "xyz", attr_3: 789})
  end

  context 'when name is passed in' do
    before do
      @new_inst = @inst.clone 'New Instance Name'
    end
    it 'creates a copy of the model with the new name' do
      expect(@new_inst.name).to eq('New Instance Name')
    end

    it 'creates a copy of the model having the same attribute values' do
      expect(@new_inst.attr_1).to eq('abc')
      expect(@new_inst.attr_2).to eq('xyz')
      expect(@new_inst.attr_3).to eq(789)
    end
  end

  context 'when name is not passed in' do
    before do
      @new_inst = @inst.clone
    end
    it 'creates a copy of the model with the old name prepended with cop of' do
      expect(@new_inst.name).to eq("copy of Test Name")
    end

    it 'creates a copy of the model having the same attribute values' do
      expect(@new_inst.attr_1).to eq('abc')
      expect(@new_inst.attr_2).to eq('xyz')
      expect(@new_inst.attr_3).to eq(789)
    end

  end
end
