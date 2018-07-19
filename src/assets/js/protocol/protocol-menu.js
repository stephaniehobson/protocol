// create namespace
if (typeof Mozilla === 'undefined') {
    var Mozilla = {};
}

(function() {
    'use strict';

    var Menu = {};
    var _hoverTimeout;
    var _mqWideNav;

    Menu.open = function(el) {
        el.classList.add('selected');
        el.setAttribute('aria-selected', true);
        el.setAttribute('aria-expanded', true);
    };

    Menu.close = function() {
        // On small screens more than one menu can be open at the same time.
        var current = document.querySelectorAll('.mzp-c-menu-category.selected');

        for (var i = 0; i < current.length; i++) {
            current[i].classList.remove('selected');
            current[i].setAttribute('aria-selected', false);
            current[i].setAttribute('aria-expanded', false);
        }
    };

    Menu.toggle = function(el) {
        el.classList.toggle('selected');

        var state = el.classList.contains('selected') ? true : false;
        el.setAttribute('aria-selected', state);
        el.setAttribute('aria-expanded', state);
    };

    Menu.onMouseEnter = function(e) {
        clearTimeout(_hoverTimeout);

        // Only open the panel if the user shows hover intent
        _hoverTimeout = setTimeout(function() {
            Menu.close();
            Menu.open(e.target);
        }, 150);
    };

    Menu.onMouseLeave = function() {
        // Clear hover intent timer.
        clearTimeout(_hoverTimeout);

        _hoverTimeout = setTimeout(function() {
            Menu.close();
        }, 150);
    };

    Menu.onFocus = function(e) {
        // prevent mouse events from firing on touch devices.
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        Menu.close();
        Menu.open(e.target.parentNode);
    };

    Menu.onFocusOut = function() {
        var self = this;

        /**
         * After an element loses focus, `document.activeElement` will always be `body` before
         * moving to the next element. A `setTimeout` of `0` circumvents this issue as it
         * re-queues the JavaScript to run at the end of the current excecution.
         */
        setTimeout(function() {
            if (!self.contains(document.activeElement)) {
                Menu.close();
            }
        }, 0);
    };

    Menu.onClickWide = function(e) {
        e.preventDefault();
    };

    Menu.onClickSmall = function(e) {
        e.preventDefault();
        Menu.toggle(e.target.parentNode);
    };

    Menu.handleState = function() {
        _mqWideNav = matchMedia('(min-width: 768px)');

        _mqWideNav.addListener(function(mq) {
            if (mq.matches) {
                Menu.unbindEventsSmall();
                Menu.bindEventsWide();
            } else {
                Menu.unbindEventsWide();
                Menu.bindEventsSmall();
            }

            Menu.close();
        });

        if (_mqWideNav.matches) {
            Menu.bindEventsWide();
        } else {
            Menu.bindEventsSmall();
        }
    };

    Menu.bindEventsWide = function() {
        var items = document.querySelectorAll('.mzp-c-menu-category.mzp-has-drop-down');
        var link;
        var close;

        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('mouseenter', Menu.onMouseEnter, false);
            items[i].addEventListener('mouseleave', Menu.onMouseLeave, false);

            link = items[i].querySelector('.mzp-c-menu-title');
            link.addEventListener('touchstart', Menu.onFocus, false);
            link.addEventListener('focus', Menu.onFocus, false);
            link.addEventListener('click', Menu.onClickWide, false);

            close = items[i].querySelector('.mzp-c-menu-button-close');
            close.addEventListener('click', Menu.close, false);
        }

        document.querySelector('.mzp-c-menu').addEventListener('focusout', Menu.onFocusOut, false);
    };

    Menu.unbindEventsWide = function() {
        var items = document.querySelectorAll('.mzp-c-menu-category.mzp-has-drop-down');
        var link;
        var close;

        for (var i = 0; i < items.length; i++) {
            items[i].removeEventListener('mouseenter', Menu.onMouseEnter, false);
            items[i].removeEventListener('mouseleave', Menu.onMouseLeave, false);

            link = items[i].querySelector('.mzp-c-menu-title');
            link.removeEventListener('touchstart', Menu.onFocus, false);
            link.removeEventListener('focus', Menu.onFocus, false);
            link.removeEventListener('click', Menu.onClickWide, false);

            close = items[i].querySelector('.mzp-c-menu-button-close');
            close.removeEventListener('click', Menu.close, false);
        }

        document.querySelector('.mzp-c-menu').removeEventListener('focusout', Menu.onFocusOut, false);
    };

    Menu.bindEventsSmall = function() {
        var items = document.querySelectorAll('.mzp-c-menu-category.mzp-has-drop-down .mzp-c-menu-title');

        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', Menu.onClickSmall, false);
        }
    };

    Menu.unbindEventsSmall = function() {
        var items = document.querySelectorAll('.mzp-c-menu-category.mzp-has-drop-down .mzp-c-menu-title');

        for (var i = 0; i < items.length; i++) {
            items[i].removeEventListener('click', Menu.onClickSmall, false);
        }
    };

    /**
     * Enables simplified menu using pure CSS hover states.
     */
    Menu.cssOnly = function() {
        var menu = document.querySelector('.mzp-c-menu');
        var currentClassName = menu.className;
        menu.className = currentClassName.replace(/mzp-c-menu/, 'mzp-c-menu mzp-c-menu-basic');
    };

    Menu.isSupported = function() {
        return typeof window.matchMedia !== 'undefined' &&
               window.matchMedia('all').addListener &&
               'classList' in document.createElement('div');
    };

    Menu.init = function() {
        if (Menu.isSupported()) {
            Menu.handleState();
        } else {
            Menu.cssOnly();
        }
    };

    //TODO init this in a separate file
    Menu.init();

    window.Mozilla.Menu = Menu;

})();
