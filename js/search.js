

//window.addEventListener('pageshow', event => {
//    if (event.persisted) {
//        alert('from back button');
//    }
//});


window.addEventListener('DOMContentLoaded', event => {


    const searchInputs = {
        "google": {
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "Google search..."
        },
        "youtube": {
            action: "https://www.youtube.com/results",
            queryParamName: "search_query",
            placeholderText: "YouTube search..."
        },
        "reddit": {
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "reddit search...",
            queryAppend: "+site%3Areddit.com"
        },
        "stackoverflow": {
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "Stack Overflow search...",
            queryAppend: "+site%3Astackoverflow.com"
        }
    };

    const defaultSearchPriority = [
        { "id": "google", "visible": true },
        { "id": "youtube", "visible": true },
        { "id": "reddit", "visible": true },
        { "id": "stackoverflow", "visible": true }
    ];



    // load the different search options
    var loadSearchGroups = function () {
        var searchText = '';
        if (performance.getEntriesByType("navigation")[0].type === 'back_forward') {
            searchText = localStorage.getItem('search.lastsearchtext');
        }

        for (var i = 0; i < defaultSearchPriority.length; i++) {
            var searchGroupDetails = defaultSearchPriority[i];
            loadSearchGroup(searchGroupDetails, i == 0, searchText);
        }
    };

    var loadSearchGroup = function (searchGroupDetails, isDefault, searchText) {
        var id = searchGroupDetails["id"];
        var searchGroup = searchInputs[id];

        var template = document.getElementById('searchgroup-template');
        var newSearchNode = template.content.firstElementChild.cloneNode(true);
        newSearchNode.classList.add(id);
        if (isDefault) newSearchNode.classList.add("default");

        var headerTemplate = document.body.querySelector('#searchgroup-header-template');
        var newHeaderNode = headerTemplate.content.querySelector('div.' + id).cloneNode(true);
        newSearchNode.querySelector('h4').appendChild(newHeaderNode);

        newSearchNode.querySelector('form').action = searchGroup.action;
        if ("queryAppend" in searchGroup) newSearchNode.querySelector('form').setAttribute('data-query-append', searchGroup.queryAppend);
        newSearchNode.querySelector('input').placeholder = searchGroup.placeholderText;
        newSearchNode.querySelector('input').setAttribute('aria-label', searchGroup.placeholderText);
        newSearchNode.querySelector('input').id = id + 'searchinput';
        newSearchNode.querySelector('input').name = searchGroup.queryParamName;

        if (searchText != null && searchText != '') {
            newSearchNode.querySelector('input').value = searchText;
        }


        document.body.querySelector('#searchgroup-container').appendChild(newSearchNode);

        var test = '';
    }

    loadSearchGroups();




    // set the default input to have focus
    setTimeout(function () {
        document.body.querySelector('.searchgroup.default input').focus();
    }, 100);
    



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

        localStorage.setItem('search.lastsearchtext', newValue);
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
