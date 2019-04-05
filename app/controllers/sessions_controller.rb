class SessionsController < ApplicationController

  skip_before_action :check_authentication, :only => %w{new create active}

  @model_class = Session

  include LoggerActions

  # GET /sessions/1
  # GET /sessions/1.xml
  def show
    #logger.debug( cookies.inspect )
    logger.debug( "Authorization header: #{request.headers['Authorization']}" )
    @session = Session.get(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml
      format.json do
        render_session_as_json(@session)
      end
    end
  end

  # GET /sessions/new
  # GET /sessions/new.xml
  def new
    I18n.locale = I18n.default_locale
    unless (@session = current_session).nil?
      return redirect_to(root_path)
    end

    @session = Session.new(params[:login].to_h)

    @page_name = t("login.label")

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @session }
    end
  end

  # POST /sessions
  # POST /sessions.xml
  def create
    @login = Login.new(params.to_h)
    @session = @login.authenticate_user

    if not @session
      respond_to do |format|
        handle_login_error(t("session.invalid_credentials"), format)
      end

      return
    end

    respond_to do |format|
      if @session.save
        redirect_to_referred_path = session[:stored_location]
        reset_session
        session[:rftr_session_id] = @session.id
        format.html { redirect_to(redirect_to_referred_path || root_path) }
        format.xml  { render :action => "show", :status => :created, :location => @session }
        format.json { render_session_as_json(@session,:status => :created, :location => @session) }
      else
        handle_login_error(t("session.login_error"), format)
      end
    end
  end

  # PUT /sessions/1
  # PUT /sessions/1.xml


  # DELETE /sessions/1
  # DELETE /sessions/1.xml
  def destroy
    @session = current_session
    @session.destroy if @session
    reset_session

    respond_to do |format|
      format.html { redirect_to(:login) }
      format.xml  { head :ok }
      format.json { head :ok }
    end
  end

  def active
    render plain: 'OK'
  end

  private
  def handle_login_error(notice, format)
    #Do a random wait to discourage brute force attacks
    wait_seconds = rand(3) + 3
    sleep wait_seconds

    format.html {
      flash[:error] = notice
      redirect_to :action => "new" }
    format.xml  { render :xml => errors, :status => :unprocessable_entity }
    format.json { head :unauthorized }
  end

  def render_session_as_json(session,options = {})
    user = User.find_by_user_name(session.user_name)
    json = {
      :session => {
        :token => session.token,
        :link => {
          :rel => 'session',
          :uri => session_path(session)
        }
      },
      :organization => user.organization,
      :module_ids => user.module_ids,
      :role_ids => user.role_ids,
      :language => user.locale || I18n.default_locale,
      :verified => user.verified?
    }
    render( options.merge( :json => json ) )
  end

  #Override methods in LoggerActions.
  def logger_action_name
    if action_name == 'create'
      'login'
    elsif action_name == 'destroy'
      'logout'
    else
      super
    end
  end

  def logger_action_identifier
    nil
  end

  def logger_model_titleize
    nil
  end

  def by_action_user
    if action_name == 'create'
      params[:user_name].present? ? "#{I18n.t("logger.by_user", :locale => :en)} '#{params[:user_name]}'" : ''
    else
      super
    end
  end

end
