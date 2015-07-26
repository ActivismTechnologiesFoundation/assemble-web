require 'open-uri'

class Event < ActiveRecord::Base
  has_and_belongs_to_many :topics

  validates :topic, presence: true, if: Proc.new { |e| !e.skip_topic_validation }
  validates :name, presence: true
  validates :description, presence: true
  validates :address, presence: true
  validates :zipcode, presence: true
  validates :starts_at, presence: true

  attr_accessor :topic, :skip_topic_validation

  ADDRESS_KEYS = [:line1, :line2, :city, :state, :zipcode]

  after_save :ensure_topic_link
  after_save :ensure_zipcode

  def self.filter(params)
    topic_id = params[:topic_id].to_i
    zipcode = params[:zipcode]
    @events = nil

    # Filter topic
    @events = if topic_id && topic_id > 0
      Topic.find(topic_id).events.order(created_at: :desc)
    else
      Event.order(created_at: :desc)
    end

    # Filter zipcode
    @events = if @events.nil? && !zipcode.blank?
      Event.where(zipcode: zipcode)
    elsif !zipcode.blank?
      @events.where(zipcode: zipcode)
    else
      @events
    end

    @events.page(params[:page] || 1).per(10)
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

  def ensure_zipcode
    if self.zipcode 
      begin 
        Zipcode.create!(value: self.zipcode.to_s) unless Zipcode.exists?(value: self.zipcode.to_s)
      rescue ActiveRecord::RecordNotUnique => e
      end
    end
  end

  # Uploading CSVs
  def self.load_csv(csv, defaults={})
    csv = get_csv(csv)
    failed = []
    csv.each_with_index do |row, i|
      begin 
        ActiveRecord::Base.transaction do 
          attrs = event_attributes(row, defaults: defaults)
          @event = Event.new(attrs)
          @event.skip_topic_validation = true
          @event.save!

          event_topics(row).each { |t| @event.topics << t }
        end
        sleep 0.15
      rescue => e
        failed << {id: i, event: @event.as_json, error: e.message}
      end
    end

    if failed.count > 0
      puts "Failed to load these events: "
      puts failed.map{|f| ['id: ', f[:id], 'error: ', f[:error] ].join(' ')}.to_yaml
    else
      puts "Success: All events uploaded!"
    end
  end

  def self.event_attributes(csv_row, options={})
    defaults = options[:defaults] || {}
    row_hash = csv_row.to_hash.with_indifferent_access
    keys = [:name, :url, :description]
    attrs = row_hash.select{|k| keys.include?(k.to_sym) }

    #dates
    dates = parse_dates(row_hash[:date])
    attrs[:starts_at] = dates[:starts_at]
    attrs[:ends_at] = dates[:ends_at]

    #address
    address = [:street_address, :city, :state].map{|k| row_hash[k].to_s }.join(',')
    geocode = Geocoder.search(address).first
    attrs[:zipcode] = geocode.postal_code
    attrs[:zipcode] = defaults[:zipcode] if row_hash[:street_address].blank?
    attrs[:address] = [address, attrs[:zipcode].to_s].join(',')
    attrs[:latitude] = geocode.latitude
    attrs[:longitude] = geocode.longitude

    attrs
  end

  def self.parse_dates(date)
    # Example usage at http://rubular.com/r/ODEs9YNBGs
    date_regex = /([a-zA-z]{3,9}\s*\d{1,2},\s*2015){1}.*,\s*([a-zA-Z]{3,9}\s*\d{1,2},\s*2015){1}|([a-zA-z]{3,9}\s*\d{1,2},\s*2015)\s*-?(\s*\d{1,2}:\d{1,2}[amp]{2})?\s*[to]{2}?\s*(\d{1,2}:\d{1,2}[amp]{2})*/
    zone = 'Eastern Time (US & Canada)'

    matches = date.match(date_regex).to_a
    multi_day_event_start_date  = matches[1]
    multi_day_event_end_date    = matches[2]
    single_day_date             = matches[3]
    single_day_start_time       = matches[4]
    single_day_end_time         = matches[5]

    starts_at, ends_at = if multi_day_event_start_date && multi_day_event_end_date
      [Time.parse(multi_day_event_start_date), Time.parse(multi_day_event_end_date)]
    elsif single_day_date && single_day_start_time && single_day_end_time
      [
        Time.parse("#{single_day_date} - #{single_day_start_time}"),
        Time.parse("#{single_day_date} - #{single_day_end_time}")
      ]
    elsif single_day_date && single_day_start_time
      [Time.parse("#{single_day_date} - #{single_day_start_time}"), nil]
    elsif single_day_date
      [TIme.parse(single_day_date), nil]
    end

    {
      starts_at: starts_at ? starts_at.in_time_zone(zone) : nil,
      ends_at: ends_at ? ends_at.in_time_zone(zone) : nil
    }
  end

  def self.event_topics(csv_row)
    topics = []
    topics = csv_row.to_hash.select{|k| k =~ /native_categories/}.values
    topics.map!{ |n|  Topic.where(name: n.strip).first }.delete_if{|t| t.blank? }
    topics
  end

  def self.get_csv(csv)
    case csv.class.to_s
    when CSV.to_s
      csv
    when String.to_s
      CSV.open(open(csv), headers: true)
    when Tempfile.to_s
      CSV.open(csv)
    end
  end
end
