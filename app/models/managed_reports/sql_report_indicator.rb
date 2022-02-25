# frozen_string_literal: true

# Class to hold SQL results
class ManagedReports::SqlReportIndicator < ValueObject
  attr_accessor :params, :data

  class << self
    def sql(current_user, params = {}); end

    def build(current_user = nil, params = {})
      indicator = new(params: params)
      indicator.data = if block_given?
                         yield(indicator.execute_query(current_user))
                       else
                         indicator.execute_query(current_user)
                       end
      indicator
    end

    def equal_value_query(param, table_name = nil)
      return unless param.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, 'data')} ->> ? = ?", param.field_name, param.value]
      )
    end

    def date_range_query(param, table_name = nil)
      return unless param.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(#{quoted_query(table_name, 'data')} ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def user_scope_query(current_user, table_name = nil)
      return if current_user.blank? || current_user.group_permission?(Permission::ALL)

      if current_user.group_permission?(Permission::AGENCY)
        agency_scope_query(current_user, table_name)
      elsif current_user.group_permission?(Permission::GROUP)
        group_scope_query(current_user, table_name)
      else
        self_scope_query(current_user, table_name)
      end
    end

    def agency_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_agencies}' ?| array[:agencies]",
          agencies: [current_user.agency.unique_id]
        ]
      )
    end

    def group_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_groups}' ?| array[:groups]",
          groups: current_user.user_group_unique_ids
        ]
      )
    end

    def self_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_names}' ?| array[:user_names]",
          user_names: [current_user.user_name]
        ]
      )
    end

    def quoted_query(table_name, column_name)
      return ActiveRecord::Base.connection.quote_column_name(column_name) if table_name.blank?

      "#{quoted_table_name(table_name)}.#{ActiveRecord::Base.connection.quote_column_name(column_name)}"
    end

    def quoted_table_name(table_name)
      return unless table_name.present?

      ActiveRecord::Base.connection.quote_table_name(table_name)
    end
  end

  def execute_query(current_user)
    ActiveRecord::Base.connection.execute(self.class.sql(current_user, params))
  end

  def apply_params(query)
    params.values.each do |param|
      if param.class == SearchFilters::DateRange
        query = query.where(self.class.date_range_query(param))
        next
      end

      query = query.where(self.class.equal_value_query(param))
    end

    query
  end
end
