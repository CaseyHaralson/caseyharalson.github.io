
window.addEventListener('DOMContentLoaded', event => {


    // set the default input to have focus
    document.body.querySelector('.searchgroup.default input').focus();



    // keep all of the search boxes up-to-date with the current search text
    var searchGroupInputs = document.body.querySelectorAll('.searchgroup input');

    var searchTextInputHandler = function (e) {
        var inputTarget = e.target;
        var newValue = inputTarget.value;

        for (var i = 0; i < searchGroupInputs.length; i++) {
            var item = searchGroupInputs[i];
            if (inputTarget != item) {
                item.value = newValue;
            }
        }
    };

    searchGroupInputs.forEach(function (item) {
        item.addEventListener('input', searchTextInputHandler);
    });
        


    // handle forms that have additional data that needs appended to the query
    var queryAppendForms = document.body.querySelectorAll('.searchgroup form[data-query-append]');

    var queryAppendFormSubmitHandler = function (e) {
        if (e.preventDefault) e.preventDefault();

        var form = e.target;
        var action = form.action;
        var queryAppend = form.dataset.queryAppend;
        var formData = Object.fromEntries(new FormData(form).entries());
        var formDataKeys = Object.keys(formData);
        var query = formDataKeys[0] + '=' + formData[formDataKeys[0]] + queryAppend;

        window.location.href = action + '?' + query;
    };

    queryAppendForms.forEach(function (item) {
        item.addEventListener('submit', queryAppendFormSubmitHandler);
    });


});
