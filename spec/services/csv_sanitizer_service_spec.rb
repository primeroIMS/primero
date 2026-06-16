# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CsvSanitizerService do
  describe '.formula?' do
    it 'returns false for nil' do
      expect(described_class.formula?(nil)).to be false
    end

    it 'returns false for empty string' do
      expect(described_class.formula?('')).to be false
    end

    it 'returns false for non-string values' do
      expect(described_class.formula?(123)).to be false
      expect(described_class.formula?([])).to be false
    end

    it 'returns true for strings starting with =' do
      expect(described_class.formula?('=SUM(A1:A10)')).to be true
    end

    it 'returns true for strings starting with +' do
      expect(described_class.formula?('+1+1')).to be true
    end

    it 'returns true for strings starting with -' do
      expect(described_class.formula?('-2+5')).to be true
    end

    it 'returns true for strings starting with @' do
      expect(described_class.formula?('@SUM(A1)')).to be true
    end

    it 'returns true for strings starting with |' do
      expect(described_class.formula?('|data')).to be true
    end

    it 'returns true for strings starting with %' do
      expect(described_class.formula?('%percent')).to be true
    end

    it 'returns true when formula trigger follows whitespace' do
      expect(described_class.formula?('  =SUM(A1)')).to be true
    end

    it 'returns true when formula trigger follows control characters' do
      expect(described_class.formula?("\u0000=SUM(A1)")).to be true
    end

    it 'returns false for normal strings' do
      expect(described_class.formula?('normal text')).to be false
      expect(described_class.formula?('123')).to be false
    end
  end

  describe '.sanitize' do
    it 'returns the string unchanged if not a formula' do
      expect(described_class.sanitize('normal text')).to eq('normal text')
    end

    it 'prepends single quote to formula starting with =' do
      expect(described_class.sanitize('=SUM(A1:A10)')).to eq("'=SUM(A1:A10)")
    end

    it 'prepends single quote to formula starting with +' do
      expect(described_class.sanitize('+1+1')).to eq("'+1+1")
    end

    it 'prepends single quote to formula starting with -' do
      expect(described_class.sanitize('-2+5')).to eq("'-2+5")
    end

    it 'prepends single quote to formula starting with @' do
      expect(described_class.sanitize('@SUM(A1)')).to eq("'@SUM(A1)")
    end

    it 'prepends single quote to formula with whitespace and trigger' do
      expect(described_class.sanitize('  =SUM(A1)')).to eq("'  =SUM(A1)")
    end

    it 'returns nil unchanged' do
      expect(described_class.sanitize(nil)).to be nil
    end

    it 'returns non-string values unchanged' do
      expect(described_class.sanitize(123)).to eq(123)
    end
  end
end
