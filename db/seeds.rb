# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

ApiKey.find_or_create_by!(app_id: "web_app_id")

topics = ['social', 'environment', 'gender', 'race', 'animals', 'science', 'business']
topics.each { |t| Topic.create!(name: t) }

(1..100).each do 
  e = Event.create!(
    name: Faker::Lorem.words(rand(3..5)).join(" "),
    description: Faker::Lorem.paragraph,
    address: "#{Faker::Address.street_address},"+
             "#{Faker::Address.secondary_address},"+
             "#{Faker::Address.city},"+
             "#{Faker::Address.state_abbr},"+
             "#{Faker::Address.zip}",
    url: Faker::Internet.url,
    starts_at: Faker::Time.between(Time.now, Time.now + 1.month),
    ends_at: Faker::Time.between(Time.now, Time.now + 1.month)
  )
  e.topics << Topic.find_by(name: topics[rand(topics.count)])
end