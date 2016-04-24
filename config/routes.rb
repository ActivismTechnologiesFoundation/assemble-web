require 'sidekiq/web'
require 'api_constraints'

Rails.application.routes.draw do

  root 'static_pages#landing_page'
  
  get 'contact'           => 'static_pages#contact'
  get 'about'             => 'static_pages#about'
  get 'terms-of-service'  => 'static_pages#terms_of_service'
  get 'privacy-policy'    => 'static_pages#privacy_policy'
  get 'contact'           => 'static_pgaes#contact'

  get 'events'            => 'events#index'
  get 'upload/:token'            => 'events#upload'


#######################################################
  # Uncomment block to restrict access to admins 
  # (requires devise and role_models are implemented)
  
  # authenticate :user, lambda { |u| u.is?(:admin) } do
    mount Sidekiq::Web => '/sidekiq'
  # end
#######################################################


  namespace :api, defaults: {format: ['json']} do
    scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
      get  'topics'             => 'topics#index'

      post 'events/bulk_upload' => 'events#bulk_upload'      
      post 'events'             => 'events#create'
      put  'events'             => 'events#update'
      get  'events'             => 'events#index'

      get  'zipcodes/validate'  => 'zipcodes#validate'
    end
  end
end
