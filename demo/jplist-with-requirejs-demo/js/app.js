requirejs.config({
    'baseUrl': 'js/lib',
    'paths': {
      'app': '../app',
      'jquery': 'jquery',
      'jplist': '../../../../dist/js/jplist.core.min',
      'jplist-sort-bundle': '../../../../dist/js/jplist.sort-bundle.min',
      'jplist-textbox-filter': '../../../../dist/js/jplist.textbox-filter.min',
      'jplist-pagination-bundle': '../../../../dist/js/jplist.pagination-bundle.min'
    },
    'shim': {
        'jplist': {
            deps: ['jquery'],
            exports: 'jplist'
        },
        'jplist-sort-bundle': {
            deps: ['jplist']
        },
        'jplist-textbox-filter': {
            deps: ['jplist']
        },
        'jplist-pagination-bundle': {
            deps: ['jplist']
        }
    }
});

// Load the main app module to start the app
requirejs(['app/main']);