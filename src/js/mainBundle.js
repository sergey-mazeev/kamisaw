import {mmodal} from './modal';
import {bindModalForm, bindForm} from "./bindForm";
import {Breadcrumbs} from "./Breadcrumbs";
import {PhoneMask} from "./PhoneMask";

window.addEventListener('load', () => {

    const frontTabs = (node) => {
        if (!node) {
            return false;
        }

        const checkbox = node.querySelector('.front-tabs__toggle input');

        const toggleTab = (targetIndex) => {
            node.querySelector(`.front-tabs__head-item_active`).classList.remove('front-tabs__head-item_active');
            node.querySelector(`.front-tabs__head-item[data-target="${targetIndex}"]`).classList.add('front-tabs__head-item_active');

            node.querySelector(`.front-tabs__content-item_active`).classList.remove('front-tabs__content-item_active');
            node.querySelector(`.front-tabs__content-item[data-target="${targetIndex}"]`).classList.add('front-tabs__content-item_active');

            checkbox.checked = targetIndex === '2';
        }

        for (const control of node.querySelectorAll('.front-tabs__head-item')) {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                if (control.classList.contains('front-tabs__head-item_active')) {
                    return false;
                }

                toggleTab(control.getAttribute('data-target'));
            })
        }


        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                toggleTab("2");
                return true;
            }
            toggleTab("1");
        })
    }
    frontTabs(document.querySelector('.front-tabs'));



    const bindBurger = (node) => {
        if (!node) {
            return false;
        }
        node.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.header__content-wrapper').classList.toggle('header__content-wrapper_open');
        });
    }
    bindBurger(document.querySelector('.header__burger'));



    // инициализация кастомных модалок
    const on = (element, eventName, selector, fn) => {
        if (typeof element !== 'undefined' && element) {

            element.addEventListener(eventName, (event) => {

                const possibleTargets = element.querySelectorAll(selector);
                const target = event.target;

                for (let i = 0; i < possibleTargets.length; i += 1) {
                    let el = target;
                    const p = possibleTargets[i];

                    while (el && el !== element) {
                        if (el === p) {
                            return fn.call(p, event);
                        }
                        el = el.parentNode;
                    }
                }
            });
        }

    }

    on(document.body, 'click', '.js-modal', (e) => {
        e.preventDefault();
        mmodal(e.target, bindModalForm);
        e.stopPropagation();
    });

    // привязка форм
    const forms = document.querySelectorAll('.js-form');
    for (const form of forms) {
        bindForm(form);
    }

})
