require 'rails_helper'

module Exporters
  describe CSVExporter do
    before :each do
      case1 = Child.new(data: { name: 'Joe', age: 12, sex: 'male' })
      case2 = Child.new(data: { name: 'Mo', age: 14, sex: 'male' })
      @records = [case1, case2]
      @fields = [Field.new(name: 'name'), Field.new(name: 'age'), Field.new(name: 'sex')]
    end

    it 'converts data to CSV format' do
      data = CSVExporter.export(@records, @fields)

      parsed = CSV.parse(data)
      expect(parsed[0]).to eq %w[id name age sex]
      expect(parsed[1][1..3]).to eq(%w[Joe 12 male])
      expect(parsed[2][1..3]).to eq(%w[Mo 14 male])
    end
  end
end
