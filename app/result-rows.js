/** Class that fetches the result rows */

var ResultRowFetcher = (function ($) {
  var ldf = window.ldf,
      SparqlIterator = ldf.SparqlIterator,
      FragmentsClient = ldf.FragmentsClient,
      Logger = ldf.Logger;

  Logger.setLevel('WARNING');

  // Creates a new Linked Data Fragments Client UI
  function ResultRowFetcher(element, query, startFragment, callback, facet) {
    this.query = query;
    this._$element = $(element);
    this._callback = callback;
    this._facet = facet;
    this.config = {};
    this.resultsList = [];
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
  ResultRowFetcher.prototype.activate = function () {
      var deferred = Q.defer();
      var query = this.query;
      var config = this.config;
      var callback = this._callback;
      var resultsList = this.resultsList;
      var $results = this._$element.find('.results');
      var facet = this._facet;

      $results.empty();

      console.log("activated new client");
      // Create the iterator to solve the query
      config.fragmentsClient = new FragmentsClient(config.startFragment, config);
      var sparqlIterator = new SparqlIterator(query, config);
      switch (sparqlIterator.queryType) {
        // Write a JSON array representation of the rows
        case 'SELECT':
          sparqlIterator.on('data', function (row) {
            resultsList.push(row);
            callback(row, facet);
          });
          sparqlIterator.on('end', function () {
            deferred.resolve();
          });
        break;
        // Write an RDF representation of all results
        case 'CONSTRUCT':
          throw new Error('Unsupported query type: ' + sparqlIterator.parsedQuery.type);
        break;
        default:
          throw new Error('Unsupported query type: ' + sparqlIterator.parsedQuery.type);
      }

      sparqlIterator.on('error', function (error) { console.log(error.message); });
      sparqlIterator.read();

    return deferred.promise;

  };

  return ResultRowFetcher;
})(jQuery);
