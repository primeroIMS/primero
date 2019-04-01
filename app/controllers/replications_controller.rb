class ReplicationsController < ApplicationController

  before_action :load_replication

  skip_before_action :verify_authenticity_token, :only => [ :configuration, :start, :stop ]
  skip_before_action :authenticate_user!, :only => :configuration

  @model_class = Replication

  include LoggerActions

  def configuration
    begin
      CouchSettings.instance.authenticate params[:user_name], params[:password]
    rescue RestClient::Unauthorized
      render :json => {'error' => 'invalid user name or password'}, :status => 401
    else
      render :json => Replication.couch_config
    end
  end

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
    @replication = Replication.new params[:replication].to_h

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
    @replication.update_attributes params[:replication].to_h

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

  private

  def load_replication
    @replication = Replication.get params[:id] if params[:id]
  end

end
