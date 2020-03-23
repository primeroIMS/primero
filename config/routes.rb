Primero::Application.routes.draw do
  match '/' => 'home#index', :as => :root, :via => :get
  match '/_notify_change' => 'couch_changes#notify', :via => :get

  match "/404", :to => "errors#not_found", :via => :all
  match "/500", :to => "errors#internal_server_error", :via => :all

#######################
# USER URLS
#######################

  resources :users do
    collection do
      get :change_password
      get :unverified
      post :update_password
      post :import_file
    end
  end
  match '/users/register_unverified' => 'users#register_unverified', :as => :register_unverified_user, :via => :post

  resources :sessions, :except => :index
  match 'login' => 'sessions#new', :as => :login, :via => [:post, :get, :put, :delete]
  match 'logout' => 'sessions#destroy', :as => :logout, :via => [:post, :get, :put, :delete]
  match '/active' => 'sessions#active', :as => :session_active, :via => [:post, :get, :put, :delete]

  resources :user_preferences
  resources :password_recovery_requests, :only => [:new, :create]
  match 'password_recovery_request/:password_recovery_request_id/hide' => 'password_recovery_requests#hide', :as => :hide_password_recovery_request, :via => :delete

  resources :contact_information

  resources :system_settings, only: [:show, :edit, :update]
  resources :saved_searches, only: [:create, :index, :show, :destroy]
  resources :matching_configurations, only: [:show, :edit, :update]
  resources :duplicates, as: :duplicates, only: [:index]

  resources :roles do
    collection do
      post :import_file
    end
  end

  match '/roles/:id/copy' => 'roles#copy', :as => :copy_role, :via => [:post]

  resources :user_groups
  resources :primero_modules
  resources :primero_programs
  resources :agencies do
    collection do
      post :update_order
    end
  end

#######################
# CHILD URLS
#######################

  resources :children do
    collection do
      post :import_file
      get :search
    end

    resources :attachments, :only => :show
    resource :duplicate, :only => [:new, :create]
  end

  resources :children, as: :cases, path: :cases do
    collection do
      post :import_file
      post :transition
      post :mark_for_mobile
      post :approve_form
      post :add_note
      put :request_transfer
      get :search
      get :consent_count
    end

    member do
      put :match_record
      put :transfer_status
    end

    resources :attachments, :only => :show
    resource :duplicate, :only => [:new, :create]
  end

