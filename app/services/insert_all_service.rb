# frozen_string_literal: true

# service to insert records in bulk
class InsertAllService
  def self.insert_all(clazz, array_of_hashes, unique_key = nil)
    new.insert_all(clazz, array_of_hashes, unique_key)
  end

  def insert_all(clazz, array_of_hashes, unique_key = nil)
    return unless array_of_hashes.present?

    if unique_key.present?
      update_or_insert(clazz, array_of_hashes, unique_key)
    else
      clazz.insert_all!(array_of_hashes)
    end
  end

  # Because upsert_all doesn't work if some of the hashes are missing the unique_key
  def update_or_insert(clazz, array_of_hashes, unique_key)
    update_hashes = array_of_hashes.select { |hash| hash[unique_key].present? }
    insert_hashes = array_of_hashes.select { |hash| hash[unique_key].blank? }

    clazz.upsert_all(update_hashes, unique_by: unique_key.to_sym) if update_hashes.present?
    clazz.insert_all!(insert_hashes) if insert_hashes.present?
  end
end
