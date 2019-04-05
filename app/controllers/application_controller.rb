# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
#

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, prepend: true, unless: -> { request.format.json? }
  before_action :authorize_profiler

  helper :all
  helper_method :is_mobile?

  include AgencyLogos

  before_action :authenticate_user!
  before_action :permit_all_params
  before_action :load_system_settings
  before_action :set_locale

  around_action :with_timezone

  rescue_from( ErrorResponse ) { |e| render_error_response(e) }
  rescue_from CanCan::AccessDenied do |exception|
    if request.format == "application/json"
      render :json => "unauthorized", :status => 403
    else
      render :file => "#{Rails.root}/public/403", :status => 403, :layout => false, :formats => [:html]
    end
  end

  def authorize_profiler
    Rack::MiniProfiler.authorize_request if ENV['PROFILE']
  end

  def handle_device_blacklisted(session)
    render(:status => 403, :json => session.imei)
  end

  def render_error_response(ex)
    respond_to do |format|
      format.html do
        render :template => "shared/error_response",:status => ex.status_code, :locals => { :exception => ex }
      end
      format.any(:xml,:json) do
        render plain: nil, :status => ex.status_code
      end
    end
  end

  def name
    self.class.to_s.gsub("Controller", "")
  end

  def set_locale
    if user_signed_in?
      I18n.locale = (selected_locale || current_user.locale || I18n.default_locale)
    end
    page_direction(I18n.locale)
  end

  def load_system_settings
    @system_settings ||= SystemSettings.current
  end

  def clean_params(param)
    param.reject{|value| value.blank?}
  end

  def encrypt_data_to_zip(data, data_filename, password)
    #TODO: The encrypted zipfile is corrupt when data is "". Fix it.
    enc_filename = CleansingTmpDir.temp_file_name

    encrypt = password ? Zip::TraditionalEncrypter.new(password): nil

    Zip::OutputStream.open(enc_filename, encrypt) do |out|
      out.put_next_entry(data_filename)
      out.write data
    end

    send_file enc_filename, :filename => "#{data_filename}.zip", :disposition => "inline", :type => 'application/zip'
  end

  def filter_params_array_duplicates
    controller = params["controller"].singularize
    if params[controller]
      params[controller].each do |key, value|
        if value.kind_of?(Array)
          params[controller][key] = value.uniq
        end
      end
    end
    params
  end

  def filter_params_by_permission
    controller = params['controller'].singularize

    if params[controller].present? && !can?(:remove_assigned_users, model_class)
      params[controller].delete 'assigned_user_names'
    end
  end

  class << self
    attr_accessor :model_class
  end

  def model_class
    self.class.model_class
  end

  def is_mobile?
    if request.present?
      @is_mobile ||= (/Android/i.match(request.user_agent) || (/Android/i && /mobile/i).match(request.user_agent)).present?
    else
      false
    end
  end

  private

  def permit_all_params
    params.permit!
  end

  def with_timezone
    timezone = Time.find_zone(cookies[:timezone])
    Time.use_zone(timezone) { yield }
  end

  def selected_locale
    params['locale'] if params['locale'].present? && Primero::Application::LOCALES.include?(params['locale'])
  end

  def page_direction(locale)
    @page_direction = Primero::Application::RTL_LOCALES.include?(locale.to_s) ? 'rtl' : 'lrt'
  end

  #TODO: This is a hack to get rid of empty values that sneak in due to this Rails select Gotcha:
  #      http://api.rubyonrails.org/classes/ActionView/Helpers/FormOptionsHelper.html#method-i-select
  #      We are trying to handle it in assets/javascripts/chosen.js and this is probably the best way to deal on refactor,
  #      but currently I don't want to sneeze on any card houses.
  def sanitize_multiselect_params(form = nil, sanitize_params = [])
    if form.present? && params[form].present?
      sanitize_params.each do |param|
        if params[form][param].is_a? Array
          params[form][param].reject!{ |p| p.blank? }
        else
          params[form][param] = nil
        end
      end
    end
  end
end
