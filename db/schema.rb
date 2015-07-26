# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150726080718) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "api_keys", force: true do |t|
    t.string   "app_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "api_keys", ["app_id"], name: "index_api_keys_on_app_id", unique: true, using: :btree

  create_table "events", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "address"
    t.string   "url"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "zipcode"
    t.float    "latitude"
    t.float    "longitude"
  end

  create_table "events_topics", id: false, force: true do |t|
    t.integer "event_id"
    t.integer "topic_id"
  end

  create_table "topics", force: true do |t|
    t.string "name"
  end

  create_table "zipcodes", force: true do |t|
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "zipcodes", ["value"], name: "index_zipcodes_on_value", unique: true, using: :btree

end
