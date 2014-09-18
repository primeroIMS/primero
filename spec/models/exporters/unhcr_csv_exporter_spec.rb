require 'spec_helper'

module Exporters
  describe UnhcrCSVExporter do
    before :each do
      @child_cls = Child.clone
      @child_cls.class_eval do
        property :religion, [String]
        property :nationality, [String]
        property :ethnicity, [String]
        property :protection_concerns, [String]
        property :language, [String]
        property :family_details_section, [Class.new do
          include CouchRest::Model::Embeddable
          property :relation_name, String
          property :relation, String
        end]
      end
      @test_child = @child_cls.new
    end

    it "converts religion to comma separated string" do
      @test_child.religion = ['abc', 'def']
      data = UnhcrCSVExporter.export([@test_child], nil)

      parsed = CSV.parse(data)
      parsed[1][parsed[0].index("Religion of the Child")].should == 'abc, def'
    end
  end
end
