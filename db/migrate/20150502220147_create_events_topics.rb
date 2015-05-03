class CreateEventsTopics < ActiveRecord::Migration
  def change
    create_table :events_topics, id: false do |t|
      t.integer :event_id, index: true
      t.integer :topic_id, index: true
    end
  end
end
