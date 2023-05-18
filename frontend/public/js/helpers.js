const createElement = (type, aClass, str) => {
    let elem = document.createElement(type);
    if (aClass) {
        elem.className = aClass;
    }
    if (str) {
        elem.innerText = str;
    }
    return elem;
};

const clearNumericInput = (id) => {
    const elem = document.querySelector(`#${id}`);
    const elemValue = elem.value;
    const cleansedValue = elemValue.replace(/[^0-9]/g, "");
    elem.value = cleansedValue;
};

const addClass = (arr, aClass) => {
    arr.forEach((elem) => elem.classList.add(aClass));
};

const removeClass = (arr, aClass) => {
    arr.forEach((elem) => elem.classList.remove(aClass));
};

const removeAttribute = (arr, attributeName) => {
    arr.forEach((element) => {
        element.removeAttribute(attributeName);
    })
}

const setCurrentPage = () => {
    const currentPath = location.pathname;
    const navLinks = document.querySelectorAll("[data-link]");

    removeClass(navLinks, "active");
    removeAttribute(navLinks, "aria-current");

    const activeLink = [...navLinks].find(
        (link) => link.pathname === currentPath
    )

    addClass([activeLink], "active");
    activeLink.setAttribute("aria-current", "page");

}