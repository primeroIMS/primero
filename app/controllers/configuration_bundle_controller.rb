class ConfigurationBundleController < ApplicationController
  include LoggerActions
  def export_bundle
    cookies[:download_status_finished] = true
    encrypt_data_to_zip(ConfigurationBundle.export_as_json, export_filename, params[:password])
  end

  def export_filename
    if params[:custom_export_file_name].present?
      "#{params[:custom_export_file_name]}.json"
    else
      "configuration-bundle-#{request.host}.json"
    end
  end

  def import_bundle
    file = params[:import_file]
    if file.nil?
      flash[:error] = "Please specify a file to import!"
      redirect_to :action => :index, :controller => :users and return
    end

    model_data = Importers::JSONImporter.import(params[:import_file])
    ConfigurationBundle.import(model_data, current_user.user_name)

    # TODO: modify the redirect if this ever gets it own page
    flash[:notice] = t('imports.successful')
    redirect_to :action => :index, :controller => :users and return
  end
end
