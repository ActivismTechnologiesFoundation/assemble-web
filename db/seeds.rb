# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

ApiKey.find_or_create_by!(app_id: "web_app_id")


(1..100).each do 
  Event.create!(
    name: Faker::Lorem.words(rand(3..5)).join(" "),
    topic: Faker::Lorem.word,
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
end