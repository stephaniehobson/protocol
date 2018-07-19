// create namespace
if (typeof Mozilla === 'undefined') {
    var Mozilla = {};
}

(function() {
    'use strict';

    var Navigation = {};
    var menu = document.querySelector('.mzp-c-navigation-items');

    Navigation.onClick = function(e) {
        e.preventDefault();

        // Update button state
        e.target.classList.toggle('active');

        // Update menu state
        menu.classList.toggle('open');

        // Update aria-expended state on menu.
        var expanded = menu.classList.contains('open') ? true : false;
        menu.setAttribute('aria-expanded', expanded);
    };

    Navigation.bindEvents = function() {
        // Menu button for small screens.
        document.querySelector('.mzp-c-navigation-menu-button').addEventListener('click', Navigation.onClick, false);
    };

    //TODO init this in a separate file
    Navigation.bindEvents();

    window.Mozilla.Navigation = Navigation;

})();
