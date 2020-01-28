Rails.application.routes.draw do
  root to: 'home#v2'

  scope :v2 do
    get '/', to: 'home#v2'
    get '*all', to: 'home#v2'
  end

  devise_for :users, class_name: 'User',
             path: '/api/v2/tokens',
             controllers: { sessions: 'api/v2/tokens' }, only: :sessions,
             path_names: { sign_in: '', sign_out: '' },
             sign_out_via: :delete,
             defaults: { format: :json }, constraints: { format: :json }

  resources :login, only: [:index]

  namespace :api do
    namespace :v2, defaults: { format: :json },
                   constraints: { format: :json },
                   only: [:index, :create, :show, :update, :destroy ] do

      resources :children, as: :cases, path: :cases do
        resources :flags, only: [:index, :create, :update]
        resources :assigns, only: [:index, :create]
        resources :referrals, only: [:index, :create, :destroy]
        resources :transfers, only: [:index, :create, :update]
        resources :transfer_requests, only: [:index, :create, :update]
        resources :transitions, only: [:index]
        collection do
          post :flags, to: 'flags#create_bulk'
          post :assigns, to: 'assigns#create_bulk'
          post :referrals, to: 'referrals#create_bulk'
          post :transfers, to: 'transfers#create_bulk'
        end
        resources :approvals, only: [:update]
      end

      resources :incidents do
        resources :flags, only: [:index, :create, :update]
        post :flags, to: 'flags#create_bulk', on: :collection
        resources :approvals, only: [:update]
      end

      resources :tracing_requests do
        resources :flags, only: [:index, :create, :update]
        post :flags, to: 'flags#create_bulk', on: :collection
        resources :approvals, only: [:update]
      end

      resources :form_sections, as: :forms, path: :forms
      resources :users do
        collection do
          get :'assign-to', to: 'users_transitions#assign_to'
          get :'transfer-to', to: 'users_transitions#transfer_to'
          get :'refer-to', to: 'users_transitions#refer_to'
        end
      end
      resources :identity_providers, only: [:index]
      resources :dashboards, only: [:index]
      resources :contact_information, only: [:index]
      resources :system_settings, only: [:index]
      resources :tasks, only: [:index]
      resources :saved_searches, only: [:index, :create, :destroy]
      resources :reports, only: [:index, :show]
      resources :lookups
      resources :locations
      resources :bulk_exports, as: :exports, path: :exports, only: [:index, :show, :create, :destroy]
      get 'alerts', to: 'alerts#bulk_index'
      resources :agencies
      resources :roles

    end
  end

end