#######################
# TRACING REQUESTS URLS
#######################
  resources :tracing_requests, as: :tracing_requests, path: :tracing_requests do
    collection do
      post :import_file
      get :search
    end

    resources :attachments, :only => :show
  end


  match '/children-ids' => 'child_ids#all', :as => :child_ids, :via => [:post, :get, :put, :delete]
  match '/children/:id/photo/edit' => 'children#edit_photo', :as => :edit_photo, :via => :get
  match '/children/:id/photo' => 'children#update_photo', :as => :update_photo, :via => :put
  match '/children/:child_id/photos_index' => 'child_media#index', :as => :photos_index, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/photos' => 'child_media#manage_photos', :as => :manage_photos, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/document/:document_id' => 'child_media#download_document', :as => :child_document, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/audio(/:id)' => 'child_media#download_audio', :as => :child_audio, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/photo/:photo_id' => 'child_media#show_photo', :as => :child_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/photo' => 'child_media#show_photo', :as => :child_legacy_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/select_primary_photo/:photo_id' => 'children#select_primary_photo', :as => :child_select_primary_photo, :via => :put
  match '/children/:child_id/resized_photo/:size' => 'child_media#show_resized_photo', :as => :child_legacy_resized_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/photo/:photo_id/resized/:size' => 'child_media#show_resized_photo', :as => :child_resized_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/thumbnail(/:photo_id)' => 'child_media#show_thumbnail', :as => :child_thumbnail, :via => [:post, :get, :put, :delete]
  match '/children' => 'children#index', :as => :child_filter, :via => [:post, :get, :put, :delete]

  match '/agency/:agency_id/logo/:logo_id' => 'agency_media#show_logo', :as => :agency_logo, :via => [:get]

  match '/case-ids' => 'child_ids#all', :as => :case_ids, :via => [:post, :get, :put, :delete]
  match '/cases/:id/photo/edit' => 'children#edit_photo', :as => :edit_case_photo, :via => :get
  match '/cases/:id/photo' => 'children#update_photo', :as => :update_case_photo, :via => :put
  match '/cases/:child_id/photos_index' => 'child_media#index', :as => :case_photos_index, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/photos' => 'child_media#manage_photos', :as => :manage_case_photos, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/audio(/:id)' => 'child_media#download_audio', :as => :case_audio, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/photo/:photo_id' => 'child_media#show_photo', :as => :case_photo, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/photo' => 'child_media#show_photo', :as => :case_legacy_photo, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/select_primary_photo/:photo_id' => 'children#select_primary_photo', :as => :case_select_primary_photo, :via => :put
  match '/cases/:child_id/resized_photo/:size' => 'child_media#show_resized_photo', :as => :case_legacy_resized_photo, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/photo/:photo_id/resized/:size' => 'child_media#show_resized_photo', :as => :case_resized_photo, :via => [:post, :get, :put, :delete]
  match '/cases/:child_id/thumbnail(/:photo_id)' => 'child_media#show_thumbnail', :as => :case_thumbnail, :via => [:post, :get, :put, :delete]
  match '/cases' => 'children#index', :as => :case_filter, :via => [:post, :get, :put, :delete]
  match '/cases/:id/hide_name' => 'children#hide_name', :as => :child_hide_name, :via => :post

  match '/incident-ids' => 'incident_ids#all', :as => :incident_ids, :via => [:post, :get, :put, :delete]

#Route to create a Incident from a Case, this is mostly for the show page. User can create from the edit as well which goes to the update controller.
  match '/cases/:child_id/create_incident' => 'children#create_incident', :as => :child_create_incident, :via => :get
  match '/cases/:child_id/create_subform' => 'children#create_subform', :as => :child_create_subform, :via => :get
  match '/cases/:child_id/save_subform' => 'children#save_subform', :as => :child_save_subform, :via => [:post, :put]
  match '/cases/:child_id/quick_view' => 'children#quick_view', :as => :child_quick_view, :via => :get
  match '/cases/:child_id/request_transfer_view' => 'children#request_transfer_view', :as => :request_transfer_view, :via => :get


#Flag routing
  match '/cases/:id/flag' => 'record_flag#flag', :as => :child_flag, model_class: 'Child', :via => [:post, :put]
  match '/incidents/:id/flag' => 'record_flag#flag', :as => :incident_flag, model_class: 'Incident', :via => [:post, :put]
  match '/tracing_requests/:id/flag' => 'record_flag#flag', :as => :tracing_request_flag, model_class: 'TracingRequest', :via => [:post, :put]

#Flag multiple records routing
  match '/cases/flag_records' => 'record_flag#flag_records', :as => :child_flag_records, :model_class => 'Child', :via => [:post, :put]
  match '/incidents/flag_records' => 'record_flag#flag_records', :as => :incident_flag_records, :model_class => 'Incident', :via => [:post, :put]
  match '/tracing_requests/flag_records' => 'record_flag#flag_records', :as => :tracing_request_flag_records, :model_class => 'TracingRequest', :via => [:post, :put]

