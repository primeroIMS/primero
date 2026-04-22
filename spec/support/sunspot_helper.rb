# frozen_string_literal: true

module SunspotHelper
  def indexed_field(value, klass = nil)
    return unless Rails.configuration.solr_enabled

    Sunspot::Type.for_class(klass || value.class).to_indexed(value)
  end
end
