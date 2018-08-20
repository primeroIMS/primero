module AgencyLogos
  extend ActiveSupport::Concern

  included do
    before_action :all_agency_logos
    before_action :find_logo, :only => [:show_logo]
  end

  def show_logo
    resized = @attachment.resize "x29"
    send_photo_data(resized.data.read, :type => @attachment.content_type, :disposition => 'inline')
  end

  private

  def all_agency_logos
    @agency_logos = Agency.retrieve_logo_ids
  end

  def find_logo
    object = instance_variable_get("@agency") || Agency.get(params[:agency_id])

    begin
      @attachment = object.media_for_key(params[:logo_id])
    rescue => e
      p e.inspect
    end
  end

  def send_photo_data(*args)
    expires_in 1.year, :public => true
    send_data *args
  end
end