# Set Record Status
  match '/cases/record_status' => 'record_status#set_record_status', :as => :child_record_status, :model_class => 'Child', :via => [:post, :put]
  match '/incidents/record_status' => 'record_status#set_record_status', :as => :incident_record_status, :model_class => 'Incident', :via => [:post, :put]
  match '/tracing_requests/record_status' => 'record_status#set_record_status', :as => :tracing_request_record_status, :model_class => 'TracingRequest', :via => [:post, :put]

  # Set Case Status on reopening
  match '/cases/:id/reopen_case' => 'children#reopen_case', :as => :child_reopen_case, :model_class => 'Child', :via => [:post, :put]
  match '/cases/:id/request_approval' => 'children#request_approval', :as => :child_request_approval, :model_class => 'Child', :via => [:post, :put]
  match '/cases/:id/transfer_status' => 'children#transfer_status', :as => :child_transfer_status, :model_class => 'Child', :via => [:post, :put]
  match '/cases/:id/relinquish_referral' => 'children#relinquish_referral', :as => :child_relinquish_referral, :model_class => 'Child', :via => [:post, :put]

  # Download forms spreadsheet
  match '/forms/download' => 'form_section#download_all_forms', :as => :download_forms, :via => [:get]

  #Unflag routing
  match '/cases/:id/unflag' => 'record_flag#unflag', :as => :child_unflag, model_class:'Child', :via => [:post, :put]
  match '/incidents/:id/unflag' => 'record_flag#unflag', :as => :incident_unflag, model_class:'Incident', :via => [:post, :put]
  match '/tracing_requests/:id/unflag' => 'record_flag#unflag', :as => :tracing_request_unflag, model_class:'TracingRequest', :via => [:post, :put]

  match '/tracing_requests-ids' => 'tracing_request_ids#all', :as => :tracing_request_ids, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:id/photo/edit' => 'tracing_requests#edit_photo', :as => :edit_tracing_requests_photo, :via => :get
  match '/tracing_requests/:id/photo' => 'tracing_requests#update_photo', :as => :update_tracing_requests_photo, :via => :put
  match '/tracing_requests/:tracing_request_id/photos_index' => 'tracing_request_media#index', :as => :tracing_request_photos_index, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/photos' => 'tracing_request_media#manage_photos', :as => :manage_tracing_request_photos, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/document/:document_id' => 'tracing_request_media#download_document', :as => :tracing_request_document, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/audio(/:id)' => 'tracing_request_media#download_audio', :as => :tracing_request_audio, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/photo/:photo_id' => 'tracing_request_media#show_photo', :as => :tracing_request_photo, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/photo' => 'tracing_request_media#show_photo', :as => :tracing_request_legacy_photo, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/select_primary_photo/:photo_id' => 'tracing_requests#select_primary_photo', :as => :tracing_requests_select_primary_photo, :via => :put
  match '/tracing_requests/:tracing_request_id/resized_photo/:size' => 'tracing_request_media#show_resized_photo', :as => :tracing_request_legacy_resized_photo, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/photo/:photo_id/resized/:size' => 'tracing_request_media#show_resized_photo', :as => :tracing_request_resized_photo, :via => [:post, :get, :put, :delete]
  match '/tracing_requests/:tracing_request_id/thumbnail(/:photo_id)' => 'tracing_request_media#show_thumbnail', :as => :tracing_request_thumbnail, :via => [:post, :get, :put, :delete]
  match '/tracing_requests' => 'tracing_requests#index', :as => :tracing_request_filter, :via => [:post, :get, :put, :delete]

#######################
# RECORD HISTORIES URLS
#######################
  match '/cases/:id/change_log' => 'record_histories#record_change_log', :as => :child_record_change_log, model_class: 'Child', :via => [:get]
  match '/incidents/:id/change_log' => 'record_histories#record_change_log', :as => :incident_record_change_log, model_class: 'Incident', :via => [:get]
  match '/tracing_requests/:id/change_log' => 'record_histories#record_change_log', :as => :tracing_request_record_change_log, model_class: 'TracingRequest', :via => [:get]

#######################
# INCIDENT URLS
#######################
  resources :incidents do
    collection do
      # post :sync_unverified
      post :import_file
      post :mark_for_mobile
      # get :advanced_search
      get :search
    end

    # resources :attachments, :only => :show
    # resource :duplicate, :only => [:new, :create]
  end

  match '/incidents/:incident_id/document/:document_id' => 'incident_media#download_document', :as => :incident_document, :via => [:post, :get, :put, :delete]
  match '/incidents/:incident_id/create_cp_case_from_individual_details/:individual_victims_subform_section' => 'incidents#create_cp_case_from_individual_details', :as => :create_cp_case_from_individual_details, :via => [:post, :get]

