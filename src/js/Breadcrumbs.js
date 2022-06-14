export class Breadcrumbs {
    constructor(node, mediaQuery = '(max-width: 950px)') {
        this.el = node;
        if (!this.el) {
            return false;
        }
        this.items = this.pickItems();
        if (this.items.length < 4) {
            return false;
        }
        this.initialHTML = this.el.innerHTML;
        this.filteredItems = this.filterItems();

        this.mediaQueryString = mediaQuery;
        this.activeFlag = false;

        this.init();
        window.addEventListener('resize', this.watchResize)
    }

    pickItems() {
        return [...this.el.querySelectorAll('.breadcrumbs__item')];
    }

    filterItems() {
        return this.items.filter((el, index) => (index !== 0 && index !== this.items.length - 1))
    }

    createPopupHTML() {
        const newElement = document.createElement('li');
        newElement.classList.add('breadcrumbs__item');
        newElement.classList.add('breadcrumbs__item_popup');
        const button = document.createElement('button');
        button.classList.add('breadcrumbs__popup-button');
        button.setAttribute('type', 'button');
        button.innerText = '...'
        newElement.append(button);
        const popupUl = document.createElement('ul');
        popupUl.classList.add('breadcrumbs__popup');
        this.filteredItems.map(el => {
            popupUl.append(el)
        });
        newElement.append(popupUl);

        this.popupNode = popupUl;

        button.addEventListener('click', this.popupToggle);

        return newElement;
    }

    appendPopup() {
        console.log('append')
        this.popupHTML = this.createPopupHTML();
        this.items[0].after(this.popupHTML);
    }

    popupToggle = (e) => {
        e.preventDefault();
        this.popupNode.classList.toggle('breadcrumbs__popup_open');

        window.addEventListener('keydown', this.handleEscPress);
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    popupClose = () => {
        this.popupNode.classList.remove('breadcrumbs__popup_open');

        window.removeEventListener('keydown', this.handleEscPress);
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    handleEscPress = (e) => {
        if (e.code === 'Escape') {
            this.popupClose();
        }
        return true;
    }

    handleOutsideClick = (e) => {
        if (!this.popupNode.parentNode.contains(e.target)) {
            this.popupClose();
        }
    }

    destroy() {
        this.el.querySelector('ul').innerHTML = '';
        this.items.map((el) => {
            this.el.querySelector('ul').append(el);
        })
    }

    init() {
        if (window.matchMedia(this.mediaQueryString).matches) {
            this.appendPopup();
            this.activeFlag = true;
        }
    }

    watchResize = () => {
        if (!this.activeFlag && window.matchMedia(this.mediaQueryString).matches) {
            console.log('true')
            this.appendPopup();
            this.activeFlag = true;
            return true;
        }
        if (this.activeFlag && !window.matchMedia(this.mediaQueryString).matches) {
            console.log('destroy')
            this.destroy();
            this.activeFlag = false;
            return true;
        }
    }

}