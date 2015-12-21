
(function () {

    Backbone.MomentifiedModel = Backbone.Model.extend({
        constructor: function (attributes, options) {
            attributes = attributes || {};
            options = options || {};

            this.format = options.format || this.format;

            this.momentify_attributes({ attributes: attributes });

            arguments[0] = attributes;
            
            Backbone.Model.prototype.constructor.apply(this, arguments);
        }, 

        momentify_attributes: function(options){
            var attrs = !!options.attributes ? options.attributes : this.attributes;
            this._enumerate_time_attributes(function(key, value, attributes) {
                if(!moment.isMoment(value)) {

                    attributes[key] = this.to_moment(value, (options.format || this.format) == "unix");
                }
            }.bind(this), attrs);

            return this;
        },

        to_moment: function(value, unix) {
            return unix ? moment.unix(value) : moment(value); 
        },

        unix_clone: function() {
            var clone = this.clone();

            clone._enumerate_time_attributes(function(key, value, attributes){
                if(moment.isMoment(value)) {
                    attributes[key] = Number(value) / 1000.0;
                }
            },  clone.attributes);

            return clone;
        },

        _enumerate_time_attributes: function(callback, attributes) {
            _.keys(attributes).forEach(_.bind(function (key) {
                var value = attributes[key];
                if (!!key.match(/_at$/) && !!value) {
                    callback(key, value, attributes);
                }
            }, this));
        }
    });

})();
