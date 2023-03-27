# frozen_string_literal: true

# Service to handle deletion of data for a specific model and its associations
class ModelDeletionService < ValueObject
  attr_accessor :model_class

  def delete!
    puts "Removing data for model: #{model_class.name}..."
    delete_join_tables
    delete_referenced_tables
    model_class.delete_all
  end

  def delete_all!
    puts "Removing all data for model: #{model_class.name} and its associations..."
    delete_join_tables
    delete_referenced_tables
    model_class.delete_all
  end

  def delete_join_tables
    model_join_reflections.each do |reflection|
      join_table = ActiveRecord::Base.connection.quote_column_name(reflection.join_table)
      puts "Removing join table: #{join_table}..."
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(["DELETE FROM #{join_table}"])
      )
    end
  end

  def delete_referenced_tables
    model_reflections.each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      puts "Removing data in referenced table: #{table_name}..."
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(["DELETE FROM #{table_name} where #{column_name} IS NOT NULL"])
      )
    end
  end

  def nullify_references(record)
    model_reflections(record.class).each do |reflection|
      table_name = ActiveRecord::Base.connection.quote_table_name(reflection.table_name)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["UPDATE #{table_name} SET #{column_name} = NULL WHERE #{column_name} = ?", record.id]
        )
      )
    end
  end

  def remove_row_reference(record)
    model_join_reflections(record.class).each do |reflection|
      join_table = ActiveRecord::Base.connection.quote_column_name(reflection.join_table)
      column_name = ActiveRecord::Base.connection.quote_column_name(reflection.foreign_key)
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ["DELETE FROM #{join_table} WHERE #{column_name} = ?", record.id]
        )
      )
    end
  end

  def model_reflections
    model_class.reflect_on_all_associations(:has_many).reject(&:through_reflection?)
  end

  def model_join_reflections
    model_class.reflect_on_all_associations(:has_and_belongs_to_many).reject(&:through_reflection?)
  end
end
