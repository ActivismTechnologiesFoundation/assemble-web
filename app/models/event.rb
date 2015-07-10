class Event < ActiveRecord::Base
  has_and_belongs_to_many :topics

  validates :name, presence: true
  validates :description, presence: true
  validates :address, presence: true
  validates :starts_at, presence: true

  ADDRESS_KEYS = [:line1, :line2, :city, :state, :zipcode]

  def address
    keys = ADDRESS_KEYS
    values = read_attribute(:address).to_s.split(",")

    Hash[keys.zip(values)]
  end

end
