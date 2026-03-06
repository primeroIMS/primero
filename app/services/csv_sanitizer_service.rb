# frozen_string_literal: true

# This offers a more thorough sanitization of strings written to spreadsheets
# by escaping unprintable characters and fomula triggers.
class CsvSanitizerService
  # Leading whitespace + common "invisible" control characters followed by spreadsheet formula triggers
  FORMULA_TRIGGERS = /\A[\uFEFF\u0000-\u001F\u007F\s]*[=+\-@|%]/u

  def self.formula?(str)
    str.present? && str.is_a?(String) && FORMULA_TRIGGERS.match?(str)
  end

  def self.sanitize(str)
    return str unless formula?(str)

    "'#{str}"
  end
end
