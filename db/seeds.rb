# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

ApiKey.find_or_create_by!(app_id: "web_app_id")

topics = [
  'Abortion',
  'Race',
  'Civil Liberties',
  'Environment',
  'War & Peace',
  'Crime & Punishment',
  'Immigration',
  'Gender',
  'LGBTQ',
  'Economics',
  'Guns',
  'Animal Rights',
  'Health Care',
  'Corruption',
  'Electoral Reform',
  'Religion',
  'Science & Technology',
  'Education',
  'Veterans',
  'Human Rights',
  'Arts & Culture'
]
topics.each { |t| Topic.create!(name: t) }

(1..100).each do 
  zipcode = "#{Faker::Address.zip}"
  e = Event.create!(
    name: Faker::Lorem.words(rand(3..5)).join(" "),
    description: Faker::Lorem.paragraph,
    address: "#{Faker::Address.street_address},"+
             "#{Faker::Address.secondary_address},"+
             "#{Faker::Address.city},"+
             "#{Faker::Address.state_abbr},"+
             zipcode,
    zipcode: zipcode,
    url: Faker::Internet.url,
    starts_at: Faker::Time.between(Time.now, Time.now + 1.month),
    ends_at: Faker::Time.between(Time.now, Time.now + 1.month),
    topic: Topic.find_by(name: topics[rand(topics.count)]).as_json(only: :id)

  )
end