# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.routes.draw do
  root to: 'home#v2'

  scope :v2 do
    get '/', to: 'home#v2'
    get '*all', to: 'home#v2'
  end

  devise_for(
    :users,
    class_name: 'User',
    path: '/api/v2/tokens',
    controllers: { sessions: 'api/v2/tokens' }, only: :sessions,
    path_names: { sign_in: '', sign_out: '' },
    sign_out_via: :delete,
    defaults: { format: :json }, constraints: { format: :json }
  )

  devise_scope :user do
    get '/v2/password_reset', to: 'home#v2', as: :password_reset
    get '/v2/password_reset_request', to: 'home#v2', as: :password_reset_request
  end

  resources :health, only: %i[index show]
  # rubocop:disable Style/FormatStringToken(RuboCop)
  get 'login/:id', to: redirect(path: '/v2/login/%{id}')
  # rubocop:enable Style/FormatStringToken(RuboCop)

  get 'manifest', to: 'themes#manifest', defaults: { format: :json }
  get :theme, to: 'themes#index', defaults: { format: :js }

  namespace :api do
    namespace :v2, defaults: { format: :json },
                   constraints: { format: :json },
                   only: %i[index create show update destroy] do
      resources :primero, only: %i[index]

      resources :children, as: :cases, path: :cases do
        resources :children_incidents, as: :incidents, path: :incidents, only: %i[index new] do
          post '/', to: 'children_incidents#update_bulk', on: :collection
        end
        resources :flags, only: %i[index create update]
        resources :alerts, only: %i[index destroy]
        resources :assigns, only: %i[index create]
        resources :referrals, only: %i[index create destroy update]
        resources :transfers, only: %i[index create update]
        resources :transfer_requests, only: %i[index create update]
        resources :transitions, only: [:index]
        resources :attachments, only: %i[create destroy update]
        resources :approvals, only: [:update]
        resources :potential_matches, only: [:index]
        resources :webhook_syncs, as: :sync, path: :sync, only: [:create]
        resources :case_relationships, only: %i[index create destroy update]
        get :traces, to: 'children#traces'
        get :record_history, to: 'record_histories#index'
        post :family, to: 'children#create_family'
        collection do
          post :flags, to: 'flags#create_bulk'
          post :assigns, to: 'assigns#create_bulk'
          post :referrals, to: 'referrals#create_bulk'
          post :transfers, to: 'transfers#create_bulk'
        end
      end

      resources :incidents do
        resources :flags, only: %i[index create update]
        resources :alerts, only: %i[index destroy]
        resources :approvals, only: [:update]
        resources :attachments, only: %i[create destroy]
        resources :assigns, only: %i[index create]
        resources :transitions, only: [:index]
        post :flags, to: 'flags#create_bulk', on: :collection
        get :record_history, to: 'record_histories#index'
        get :get_case_to_link, to: 'incidents#get_case_to_link', on: :collection
        collection do
          post :assigns, to: 'assigns#create_bulk'
        end
      end

      resources :tracing_requests do
        resources :flags, only: %i[index create update]
        resources :alerts, only: [:index]
        resources :approvals, only: [:update]
        resources :attachments, only: %i[create destroy]
        get :traces, to: 'tracing_requests#traces'
        post :flags, to: 'flags#create_bulk', on: :collection
        get :record_history, to: 'record_histories#index'
      end

      resources :traces, only: %i[show update] do
        resources :potential_matches, only: %i[index]
      end

      resources :form_sections, as: :forms, path: :forms do
        collection do
          get :export, to: 'form_sections#export'
        end
      end
      resources :users do
        post :'password-reset-request', to: 'password_reset#user_password_reset_request'
        collection do
          get :'assign-to', to: 'users_transitions#assign_to'
          get :'transfer-to', to: 'users_transitions#transfer_to'
          get :'refer-to', to: 'users_transitions#refer_to'
          post :'password-reset-request', to: 'password_reset#password_reset_request'
          post :'password-reset', to: 'password_reset#password_reset'
        end
      end
      resources :identity_providers, only: [:index]
      resources :dashboards, only: [:index]
      resource :contact_information, only: %i[show update], controller: 'contact_information'
      resources :system_settings, only: [:index]
      resources :tasks, only: [:index]
      resources :saved_searches, only: %i[index create destroy]
      resources :reports, only: %i[index show create update destroy]
      resources :lookups
      resources :locations do
        collection do
          post :import, to: 'locations#import'
          post :update_bulk, to: 'locations#update_bulk'
        end
      end
      resources :bulk_exports, as: :exports, path: :exports, only: %i[index show create destroy]
      get 'alerts', to: 'alerts#bulk_index'
      # TODO: Make usage_reports a resourceful route if/when they start getting saved
      get 'usage_reports/current', to: 'usage_reports#show'
      get 'usage_reports/current/export', to: 'usage_reports#export'
      resources :agencies
      resources :webhooks
      resources :roles
      resources :permissions, only: [:index]
      resources :user_groups
      resources :primero_modules, only: %i[index show update]
      resources :audit_logs, only: [:index]
      resources :primero_configurations, as: :configurations, path: :configurations
      resources :flags_owners, as: :flags, path: :flags, only: %i[index]
      resources :key_performance_indicators, path: :kpis, only: [:show]
      resources :codes_of_conduct, only: %i[index create], controller: 'codes_of_conduct'
      resources :activity_log, only: [:index]
      resources :managed_reports, only: %i[index show] do
        collection do
          get :export, to: 'managed_reports#export'
        end
      end
      resources :registry_records do
        resources :flags, only: %i[index create update]
        resources :alerts, only: [:index]
        get :record_history, to: 'record_histories#index'
      end

      resources :families do
        resources :flags, only: %i[index create update]
        resources :alerts, only: [:index]
        post :case, to: 'families#create_case'
        get :record_history, to: 'record_histories#index'
      end

      scope '/webpush' do
        get 'config', action: :config, controller: 'webpush_config'
        patch 'subscriptions/current', action: :current, controller: 'webpush_subscriptions'
        resources :webpush_subscriptions, path: :subscriptions, only: %i[index create]
      end
    end
  end
end
