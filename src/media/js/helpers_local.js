define('helpers_local',
    ['feed', 'nunjucks', 'regions', 'underscore', 'urls', 'utils_local', 'z'],
    function(feed, nunjucks, regions, _, urls, utils_local, z) {
    var filters = nunjucks.require('filters');
    var globals = nunjucks.require('globals');

    globals.feed = feed;
    globals.REGIONS = regions.REGION_CHOICES_SLUG;
    globals.REGION_CHOICES = regionTransform(regions.REGION_CHOICES_SLUG);

    function unslug(str) {
        // Change underscores to spaces and text-transform uppercase.
        return str.replace(/_/g, ' ')
                  .replace(/(^| )(\w)/g, function(x) {
                      return x.toUpperCase();
                  });
    }

    function indexOf(arr, val) {
        return arr.indexOf(val);
    }

    function regionTransform(regions) {
        // Turn regions dict into sorted list of tuples.
        return _.sortBy(utils_local.items(regions), function(region) {
            return region[1];
        });
    }

    // Functions provided in the default context.
    var helpers = {
        indexOf: indexOf,
        api_base: urls.api.base.url,
    };

    var filters_map = {
        json: JSON.stringify,
        items: utils_local.items,
        unslug: unslug
    };

    // Put the helpers into the nunjucks global.
    for (var i in helpers) {
        if (helpers.hasOwnProperty(i)) {
            globals[i] = helpers[i];
        }
    }

    for (var i in filters_map) {
        if (filters_map.hasOwnProperty(i)) {
            if (nunjucks.env) {
                nunjucks.env.addFilter(i, filters_map[i]);
            }
            filters[i] = filters_map[i];
        }
    }

    return helpers;
});
