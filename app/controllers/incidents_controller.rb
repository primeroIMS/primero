class IncidentsController < ApplicationController
  
  def index
    @incidents = Incident.all
  end
  
  
  def show
    @incident = Incident.find_by_incident_id(params[:incident_id])
    @form_sections = get_form_sections
  end
  
  def new
    #authorize! :create, Incident
    
    @incident = Incident.new
    @form_sections = get_form_sections 
    respond_to do |format|
      format.html
      format.xml { render :xml => @incident }
    end   
  end
  
  def create
    #authorize! :create, Incident
    params[:incident] = JSON.parse(params[:incident]) if params[:incident].is_a?(String)
    #create_or_update_incident(params[:incident])
    
    #TODO - testing
    @incident = Incident.new(incident_params)
    @incident['created_by_full_name'] = current_user_full_name

    respond_to do |format|
      if @incident.save
        flash[:notice] = t('incident.messages.creation_success')
        format.html { redirect_to(incident_path(@incident, { follow: true })) }
        #format.xml { render :xml => @incident, :status => :created, :location => @child }
        format.json {
          render :json => @incident.compact.to_json
        }
      else
        format.html {
          @form_sections = get_form_sections

          # TODO: (Bug- https://quoinjira.atlassian.net/browse/PRIMERO-161) This render redirects to the /children url instead of /cases
          render :action => "new"
        }
        format.xml { render :xml => @incident.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  private
  
  def get_form_sections
    FormSection.find_by_parent_form("incident")
  end

  #TODO - this is for testing.
  def incident_params
    params.require(:incident).permit(:incident_id, :description)
  end
 
end