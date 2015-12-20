(function ($) {

    _.extend(Backbone.Validation.patterns, {
        date_mm_dd_yyyy: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
    });

    _.extend(Backbone.Validation.messages, {
        date_mm_dd_yyyy: 'Invalid date. Must be in format mm/dd/yyyy'
    });

    _.extend(Backbone.Validation.attributeLoaders, {
        validatable: function(view) {
            return _.map(view.$('input.validatable'), function(input) { return input.getAttribute('id'); } );
        }
    });

    Backbone.Validation.configure({
        selector: 'id',
        attributes: 'validatable'
    });
})(jQuery);
