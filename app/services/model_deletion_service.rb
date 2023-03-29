# frozen_string_literal: true

# Service to handle deletion of data for a specific model and its associations
class ModelDeletionService < ValueObject
  UUID_REFERENCED_MODELS = [Alert, Attachment, Trace, Violation].freeze
  attr_accessor :model_class

  def delete_records!(query)
    puts "Removing data for model: #{model_class.name}..."

    ActiveRecord::Base.transaction do
      delete_data_references(query)
      nullify_record_references(query)
      delete_join_references(query)
      Sunspot.remove_by_id(model_class, query.pluck(:id))
      query.delete_all
    end
  end

  def delete_all!
    puts "Removing all data for model: #{model_class.name} and its associations..."
    ActiveRecord::Base.transaction do
      delete_join_tables
      nullify_references
      model_class.delete_all
    end
  end

  private

  def delete_join_tables
    model_join_reflections.each do |reflection|
      join_table = ActiveRecord::Base.connection.quote_column_name(reflection.join_table)
      puts "Removing join table: #{join_table}..."
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

  def delete_referenced_tables
    model_reflections.each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      puts "Removing data in referenced table: #{table_name}..."
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(["DELETE FROM #{table_name}"])
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
end
