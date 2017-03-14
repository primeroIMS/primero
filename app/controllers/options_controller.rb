class OptionsController < ApplicationController

  def index
    sources = build_string_sources
    
    respond_to do |format|
      if sources.present?
        format.json { render json: { success: 1, sources: sources }}
      else
        format.json { render json: { message: t('string_sources_failed'), success: 0 }}
      end
    end
  end

  private

  def build_string_sources
    sources = []

    if params[:string_sources].present?
      params[:string_sources].each{|source| sources << string_sources(source)}
    end

    sources.reject{|source| source.nil?}
  end

  def string_sources(source)
    case source
    when 'Location'
      {type: source, options: Location.all_names}
    end
  end
end
