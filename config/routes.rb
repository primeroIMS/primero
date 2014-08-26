RapidFTR::Application.routes.draw do

  match '/' => 'home#index', :as => :root, :via => :get

#######################
# USER URLS
#######################

  resources :users do
    collection do
      get :change_password
      get :unverified
      post :update_password
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

  resources :devices
  match 'devices/update_blacklist' => 'devices#update_blacklist', :via => :post

  resources :roles
  match 'admin' => 'admin#index', :as => :admin, :via => [:post, :get, :put, :delete]
  match 'admin/update' => 'admin#update', :as => :admin_update, :via => [:post, :get, :put, :delete]


#######################
# CHILD URLS
#######################

  resources :children do
    collection do
      post :sync_unverified
      post :reindex
      get :advanced_search
      get :search
    end

    resources :attachments, :only => :show
    resource :duplicate, :only => [:new, :create]
  end

  resources :children, as: :cases, path: :cases do
    collection do
      post :sync_unverified
      post :reindex
      get :advanced_search
      get :search
    end

    resources :attachments, :only => :show
    resource :duplicate, :only => [:new, :create]
  end
  
  #######################
  # TRACING REQUESTS URLS
  #######################  
  resources :tracing_requests, as: :tracing_requests, path: :tracing_requests do
    collection do
      # post :sync_unverified
      post :reindex
      # get :advanced_search
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
  match 'children/:child_id/select_primary_photo/:photo_id' => 'children#select_primary_photo', :as => :child_select_primary_photo, :via => :put
  match '/children/:child_id/resized_photo/:size' => 'child_media#show_resized_photo', :as => :child_legacy_resized_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/photo/:photo_id/resized/:size' => 'child_media#show_resized_photo', :as => :child_resized_photo, :via => [:post, :get, :put, :delete]
  match '/children/:child_id/thumbnail(/:photo_id)' => 'child_media#show_thumbnail', :as => :child_thumbnail, :via => [:post, :get, :put, :delete]
  match '/children' => 'children#index', :as => :child_filter, :via => [:post, :get, :put, :delete]

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
  match '/cases/:child_id/hide_name' => 'children#hide_name', :as => :child_hide_name, :via => :post

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
# INCIDENT URLS
#######################  
  resources :incidents do
    collection do
      # post :sync_unverified
      post :reindex
      # get :advanced_search
      get :search
    end

    # resources :attachments, :only => :show
    # resource :duplicate, :only => [:new, :create]
  end

#######################
# API URLS
#######################

  namespace :api do
    controller :device do
      get 'is_blacklisted/:imei', :action => 'is_blacklisted'
    end

    controller :sessions, :defaults => {:format => :json} do
      post :login
      post :register
      post :logout
    end

    # CHILDREN

    resources :children do
      collection do
        delete "/destroy_all" => 'children#destroy_all'
        get :ids, :defaults => {:format => :json}
        post :unverified, :defaults => {:format => :json}
      end

      member do
        controller :child_media do
          get 'photo(/:photo_id)', :action => 'show_photo'
          get 'audio(/:audio_id)', :action => 'download_audio'
        end
      end
    end

    resources :children, as: :cases, path: :cases do
      collection do
        delete "/destroy_all" => 'children#destroy_all'
        get :ids, :defaults => {:format => :json}
        post :unverified, :defaults => {:format => :json}
      end

      member do
        controller :child_media do
          get 'photo(/:photo_id)', :action => 'show_photo'
          get 'audio(/:audio_id)', :action => 'download_audio'
        end
      end
    end

    # ENQUIRIES

    resources :enquiries, :defaults => {:format => :json} do
      collection do
        delete "/destroy_all" => 'enquiries#destroy_all'
      end
    end
  end

#######################
# FORM SECTION URLS
#######################

  resources :form_sections, :path => 'forms', :controller => 'form_section' do
    collection do
      match 'save_order', :via => [:post, :get, :put, :delete]
      match 'toggle', :via => [:post, :get, :put, :delete]
      match 'published', :via => [:post, :get, :put, :delete]
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
# ADVANCED SEARCH URLS
#######################

  resources :advanced_search, :only => [:index, :new]
  match 'advanced_search/index', :to => 'advanced_search#index', :via => [:post, :get, :put, :delete]
  match 'advanced_search/export_data' => 'advanced_search#export_data', :as => :export_data_children, :via => :post


#######################
# LOGGING URLS
#######################

  resources :system_logs, :only => :index
  match '/children/:id/history' => 'child_histories#index', :as => :child_history, :via => :get
  match '/incidents/:id/history' => 'incident_histories#index', :as => :incident_history, :via => :get
  match '/tracing_requests/:id/history' => 'tracing_request_histories#index', :as => :tracing_request_history, :via => :get
  match '/cases/:id/history' => 'child_histories#index', :as => :cases_history, :via => :get
  match '/users/:id/history' => 'user_histories#index', :as => :user_history, :via => :get


#######################
# REPLICATION URLS
#######################

  resources :replications, :path => "/devices/replications" do
    collection do
      post :configuration
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
  resources :reports, :only => [:index, :show]

#######################
# TESTING URLS
#######################
  match 'database/delete_children' => 'database#delete_children', :via => :delete
  match 'database/delete_cases' => 'database#delete_cases', :via => :delete

end