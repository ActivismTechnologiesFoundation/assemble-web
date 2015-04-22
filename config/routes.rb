require 'sidekiq/web'
require 'api_constraints'

Rails.application.routes.draw do

  root 'static_pages#landing_page'

  get 'events' => 'events#index'

#######################################################
  # Uncomment block to restrict access to admins 
  # (requires devise and role_models are implemented)
  
  # authenticate :user, lambda { |u| u.is?(:admin) } do
    mount Sidekiq::Web => '/sidekiq'
  # end
#######################################################


  namespace :api, defaults: {format: ['json']} do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      get "events" => "events#index"
    end
  end
end
