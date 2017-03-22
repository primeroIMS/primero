class OptionsController < ApplicationController

  def index
    sources = build_string_sources
    
    respond_to do |format|
      if sources.present?
        format.json { render json: { success: 1, sources: sources, placeholder: I18n.t("fields.select_box_empty_item") }}
      else
        format.json { render json: { message: I18n.t("messages.string_sources_failed"), success: 0 }}
      end
    end
  end

  private

  def build_string_sources
    sources = []
    sources << get_lookups
    sources << get_locations if params[:string_sources].include?('Location')
    sources.reject{|source| source.nil?}.flatten
  end

  def get_lookups
    lookups = Lookup.all.all.select{|lookup| params[:string_sources].include?(lookup.id)}
    
    if lookups.present?
      lookups.map{|lookup| [{:type => lookup.id ,:options => lookup.lookup_values}]}
    else
      nil
    end
  end

  def get_locations
    {type: 'Location', options: Location.all_names}
  end
end
