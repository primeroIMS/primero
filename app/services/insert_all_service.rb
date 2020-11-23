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
    unique = unique(array_of_hashes, unique_key)
    sql = build_sql(clazz, unique, unique_key)
    connection.exec_query(sql)
  end

  def build_sql(clazz, array_of_hashes, unique_key)
    return unless array_of_hashes.present?

    columns = array_of_hashes[0].keys
    table_name = clazz.table_name
    values = array_of_hashes.map do |hash|
      "(#{hash.values.map { |v| sql_value(v) }.join(', ')})"
    end
    sql = "INSERT INTO #{table_name} (#{columns.join(', ')}) VALUES #{values.join(', ')}"
    sql += upsert_sql_clause(unique_key, columns) if unique_key
    sql
  end

  def upsert_sql_clause(unique_key, columns)
    "ON CONFLICT (#{unique_key}) DO UPDATE SET " + columns.map { |c| "#{c} = excluded.#{c}" }.join(', ')
  end

  def sql_value(value)
    value = value.to_json if value.is_a?(Hash) || value.is_a?(Array)
    sanitize(value)
  end

  def sanitize(value)
    connection.quote(value)
  end

  def unique(array_of_hashes, unique_key = nil)
    return array_of_hashes unless array_of_hashes.present? && unique_key

    array_of_hashes.uniq { |hash| hash[unique_key] }
  end
end
