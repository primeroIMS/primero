# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service to handle deletion of data for a specific model and its associations
# rubocop:disable Metrics/ClassLength
class ModelDeletionService < ValueObject
  UUID_REFERENCED_MODELS = [
    Alert, Attachment, Trace, Violation, SearchableIdentifier, SearchableValue,
    SearchableDatetime, SearchableNumeric, SearchableBoolean
  ].freeze

  attr_accessor :model_class

  def delete_records!(query)
    puts "Deleting records for model: #{model_class.name}..."
    record_ids = query.pluck(:id)

    ActiveRecord::Base.transaction do
      delete_data_references(query)
      nullify_record_references(query)
      delete_join_references(query)
      query.delete_all
    end

    remove_from_solr(record_ids)
  end

  def delete_all!
    puts "Deleting all data for model: #{model_class.name} and its associations..."
    ActiveRecord::Base.transaction do
      delete_join_tables
      delete_whitelisted_jwts if model_class == User
      delete_agency_attachments if model_class == Agency
      nullify_references
      model_class.delete_all
    end
  end

  private

  def delete_agency_attachments
    blob_ids = ActiveRecord::Base.connection.execute(
      "SELECT blob_id FROM active_storage_attachments WHERE record_type = 'Agency'"
    ).to_a.map { |result| result['blob_id'] }

    delete_blob_ids(blob_ids, 'Agency')

    Attachment.where(record_type: 'Agency').delete_all
  end

  def delete_whitelisted_jwts
    ActiveRecord::Base.connection.execute('DELETE FROM whitelisted_jwts')
  end

  def delete_join_tables
    model_join_reflections.each do |reflection|
      join_table = ActiveRecord::Base.connection.quote_column_name(reflection.join_table)
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(["DELETE FROM #{join_table}"])
      )
    end
  end

  def nullify_references
    model_reflections.each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      puts "Removing references in table: #{table_name}..."
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["UPDATE #{table_name} SET #{column_name} = NULL WHERE #{column_name} IS NOT NULL"]
        )
      )
    end
  end

  def nullify_record_references(query)
    record_model_reflections.each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["UPDATE #{table_name} SET #{column_name} = NULL WHERE #{column_name} IN (#{query.select(:id).to_sql})"]
        )
      )
    end
  end

  def delete_data_references(query)
    data_model_reflections.each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      delete_attachment_references(query, column_name) if reflection.klass == Attachment
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["DELETE FROM #{table_name} WHERE #{column_name} IN (#{data_query(reflection.klass, query).to_sql})"]
        )
      )
    end
  end

  def data_query(data_model, query)
    return query.select('id') if UUID_REFERENCED_MODELS.include?(data_model)

    query.select('CAST (id AS VARCHAR) as id')
  end

  def delete_attachment_references(query, column_name)
    attachments = Attachment.where(
      ActiveRecord::Base.sanitize_sql_for_conditions(
        "#{column_name} IN (#{query.select('id').to_sql})"
      )
    )

    blob_ids = active_storage_blob_ids(attachments)

    return unless blob_ids.present?

    delete_blob_ids(blob_ids, 'Attachment')
  end

  def delete_blob_ids(blob_ids, record_type = 'Attachment')
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['DELETE FROM active_storage_attachments WHERE record_type = ? AND blob_id IN (?)', record_type, blob_ids]
      )
    )

    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_for_conditions(['DELETE FROM active_storage_blobs WHERE id IN (?)', blob_ids])
    )
  end

  def active_storage_blob_ids(attachments)
    sql_query = attachments.select(:id).to_sql
    ActiveRecord::Base.connection.execute(
      "SELECT blob_id FROM active_storage_attachments WHERE record_type != 'Agency' AND record_id IN (#{sql_query})"
    ).to_a.map { |result| result['blob_id'] }
  end

  def delete_join_references(query)
    model_join_reflections.each do |reflection|
      join_table = ActiveRecord::Base.connection.quote_column_name(reflection.join_table)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["DELETE FROM #{join_table} WHERE #{column_name} IN (#{query.select(:id).to_sql})"]
        )
      )
    end
  end

  def record_model_reflections
    model_reflections.select { |reflection| DataRemovalService::RECORD_MODELS.include?(reflection.klass) }
  end

  def data_model_reflections
    model_reflections.select { |reflection| DataRemovalService::RECORD_MODELS.exclude?(reflection.klass) }
  end

  def model_reflections
    model_class.reflect_on_all_associations(:has_many).reject(&:through_reflection?)
  end

  def model_join_reflections
    model_class.reflect_on_all_associations(:has_and_belongs_to_many).reject(&:through_reflection?)
  end

  def remove_from_solr(record_ids)
    return unless Rails.configuration.solr_enabled

    Sunspot.remove_by_id(model_class, record_ids)
  end
end
# rubocop:enable Metrics/ClassLength
