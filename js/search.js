

//window.addEventListener('pageshow', event => {
//    if (event.persisted) {
//        alert('from back button');
//    }
//});


window.addEventListener('DOMContentLoaded', event => {


    const searchInputs = {
        "google": {
            name: "Google",
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "Google search..."
        },
        "youtube": {
            name: "YouTube",
            action: "https://www.youtube.com/results",
            queryParamName: "search_query",
            placeholderText: "YouTube search..."
        },
        "reddit": {
            name: "reddit",
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "reddit search...",
            queryAppend: "+site%3Areddit.com"
        },
        "stackoverflow": {
            name: "Stack Overflow",
            action: "https://www.google.com/search",
            queryParamName: "q",
            placeholderText: "Stack Overflow search...",
            queryAppend: "+site%3Astackoverflow.com"
        }
    };

    var defaultSearchOptions = [
        { "id": "google", "visible": true },
        { "id": "youtube", "visible": true },
        { "id": "reddit", "visible": true },
        { "id": "stackoverflow", "visible": true }
    ];



    var saveDefaultSearchOptions = function () {
        localStorage.setItem('search.defaultSearchOptions', JSON.stringify(defaultSearchOptions));
    };
    var loadDefaultSearchOptions = function () {
        var savedSearchOptions = JSON.parse(localStorage.getItem('search.defaultSearchOptions'));

        // blend the saved with the defaults (incase the saved list isn't as big as ours)
        if (savedSearchOptions == null) savedSearchOptions = defaultSearchOptions;
        else {
            for (var i = 0; i < defaultSearchOptions.length; i++) {
                var d = defaultSearchOptions[i];

                var found = false;
                for (var j = 0; j < savedSearchOptions.length; j++) {
                    var saved = savedSearchOptions[j];
                    if (d.id == saved.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    savedSearchOptions.push(d);
                }
            }
        }

        defaultSearchOptions = savedSearchOptions;
        saveDefaultSearchOptions();
    };
    loadDefaultSearchOptions();




    // load the different search options
    var loadSearchGroups = function () {
        var searchText = '';
        if (performance.getEntriesByType("navigation")[0].type === 'back_forward') {
            searchText = localStorage.getItem('search.lastsearchtext');
        }

        var isDefault = true;
        for (var i = 0; i < defaultSearchOptions.length; i++) {
            var searchGroupDetails = defaultSearchOptions[i];
            if (searchGroupDetails.visible) {
                loadSearchGroup(searchGroupDetails, isDefault, searchText);
                if (isDefault) isDefault = false;
            }
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
    }
    loadSearchGroups();




    // load the edit grid
    var loadEditGrid = function () {
        for (var i = 0; i < defaultSearchOptions.length; i++) {
            var searchGroupDetails = defaultSearchOptions[i];
            var id = searchGroupDetails["id"];
            var searchGroup = searchInputs[id];

            var template = document.getElementById('searchgroup-editrow-template');
            var newEditNote = template.content.firstElementChild.cloneNode(true);
            newEditNote.classList.add(id);
            newEditNote.querySelector('.searchname').innerText = searchGroup.name;
            newEditNote.querySelector('input.visibility').id = id + "-edit-visibility";
            newEditNote.querySelector('.visibilitylabel').setAttribute('for', id + "-edit-visibility");
            if (!searchGroupDetails.visible) {
                newEditNote.querySelector('input.visibility').removeAttribute('checked');
                newEditNote.querySelector('.visibilitylabel').innerText = "Invisible";
            }

            document.body.querySelector('table#editoptionstable tbody').appendChild(newEditNote);
        }
    }
    var clearEditGrid = function () {
        document.body.querySelector('table#editoptionstable tbody').innerHTML = '';
    }
    loadEditGrid();




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



    // handle edits
    var attachEditHandlers = function () {
        var editVisibilityInputs = document.body.querySelectorAll('#editoptionstable input.visibility');
        editVisibilityInputs.forEach(function (item) {
            item.addEventListener('change', editVisibilityInputsChangeHandler);
        });

        var editOrderIcons = document.body.querySelectorAll('#editoptionstable .order-icon');
        editOrderIcons.forEach(function (item) {
            item.addEventListener('click', editOrderIconClickHandler);
        });
    }

    var editVisibilityInputsChangeHandler = function (e) {
        var checked = e.currentTarget.checked;
        var row = e.currentTarget.parentElement.parentElement;

        if (checked) {
            row.querySelector('.visibilitylabel').innerText = "Visible";
        } else {
            row.querySelector('.visibilitylabel').innerText = "Invisible";
        }

        changeDefaultOptionsVisibility(row.className, checked);
    };
    var changeDefaultOptionsVisibility = function (id, visible) {
        for (var i = 0; i < defaultSearchOptions.length; i++) {
            var option = defaultSearchOptions[i];
            if (option.id == id) {
                option.visible = visible;
                break;
            }
        }
        saveDefaultSearchOptions();
    };

    var editOrderIconClickHandler = function (e) {
        var row = e.currentTarget.parentElement.parentElement;
        var direction = e.currentTarget.className.includes('up') ? "up" : "down";

        changeDefaultOptionsOrder(row.className, direction);
    };
    var changeDefaultOptionsOrder = function (id, direction) {
        for (var i = 0; i < defaultSearchOptions.length; i++) {
            var option = defaultSearchOptions[i];
            if (option.id == id) {

                if (direction == "up" && i == 0) break;
                if (direction == "down" && i == defaultSearchOptions.length - 1) break;

                if (direction == "up") {
                    defaultSearchOptions[i] = defaultSearchOptions[i - 1];
                    defaultSearchOptions[i - 1] = option;
                } else {
                    defaultSearchOptions[i] = defaultSearchOptions[i + 1];
                    defaultSearchOptions[i + 1] = option;
                }

                clearEditGrid();
                loadEditGrid();
                attachEditHandlers();
                break;
            }
        }
        saveDefaultSearchOptions();
    };
    attachEditHandlers();


    // refresh the page whenever they click the update page button
    document.body.querySelector('#updatepagelink')
        .addEventListener('click', () => {
            setTimeout(function () {
                location.reload();
            }, 700);
        });
});
