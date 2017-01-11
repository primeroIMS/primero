class OptionStringSourcesController < ApplicationController

  def get_string_sources
    sources = build_string_sources
    
    respond_to do |format|
      if sources.present?
        format.json { render json: sources }
      else
        format.json { render json: { message: 'No sources found', success: 0 }}
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
