require 'rails_helper'

describe ReportsHelper do

  describe "#pattern_histogram" do
    it "creates a histogram out of an array, preserving the order and creating a new count for identical but separated elements" do
      test_array = ["a", "b", "a", "a", "a", "c", "c", "c", "c", "c", "d", "b", "b"]
      result = helper.pattern_histogram(test_array)
      expect(result).to eq([["a",1],["b",1],["a",3],["c",5],["d",1],["b",2]])
    end
  end

end