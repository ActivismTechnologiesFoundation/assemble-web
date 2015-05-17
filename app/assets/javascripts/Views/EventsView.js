(function ($) {

  AssembleApp.Views.EventsView = Backbone.View.extend({
    el: $('#events-top-level-view'),

    initialize: function(options) {
      this.template = Handlebars.compile($('#events-top-level-view-template').html());
      this.eventsCollection = new AssembleApp.Collections.Events();

      this.eventsListView = new AssembleApp.Views.ListView({
        collection: this.eventsCollection,
        view: AssembleApp.Views.EventListCellView,
        type: 'event'
      });

      options.topics.push({id: 0, name: "All"});
      var topics = new Backbone.Collection(options.topics);
      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: topics
      });

      this.listenTo(this.topicSelect, 'value_changed', this.fetchEvents);

      this.render();

      this.eventsCollection.fetch();
    },

    render: function() {
      var data = {};

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '#topic-select')
      this.assign(this.eventsListView, '#events-list');

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    },

    fetchEvents: function(topic) {
      this.eventsCollection.fetch({data: {topic_id: topic.id}, reset: true});
    }

  });

  AssembleApp.Views.EventForm = Backbone.View.extend({
    initialize: function() {
      this.template = Handlebars.compile($('#event-form-template').html());
    },

    render: function() {
      var data = this.model.toJSON();
      this.$el.html(this.template(data));
    }
  });

  AssembleApp.Views.EventListCellView = Backbone.View.extend({
    tagName: 'li',

    className: 'event-cell',

    initialize: function(){
      this.template = Handlebars.compile($('#event-list-cell-view-template').html());
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this.$el;
    }
  });

  AssembleApp.Views.CustomSelectView = Backbone.View.extend({
    events: {
      'click .dropdown': 'toggleDropdown',
      'click li': 'valueChanged'
    },

    initialize: function() {
      this.template = Handlebars.compile($('#topic-select-view-template').html());
      this.selectedValue = new Backbone.Model({name: "Select a Topic"});
    },

    render: function() {
      var data = { values: this.collection.toJSON(), selected: this.currentValue().get('name')};
      this.$el.html(this.template(data));

      return this.$el;
    },

    valueChanged: function(event) {
      var $selectedItem = $(event.currentTarget),
          selectedId = $selectedItem.data('id');

      this.selectedValue = this.collection.get(selectedId);
      this.trigger('value_changed', this.selectedValue);

      this.render();

      this.$('li').removeClass('selected');
      this.$('li[data-id='+selectedId+']').addClass('selected');
    },

    toggleDropdown: function(event) {
      this.$('ul').toggle();
    },

    currentValue: function() {
      return this.selectedValue;
    },
  });

})(jQuery);
