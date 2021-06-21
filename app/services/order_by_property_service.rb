# frozen_string_literal: true

# Generates an Arel order query for an i18n JSON property on a model.
# Returns a Hash for non localizable properties
class OrderByPropertyService
  class << self
    def build_order_query(model_class, options = {})
      return unless options.present? && options[:order_by].present?

      order_by = options[:order_by].to_sym
      order = order_direction(options[:order]&.to_sym)

      return { order_by => order } unless model_class.try(:localized_properties)&.include?(order_by)

      Arel.sql("#{order_by}_i18n ->> '#{order_locale(options[:locale]&.to_sym)}' #{order}")
    end

    def apply_order(relation, params)
      order_query = build_order_query(relation.model, params)
      order_query.present? ? relation.order(order_query) : relation
    end

    private

    def order_direction(order_direction)
      ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
    end

    def order_locale(locale)
      I18n.available_locales.include?(locale) ? locale : :en
    end
  end
end