#######################
# POTENTIAL MATCHES URLS
#######################
  resources :potential_matches do
    collection do
      post :import_file
      get :quick_view
    end
  end
  # match '/potential_matches/:method' => 'potential_matches#index', :as => :potential_matches_method, :via => [:post, :get, :put, :delete]



  resources :bulk_exports, only: [:index, :show]
  resources :tasks, only: [:index]


#######################
# FORM SECTION URLS
#######################

  resources :form_sections, :path => 'forms', :controller => 'form_section' do
    collection do
      match 'save_order', :via => [:post, :get, :put, :delete]
      match 'toggle', :via => [:post, :get, :put, :delete]
      match 'published', :via => [:post, :get, :put, :delete]
      post :import_file
    end

    resources :fields, :controller => 'fields' do
      collection do
        post 'save_order'
        post 'delete'
        post 'toggle_fields'
        post 'change_form'
      end
    end
  end

  resources :highlight_fields do
    collection do
      post :remove
    end
  end

  match '/published_form_sections', :to => 'form_section#published', :via => [:post, :get, :put, :delete]


#######################
# API URLS
#######################

  scope '/api', defaults: { format: :json }, constraints: { format: :json } do
    #Session API
    post :login, to: 'sessions#create'
    post :logout, to: 'sessions#destroy'

    #Forms API
    resources :form_sections, controller: 'form_section', only: [:index]
    resources :form_sections, controller: 'form_section', as: :forms, path: :forms, only: [:index]

    #Records API
    resources :children
    resources :children, as: :cases, path: :cases
    resources :incidents, as: :incidents
    resources :tracing_requests, as: :tracing_requests
    resources :potential_matches, as: :potential_matches
    resources :options, :only => [:index]
    resources :system_settings, :only => [:index]

    #User API
    get :users, to: 'users#search'

    #Agency API
    get :agencies, to: 'agencies#search'

  end

#######################
# ADVANCED SEARCH URLS
#######################

  resources :advanced_search, :only => [:index, :new]
  match 'advanced_search/index', :to => 'advanced_search#index', :via => [:post, :get, :put, :delete]
  match 'advanced_search/export_data' => 'advanced_search#export_data', :as => :export_data_children, :via => :post


  match 'configuration_bundle/export', :to => 'configuration_bundle#export_bundle', :via => [:get, :post]
  match 'configuration_bundle/import', :to => 'configuration_bundle#import_bundle', :via => [:post]


#######################
# LOGGING URLS
#######################

  resources :system_logs, :only => :index
  match '/children/:id/history' => 'child_histories#index', :as => :child_history, :via => :get
  match '/incidents/:id/history' => 'incident_histories#index', :as => :incident_history, :via => :get
  match '/tracing_requests/:id/history' => 'tracing_request_histories#index', :as => :tracing_request_history, :via => :get
  match '/cases/:id/history' => 'child_histories#index', :as => :cases_history, :via => :get
  match '/users/:id/history' => 'user_histories#index', :as => :user_history, :via => :get

  resources :audit_logs, only: [:index]

#######################
# REPLICATION URLS
#######################
  resources :replications do
    collection do
      post :configuration
      post :update_blacklist
    end

    member do
      post :start
      post :stop
    end
  end

  resources :system_users, :path => "/admin/system_users"

#######################
# REPORTING URLS
#######################
  resources :reports do
    member do
      get :graph_data
      #put :rebuild
    end
    collection do
      get :permitted_field_list
      get :lookups_for_field
    end
  end

#######################
# CUSTOM EXPORT URLS
#######################
  resources :custom_exports do
    collection do
      get :permitted_forms_list
      get :permitted_fields_list
      get :export
    end
  end

#######################
# LOOKUPS URLS
#######################
  resources :lookups

#######################
# LOCATION URLS
#######################
  resources :locations


end
