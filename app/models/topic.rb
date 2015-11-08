class Topic < ActiveRecord::Base
  has_and_belongs_to_many :events

  def self.all_topics
   Topic.order(:name).to_a.insert(0, Topic.new(name: 'All', id: 0))
 end
end