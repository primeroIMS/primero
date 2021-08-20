# frozen_string_literal: true

# Wraps a SQL INSERT statement to insert an array of hashes.
# TODO: Rails 6 implements a less clunky insert_all as part of the core ActiveRecord functionality.
#       After upgrading, stop using this service.
class InsertAllService
  def self.insert_all(clazz, array_of_hashes, unique_key = nil)
    new.insert_all(clazz, array_of_hashes, unique_key)
  end

  def insert_all(clazz, array_of_hashes, unique_key = nil)
    return unless array_of_hashes.present?

    unique_hashes = unique(array_of_hashes, unique_key)

    if unique_key.present?
      clazz.upsert_all(unique_hashes, unique_by: unique_key.to_sym)
    else
      clazz.insert_all!(unique_hashes)
    end
  end

  private

  def unique(array_of_hashes, unique_key = nil)
    return array_of_hashes unless array_of_hashes.present? && unique_key

    array_of_hashes.uniq { |hash| hash[unique_key] }
  end
end
