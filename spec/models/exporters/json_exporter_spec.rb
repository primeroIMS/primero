require 'spec_helper'

module Exporters
  describe JSONExporter do
    it "converts models to JSON format" do
      data = JSONExporter.export()
    end
  end
end
