(function ($) {

AssembleApp.Views.PlacesAutoCompleteView = Backbone.View.extend({
    initialize: function(options) {
        options = options || {};

        this.template = Handlebars.compile($('#places-autocomplete-view-template').html());
        this.model = new Backbone.Model({
            placeholder: options.placeholder || 'Start typing the address'
        });

    }, 

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));

        this._initAutocompleteView();

        return this.$el;
    },

    _initAutocompleteView: function() {
        this.autocomplete = new google.maps.places.Autocomplete(
            this.$('input')[0],
            {types: ['geocode']}
        );
        this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
    },

    fillInAddress: function() {
        var place = this.autocomplete.getPlace(),
            street = [],
            city = '', 
            state = '', 
            zipcode = [];

        place.address_components.forEach(function(component) {
            if(component.types.join(" ").indexOf('street_number') > -1) {
                street.push(component.short_name);
            }
            if(component.types.join(" ").indexOf('route') > -1) { // Street
                street.push(component.short_name);
            }
            if(component.types.join(" ").indexOf('locality') > -1) { // City
                city = component.long_name;
            }
            if(component.types.join(" ").indexOf('administrative_area_level_1') > -1) { // State
                state = component.short_name;
            }
            if(component.types.join(" ").indexOf('postal_code') > -1) { //Zipcode
                zipcode.push(component.short_name);
            }
        }.bind(this));

        this.model.set('chosen_address', {
            street: street.join(' '), 
            city: city, 
            state: state, 
            zipcode: zipcode.join('-'),
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        });

        this.trigger('address_chosen', this.model.get('chosen_address'));
    },

    chosenAddress: function() {
        return this.model.get('chosen_address');
    }


});

})(jQuery);