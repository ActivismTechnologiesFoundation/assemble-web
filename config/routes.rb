require 'sidekiq/web'

Rails.application.routes.draw do

  # Uncomment block to restrict access to admins 
  # (requires devise and role_models are implemented)
  
  # authenticate :user, lambda { |u| u.is?(:admin) } do
    mount Sidekiq::Web => '/sidekiq'
  # end
end
