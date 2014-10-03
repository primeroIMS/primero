class ReplicationsController < ApplicationController

  before_filter :load_replication

  skip_before_filter :verify_authenticity_token, :only => [ :configuration, :start, :stop ]
  skip_before_filter :check_authentication, :only => :configuration

  def configuration
    CouchSettings.instance.authenticate params[:user_name], params[:password]
    render :json => Replication.couch_config
  end

  #TODO - PRIMERO-382 - this was pulled over from the devices controller
  def index
    @page_name = t("replications")
    if can? :read, Replication
      @replications = Replication.all
    end
    if can? :read, Device
      @devices = Device.view("by_imei")
    end
  end

  def new
    authorize! :create, Replication
    @page_name = t("replication.create")
    @replication = Replication.new
  end

  def create
    authorize! :create, Replication
    @replication = Replication.new params[:replication]

    if @replication.save
      redirect_to replications_path
    else
      render :new
    end
  end

  def edit
    authorize! :edit, @replication
  end

  def update
    authorize! :update, @replication
    @replication.update_attributes params[:replication]

    if @replication.save
      redirect_to replications_path
    else
      render :edit
    end
  end

  def destroy
    authorize! :destroy, @replication
    @replication.destroy
    redirect_to replications_path
  end

  def start
    authorize! :start, @replication
    @replication.start_replication
    redirect_to replications_path
  end

  def stop
    authorize! :stop, @replication
    @replication.stop_replication
    redirect_to replications_path
  end

  def show
    authorize! :show, @replication
  end

  #TODO - PRIMERO-382 - pulled over from devices_controller
  def update_blacklist
    authorize! :update, Device
    status = :ok
    @devices = Device.find_by_device_imei(params[:imei])
    @devices.each do |device|
      unless device.update_attributes({:blacklisted => params[:blacklisted] == "true"})
        status = :error
      end
    end
    render :json => {:status => status}
  end

  private

  def load_replication
    @replication = Replication.get params[:id] if params[:id]
  end

end
