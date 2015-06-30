Handlebars.registerHelper("momentToString", function(momentObj, format){
  return !!momentObj ? momentObj.format(format) : "";
});
