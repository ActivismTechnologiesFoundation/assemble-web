(function ($) {

  AssembleApp.Views.EventsView = Backbone.View.extend({
    el: $('#events-top-level-view'),

    events: {
      'click #add-event': 'showEventForm',
      'submit #filter-zipcode form': 'filterByZipcode'
    },

    initialize: function(options) {
      this.template = Handlebars.compile($('#events-top-level-view-template').html());
      this.eventsCollection = new AssembleApp.Collections.Events();

      this.eventsListView = new AssembleApp.Views.ListView({
        collection: this.eventsCollection,
        view: AssembleApp.Views.EventListCellView,
        type: 'event',
        infinite_scroll_bottom: true
      });

      this.topics = options.topics;
      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: new Backbone.Collection(this.topics)
      });
      this.topicSelect.setSelected(this.topicSelect.collection.at(0));

      this.listenTo(this.topicSelect, 'value_changed', this.topicSelected);

      this.render();

      this.eventsCollection.fetch();
    },

    render: function() {
      var data = {};

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '#topic-select');
      this.assign(this.eventsListView, '#events-list');

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    },

    topicSelected: function(topic) {
      this.fetchEvents({topic: topic});
    },

    filterByZipcode: function(event) {
      event.preventDefault();

      var zipcode = this._zipcode();
      if(zipcode && zipcode.length > 0) {
        this.fetchEvents({zipcode: zipcode});
      }
      else {
        this.fetchEvents();
      }
    },

    fetchEvents: function(options) {
      options = options || {};
      var data = {
        topic_id: (options.topic || this.topicSelect.currentValue()).id,
        zipcode: options.zipcode || this._zipcode()
      };

      if(!data.zipcode || data.zipcode.length <= 0) {
        delete data.zipcode;
      }

      this.eventsCollection.fetch({data: data, reset: true});
    },

    showEventForm: function() {
      var eventForm = new AssembleApp.Views.EventForm({topics: this.topics});

      this.listenToOnce(eventForm, 'save_success', this.updateEvents);

      $('body').append(eventForm.render());
    },

    updateEvents: function() {
      this.eventsListView.reset_page();
      this.fetchEvents();
    },

    _zipcode: function() {
      return this.$('#filter-zipcode input').val();
    }

  });

  AssembleApp.Views.EventForm = Backbone.View.extend({
    tag: 'div',

    className: 'event-form-container',

    events: {
      'click #overlay'  : 'dismiss',
      'submit' : 'submit',
      'focus input, textarea' : 'inputFocused',
      'click .address-toggle': 'unsetAddress'
    },

    bindings: {
      '#name' : 'name',
      '#description': 'description',
      '#url' : 'url',
      '#line1' : 'line1',
      '#line2' : 'line2',
      '#city'  : '#city',
      '#state' : '#state',
      '#zipcode' : 'zipcode',
      '#starts_at': {
        observe: 'starts_at',
        onSet: 'momentify'
      }
    },

    momentify: function(value) {
      return this.model.to_moment(value);
    },

    initialize: function(options) {
      this.topics = new Backbone.Collection(options.topics);

      this.model = this.model ? this.model : new AssembleApp.Models.Event();

      this.template = Handlebars.compile($('#event-form-template').html());

      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: this.topics, 
        collapsable: true
      });

      this.autocompleteAddressView = new AssembleApp.Views.PlacesAutoCompleteView();
      this.listenTo(this.autocompleteAddressView, 'address_chosen', this.setAddress);
    },

    render: function() {
      var data = this.model.toJSON();
      data.topics = this.topics.toJSON();

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '.topic-dropdown');

      if (!this.model.has('address')) {
        this.assign(this.autocompleteAddressView, '.autocomplete-address');
      }

      this.stickit();

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    },

    setAddress: function(address) {
      this.model.set('address', address);
      this.render();
    },

    unsetAddress: function() {
      this.model.set('address', null);
      this.render();
    },

    submit: function(event){
      event.preventDefault();

      function success(model) {
        this.trigger('save_success', this.model);
        this.close();
      }

      function error(model, response) {
        this.process_errors(response.responseJSON.errors);
      }

      var data = {},
          address = this.model.get('address') || {};

      if(this.topicSelect.currentValue().id) {
        data.topic = this.topicSelect.currentValue().toJSON();
      }

      data.address = _.map(['street', 'line2', 'city', 'state', 'zipcode'], function(k) {
        return address[k] || '';
      }).join(',');

      data.latitude = address.latitude;
      data.longitude = address.longitude;

      this.model.unix_clone().save(data, {
        success: success.bind(this), 
        error: error.bind(this)
      });
    },

    process_errors: function(errors) {
      for(var key in errors) {
        this.$('#'+key+'.validatable').removeClass('valid').addClass('invalid');
      }
    },

    inputFocused: function(event) {
      var $input = $(event.currentTarget);
      $input.removeClass('invalid');
    },

    dismiss: function(event) {
      this.close();
    },

    close: function(){
      this.$el.remove();
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
      'click li': 'valueChanged',
      'click .dropdown': 'toggleDropdown'
    },

    initialize: function(options) {
      this.collapsable = !!options.collapsable;
      this.template = Handlebars.compile($('#topic-select-view-template').html());
    },

    render: function() {
      var data = { 
        values: this.collection.toJSON(), 
        selected: this.currentValue().get('name'), 
        collapsable: this.collapsable
      };
      this.$el.html(this.template(data));

      return this.$el;
    },

    valueChanged: function(event) {
      var $selectedItem = $(event.currentTarget),
          selectedId = $selectedItem.data('id');

      this.setSelected(this.collection.get(selectedId));

      if(this.collapsable) {
        this.render();
        this.toggleDropdown();
      }
    },

    toggleDropdown: function() {
      this.$('ul').toggle();
    },

    setSelected: function(selectedValue) {
      if(this.currentValue()) {
        this.currentValue().set('classes', '');
      }

      selectedValue.set('classes', 'selected');

      this.selectedValue = selectedValue;

      this.trigger('value_changed', selectedValue);

      this.render();
    },

    currentValue: function() {
      return this.selectedValue || new Backbone.Model();
    },
  });

})(jQuery);
