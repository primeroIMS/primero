# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe PrimeroModelService do
  describe 'to_model' do
    it 'converts a valid string to a class' do
      expect(PrimeroModelService.to_model('incident')).to eq(Incident)
    end

    it 'converts the string "case" to a Child object' do
      expect(PrimeroModelService.to_model('case')).to eq(Child)
    end

    it 'will not convert unsafe strings to an object' do
      expect(PrimeroModelService.to_model('Kernel')).to be_nil
    end
  end

  describe 'to_name' do
    it 'changes a class name to a simple type name' do
      expect(PrimeroModelService.to_name('Incident')).to eq('incident')
    end

    it 'changes the string "Child" to "case"' do
      expect(PrimeroModelService.to_name('Child')).to eq('case')
    end
  end
end
