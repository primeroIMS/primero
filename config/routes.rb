Rails.application.routes.draw do

  devise_for :users, path: '', controllers: { sessions: "sessions" }, path_names: {
    sign_in: 'login',
    sign_out: 'logout'
  }

  devise_scope :user do
    get '/active', to: 'sessions#active'
  end


  root to: 'home#v2'

  match "/404", :to => "errors#not_found", :via => :all
  match "/500", :to => "errors#internal_server_error", :via => :all

  # TODO: Temp route for v2 application
  scope :v2 do
    get '/', to: 'home#v2'
    get '*all', to: 'home#v2'
  end

  namespace :api do
    namespace :v2, defaults: { format: :json }, constraints: { format: :json }, only: [:index, :create, :show, :update, :destroy ] do
      devise_for :tokens, class_name: 'User',
                 controllers: { sessions: 'api/v2/tokens' }, only: :sessions,
                 path_names: { sign_in: '', sign_out: '' },
                 sign_out_via: :delete

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

      match ':record_type/flags' => 'flags#create_bulk', via: [ :post ]
    end
  end

end
