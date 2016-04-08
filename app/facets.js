/** Class that fetches the facets */

var FacetFetcher = (function () {
  var ldf = window.ldf,
      FragmentsClient = ldf.FragmentsClient;

  function FacetFetcher(subject, predicate, objVal, startFragment, callback) {
    this.pattern = { 'subject' : subject, 'predicate' : predicate, 'object' : objVal };
    this._callback = callback;
    this.config = {};
    this.config.startFragment = startFragment;
    this.config.prefixes = {
     "rdf":         "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs":        "http://www.w3.org/2000/01/rdf-schema#",
     "owl":         "http://www.w3.org/2002/07/owl#",
     "skos":        "http://www.w3.org/2004/02/skos/core#",
     "xsd":         "http://www.w3.org/2001/XMLSchema#",
     "dc":          "http://purl.org/dc/terms/",
     "dcterms":     "http://purl.org/dc/terms/",
     "dc11":        "http://purl.org/dc/elements/1.1/",
     "foaf":        "http://xmlns.com/foaf/0.1/",
     "geo":         "http://www.w3.org/2003/01/geo/wgs84_pos#",
     "dbpedia":     "http://dbpedia.org/resource/",
     "dbpedia-owl": "http://dbpedia.org/ontology/",
     "dbpprop":     "http://dbpedia.org/property/",
     "regorg":      "http://www.w3.org/ns/regorg#",
     "kbo":         "http://data.kbodata.be/def#",
     "oslo":        "http://purl.org/oslo/ns/localgov#",
     "org":         "http://www.w3.org/ns/org#"
    };

    console.log("created new client");
  }

  // Activates the Linked Data Fragments Client UI
  FacetFetcher.prototype.activate = function () {
      var pattern = this.pattern;
      var config = this.config;
      var callback = this._callback;
      var deferred = Q.defer();

      console.log("activated new client");
      // Create the iterator to solve the query
      config.fragmentsClient = new FragmentsClient(config.startFragment, config);

      var result = config.fragmentsClient.getFragmentByPattern(pattern);

      result.on('error', function (error) { callback(pattern, { totalTriples : 0}); deferred.resolve();  });

      result.getProperty('metadata', function (metadata) {
        callback(pattern, metadata);
        deferred.resolve();
      });

      return deferred.promise;
  };

  return FacetFetcher;
})(jQuery);
