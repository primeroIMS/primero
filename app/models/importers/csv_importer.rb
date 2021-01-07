# frozen_string_literal: true

# Import record data into Primero from CSV.
# TODO: This is deprecated and should be eventually removed for security reasons
class Importers::CSVImporter < Importers::BaseImporter
  def self.id
    'csv'
  end

  def self.display_name
    'CSV'
  end

  def self.import(file_obj)
    rows = CSVSafe.parse(file_obj) # TODO: This isn't actually safe
    flat_to_nested(rows)
  end
end
