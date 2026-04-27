# frozen_string_literal: true

# Extend CSVSafe to handle invisible control characters.
class CSVSafer < CSVSafe
  private

  def starts_with_special_character?(str)
    ::CsvSanitizerService.formula?(str)
  end
end
