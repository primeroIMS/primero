module AgencyLogos
  extend ActiveSupport::Concern

  included do
    before_action :all_agency_logos
    before_action :find_logo, :only => [:show_logo]
  end

  def show_logo
    resized = @attachment.variant(resize: '29')
    send_photo_data(resized, :type => @attachment.content_type, :disposition => 'inline')
  end

  private
  def all_agency_logos
  # This variable is used on application_controller.rb. Should we move this method?
    @agency_logos = Agency.retrieve_logo_ids
  end

  def find_logo
    object = instance_variable_get("@agency") || Agency.find_by_id(params[:agency_id])

    begin
      @attachment = object.logo_small.attachment
    rescue => e
      p e.inspect
    end
  end

  def send_photo_data(*args)
    expires_in 1.year, :public => true
    send_data *args
  end
end
