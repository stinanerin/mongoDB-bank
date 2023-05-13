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
