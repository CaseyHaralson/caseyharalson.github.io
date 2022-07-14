/*!
* Start Bootstrap - Creative v7.0.6 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

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



    /*

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

*/

});
