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


  namespace :api do
    namespace :v2, defaults: { format: :json }, constraints: { format: :json }, only: [:index, :create, :show, :update, :destroy ] do

      resources :children, as: :cases, path: :cases do
        resources :flags, only: [:index, :create, :update]
      end

      resources :incidents do
        resources :flags, only: [:index, :create, :update]
      end
      resources :tracing_requests do
        resources :flags, only: [:index, :create, :update]
      end
      resources :form_sections, as: :forms, path: :forms
      resources :users
      resources :contact_information, only: [:index]
      resources :system_settings, only: [:index]
      resources :tasks, only: [:index]
      resources :saved_searches, only: [:index, :create, :destroy]
      resources :reports, only: [:index, :show]
      match ':record_type/flags' => 'flags#create_bulk', via: [ :post ]
    end
  end

end
