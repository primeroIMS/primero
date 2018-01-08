require 'rails_helper'

class TestClass < CouchRest::Model::Base
  include Disableable

  property :name, String

  def save_doc(*args)
    true
  end
end

describe Disableable do
  before do
    TestClass.all.each &:destroy

    @enabled1 = TestClass.create({name: 'Enabled 1'})
    @enabled2 = TestClass.create({name: 'Enabled 2', disabled: false})
    @enabled3 = TestClass.create({name: 'Enabled 3', disabled: false})
    @disabled1 = TestClass.create({name: 'Disabled 1', disabled: true})
    @disabled2 = TestClass.create({name: 'Disabled 2', disabled: true})
  end

  context 'by disabled' do
    it 'gets disabled records' do
      expect(TestClass.by_disabled.count).to eq(2)
      expect(TestClass.by_disabled.all).to include(@disabled1, @disabled2)
    end

    it 'does not get enabled records' do
      expect(TestClass.by_disabled.all).not_to include(@enabled1, @enabled2, @enabled3)
    end
  end

  context 'by enabled' do
    it 'gets enabled records' do
      expect(TestClass.by_enabled.count).to eq(3)
      expect(TestClass.by_enabled.all).to include(@enabled1, @enabled2, @enabled3)
    end

    it 'does not get disabled records' do
      expect(TestClass.by_enabled.all).not_to include(@disabled1, @disabled2)
    end
  end
end