source 'https://rubygems.org'

ruby '2.2.0'

gem 'rails', '4.1.9'

gem 'less-rails'

gem 'therubyracer'

gem 'uglifier', '>= 1.3.0'

gem 'jbuilder', '~> 2.0'

gem 'devise'

gem 'jquery-rails'

gem 'pg', '~> 0.17.0'

gem 'role_model'

gem 'sidekiq', '~>3.3.0'
gem 'sinatra', require: false

gem 'activeadmin', github: 'activeadmin/active_admin'

gem 'kaminari'

gem 'faker'

gem 'geocoder'

group :development, :test do
  gem 'rspec-rails', '~> 2.14.0'
  gem 'guard-rspec'
  gem 'spring'
  gem 'factory_girl_rails'
  gem 'launchy'
  gem 'timecop'
end

group :test do
  gem 'fog'
  gem 'webmock', '1.12'
  gem 'vcr'
  gem 'poltergeist'
  gem 'database_cleaner', '< 1.1.0'
  gem 'webrat'
  gem 'email_spec'
  gem 'rspec-sidekiq'
end

group :development do
  gem 'letter_opener'
end

group :production do
  gem 'unicorn'
  gem 'heroku_rails_deflate'
  gem 'rails_12factor'
end