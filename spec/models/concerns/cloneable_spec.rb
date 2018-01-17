
require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Cloneable

  property :name, String, :default => 'A name'
  property :attr_1, String
  property :attr_2, String
  property :attr_3, Integer

  def save_doc(*args)
    true
  end
end

describe Cloneable do
  before do
    @inst = TestClass.new({name: 'Test Name', attr_1: "abc", attr_2: "xyz", attr_3: 789})
    @inst.generate_id
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

    it 'creates a copy of the modle having an id based on the new name' do
      expect(@new_inst.id).to eq('testclass-new-instance-name')
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

    it 'creates a copy of the modle having an id based on the new name' do
      expect(@new_inst.id).to eq('testclass-copy-of-test-name')
    end
  end
end
