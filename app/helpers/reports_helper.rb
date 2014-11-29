module ReportsHelper

  # Creates a histogram out of an array, preserving the order and creating
  # a new count for identical but separated elements
  # pattern_histogram(["a","a","b","a"])
  # =>
  # [["a",2],["b",1],["a",1]]
  def pattern_histogram(array)
    result = []
    previous = nil
    array.each do |element|
      if element != previous
        result << [element, 1]
      else
        result[-1][1] = result[-1][1] + 1
      end
      previous = element
    end
    return result
  end

  # Compute the complex headers for the disaggregate fields.
  # There will be a row for every disaggregate pivot nest
  def report_header_rows(disaggregate_fields)
    header_rows = []
    if disaggregate_fields.present?
      disaggregate_fields.first.length.times.each do |i|
        header_rows << pattern_histogram(disaggregate_fields[1..-1].map{|v|v[i]})
      end
    end
    return header_rows
  end

end