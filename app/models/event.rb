class Event < ActiveRecord::Base
  has_and_belongs_to_many :topics

  validates :topic, presence: true
  validates :name, presence: true
  validates :description, presence: true
  validates :address, presence: true
  validates :zipcode, presence: true
  validates :starts_at, presence: true

  attr_accessor :topic

  ADDRESS_KEYS = [:line1, :line2, :city, :state, :zipcode]

  after_save :ensure_topic_link

  def self.filter(params)
    topic_id = params[:topic_id].to_i
    zipcode = params[:zipcode]

    @events = if topic_id && topic_id > 0
      Topic.find(topic_id).events.order(created_at: :desc).limit(10)
    else
      Event.order(created_at: :desc).limit(10)
    end

    return @events if zipcode.blank?

    @events = if @events.nil? 
      Event.where(zipcode: zipcode)
    else
      @events.where(zipcode: zipcode)
    end
  end

  def topic_filter(topic_id, query=nil)
    if query
      query.join
    else
      Topic.find(topic_id).events.order(created_at: :desc).limit(10)
    end
  end

  def address
    keys = ADDRESS_KEYS
    values = read_attribute(:address).to_s.split(",")

    Hash[keys.zip(values)]
  end

  def ensure_topic_link
    if self.topic
      topic = Topic.where(id: self.topic['id']).first
      self.topics << topic unless topic.blank?
    end
  end

end
