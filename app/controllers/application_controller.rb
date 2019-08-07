#TODO: This will eventually be am empty class
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, prepend: true, unless: -> { request.format.json? }
  before_action :authorize_profiler
  before_action :authenticate_user!
  around_action :with_timezone

  def authorize_profiler
    Rack::MiniProfiler.authorize_request if ENV['PROFILE']
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

  private

  def with_timezone
    timezone = Time.find_zone(cookies[:timezone])
    Time.use_zone(timezone) { yield }
  end


end
