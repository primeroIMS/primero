# frozen_string_literal: true

# Generates an Arel order query for i18n JSON property and for case insensitive properties on a model
# Or a hash for other properties
class OrderByPropertyService
  class << self
    def build_order_query(model_class, options = {})
      return unless options.present? && options[:order_by].present?

      order_by = options[:order_by]
      order = order_direction(options[:order])
      locale = order_locale(options[:locale]&.to_sym)

      return order_query(model_class, locale, order_by, order) unless insensitive_attribute?(model_class, order_by)

      insensitive_order_query(model_class, locale, order_by, order)
    end

    def apply_order(relation, params)
      order_query = build_order_query(relation.model, params)
      order_query.present? ? relation.order(order_query) : relation
    end

    def order_direction(order_direction)
      ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
    end

    def order_locale(locale)
      I18n.available_locales.include?(locale) ? locale : :en
    end

    private

    def order_query(model_class, locale, order_by, order)
      return { order_by => order } unless localized_property?(model_class, order_by.to_sym)

      Arel.sql("#{order_by}_i18n ->> '#{locale}' #{order}")
    end

    def insensitive_order_query(model_class, locale, order_by, order)
      return model_class.arel_table[order_by].lower.try(order) unless localized_property?(model_class, order_by.to_sym)

      Arel.sql("LOWER(#{order_by}_i18n ->> '#{locale}') #{order}")
    end

    def localized_property?(model_class, order_by)
      model_class.try(:localized_properties)&.include?(order_by)
    end

    def insensitive_attribute?(model_class, order_by)
      model_class.try(:order_insensitive_attribute_names).try(:include?, order_by)
    end
  end
end
