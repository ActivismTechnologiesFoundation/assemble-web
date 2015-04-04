class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.string :topic
      t.text :description
      t.string :address
      t.string :url
      t.timestamp :starts_at
      t.timestamp :ends_at

      t.timestamps
    end
  end
end
