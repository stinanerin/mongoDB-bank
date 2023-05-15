import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Accounts");
    }
    // Load html from sevrer side
    async getHtml() {
        const accArr = await fetchData("/api/accounts");

        if (accArr) {
            const ul = createElement("ul");
            ul.append(createElement("h2", "", "Accounts"));
            accArr.forEach(({ name, amount, _id }) => {
                const li = createElement("li");
                const a = createElement("a");
                a.href = `/profile/${_id}`;
                a.innerHTML = `Account# ${_id} <br> ${name} <br> ${amount}`;
                li.append(a);
                ul.append(li);
            });
            // Returns the HTML string representation of the ul element
            return ul.outerHTML;
        } else {
            // todo! No registered accounts
        }
    }
}
