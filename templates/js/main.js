require.config({
	baseUrl: 'js/',
//    waitSeconds: 30,
//    urlArgs: 'v=1.05',
    paths: {
        'jquery': 'lib/jquery.min',
        'bootstrap': 'lib/bootstrap.min',
        'domready': 'lib/ready.min',
        'underscore': 'lib/underscore.min',
        'knockout': 'lib/knockout.min',
        'dialog': 'lib/bootstrap-dialog',
        'formValidation': 'lib/formValidation.popular',
        'formValidation.bootstrap': 'lib/formValidation.bootstrap',
        'formValidator': 'lib/formValidator',
        'pjax': 'lib/jquery.pjax',
        'form': 'lib/jquery.form',
        'toastr': 'lib/toastr',
        'slidizle': 'lib/slidizle.min',
        'city': 'lib/jquery.city',
        'datatables.net': 'lib/jquery.dataTables',
        'datatables.select': 'lib/dataTables.select.min',
        'dataTables': 'lib/dataTables.bootstrap',
        'typeahead': 'lib/bootstrap3-typeahead.min',
        'datepicker': 'lib/bootstrap-datepicker.min',
        'select2': 'lib/select2.full.min',
        'spring': 'lib/jquery.spring-friendly',
        'printarea': 'lib/jquery.PrintArea.min'
    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'knockout': {
            deps: ['jquery'],
            exports: 'ko'
        },
        'pjax': {
            deps: ['jquery'],
            exports: 'pjax'
        },
        'dialog': {
            deps: ['bootstrap'],
            exports: 'Dialog'
        },
        'underscore': {
            exports: '_'
        },
        'formValidation': {
            deps: ['jquery'],
            exports: '$.fn.formValidation'
        },
        'formValidation.bootstrap': {
            deps: ['formValidation'],
            exports: '$.fn.formValidation'
        },
        'formValidator': {
            deps: ['formValidation.bootstrap'],
            exports: '$.fn.formValidation'
        },
        'datatables.net': {
            deps: ['spring'],
            exports: 'datatables'
        },
        'datatables': {
            deps: ['jquery', 'datatables.net', 'spring'],
            exports: 'datatables'
        },
    }
})

require(['jquery', 'underscore', 'bootstrap'],
function($, _, Bootstrap) {
    console.log('想来忠信工作？请发送邮件到 Again@zxcioc.com');
    require(['common'],function() {
    	
    });
});