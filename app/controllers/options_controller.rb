class OptionsController < ApplicationController

  def index
    sources = build_string_sources

    respond_to do |format|
      if sources.present?
        format.json { render json: { success: 1, sources: sources, placeholder: I18n.t("fields.select_box_empty_item", locale: locale) }}
      else
        format.json { render json: { message: I18n.t("messages.string_sources_failed", locale: locale), success: 0 }}
      end
    end
  end

  private

  def build_string_sources
    sources = []

    if params[:string_sources].present? || params[:all].present?
      sources << get_lookups
      sources << get_locations
      sources << get_reporting_locations
      sources.reject{|source| source.nil?}.flatten
    end
  end

  def get_lookups
    lookups = params[:all].present? ? Lookup.all : Lookup.where(unique_id: params[:string_sources])
    if lookups.present?
      lookups.map{ |lookup| [{:type => lookup.unique_id ,:options => lookup.lookup_values(params[:locale])}]}
    else
      nil
    end
  end

  def locale
    params[:locale] ||= I18n.locale
  end

  def get_locations
   if params[:mobile].present? || (params[:string_sources].present? && params[:string_sources].include?('Location'))
    { type: 'Location', options: Location.all_names(locale: I18n.locale) }
   end
  end

  def get_reporting_locations
    if params[:string_sources].present? && params[:string_sources].include?('ReportingLocation')
      { type: 'ReportingLocation', options: Location.all_names_reporting_locations(locale: I18n.locale) }
    end
  end
end
