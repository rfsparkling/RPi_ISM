var propertyValidator = (function() {
    var _properties = {};

    _properties.isDefined = function(obj) {

        return typeof obj !== "undefined";
    };

    return _properties;
})();