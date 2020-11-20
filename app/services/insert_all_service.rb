# frozen_string_literal: true

# Wraps a SQL INSERT statement to insert an array of hashes.
# TODO: Rails 6 implements a less clunky insert_all as part of the core ActiveRecord functionality.
#       After upgrading, stop using this service.
class InsertAllService
  attr_accessor :connection

  def self.insert_all(clazz, array_of_hashes, unique_key = nil)
    new.insert_all(clazz, array_of_hashes, unique_key)
  end

  def insert_all(clazz, array_of_hashes, unique_key = nil)
    self.connection = clazz.connection
    unique = unique(clazz, array_of_hashes, unique_key)
    sql = build_sql(clazz, unique)
    connection.exec_query(sql)
  end

  def build_sql(clazz, array_of_hashes)
    return unless array_of_hashes.present?

    columns = array_of_hashes[0].keys.join(', ')
    table_name = clazz.table_name
    values = array_of_hashes.map do |hash|
      "(#{hash.values.map { |v| sql_value(v) }.join(', ')})"
    end
    "INSERT INTO #{table_name} (#{columns}) VALUES #{values.join(', ')}"
  end

  def sql_value(value)
    value = value.to_json if value.is_a?(Hash) || value.is_a?(Array)
    sanitize(value)
  end

  def sanitize(value)
    connection.quote(value)
  end

  def unique(clazz, array_of_hashes, unique_key = nil)
    unique_by_key = unique_by_key(array_of_hashes, unique_key)
    unique_by_database(clazz, unique_by_key, unique_key)
  end

  def unique_by_key(array_of_hashes, unique_key = nil)
    return array_of_hashes unless array_of_hashes.present? && unique_key

    array_of_hashes.uniq { |hash| hash[unique_key] }
  end

  # Not elegant. Ideally rely on DB index.
  def unique_by_database(clazz, array_of_hashes, unique_key = nil)
    return unless array_of_hashes.present? && unique_key

    keys_in_database = clazz.pluck(unique_key).each_with_object({}) { |key, key_hash| key_hash[key] = 1 }
    array_of_hashes.reject do |hash|
      key = hash[unique_key]
      keys_in_database[key]
    end
  end
end
