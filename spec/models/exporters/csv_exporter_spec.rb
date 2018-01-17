require 'rails_helper'

module Exporters
  describe CSVExporter do
    it "converts data to CSV format" do
      BaseExporter.should_receive(:to_2D_array)
        .and_yield([ 'name', 'age', 'birthday', 'height' ])
        .and_yield([ 'Joe', 12, Date.today, 120 ])
        .and_yield([ 'Mo', 14, Date.today, 140 ])

      data = CSVExporter.export(nil, [])

      parsed = CSV.parse(data)
      parsed[0].should == ['name', 'age', 'birthday', 'height']
      parsed[1][2].should == Date.today.to_s
    end
  end
end
