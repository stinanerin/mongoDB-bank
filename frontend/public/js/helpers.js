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