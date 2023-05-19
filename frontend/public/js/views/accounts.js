import AbstractView from "./AbstractView.js";
import { displayModal } from "../components/modal.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Accounts");
    }
    // Load html from server side
    async getHtml() {
        try {
            const accArr = await fetchData("/api/accounts");

            if (accArr.length > 0) {
                const ul = createElement("ul", "accounts-list");
                ul.append(createElement("h2", "", "Accounts"));
                accArr.forEach(({ name, amount, _id }) => {
                    const li = createElement("li");
                    const a = createElement("a");
                    a.href = `/profile/${_id}`;
                    a.setAttribute("data-link", "");
                    a.innerHTML = `Account# ${_id} <br> ${name} <br> ${amount}`;
                    li.append(a);
                    ul.append(li);
                });
                // Returns the HTML string representation of the ul element
                return ul.outerHTML;
            } else {
                return `
                <h2>Accounts</h2>
                <p>No registered accounts.</p>`;
            }
        } catch (error) {
            // Handle any network or server errors
            console.error("Accounts list error:", error);
            displayModal();
            return ""
        }
    }
}
