import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile page");
    }
    async getHtml() {
        const id = window.location.href.split("/").at(-1);

        const profile = await fetchData(`/api/accounts/${id}`);

        if (profile) {
            const div = createElement("div");
            const name = createElement("h2", "", profile.name);
            const profilId = createElement("p", "", `Account #${id}`);
            const amount = createElement("p", "", `Amount $${profile.amount}`);
            div.append(name, profilId, amount);
            div.innerHTML += `
            <div>
                <h3>Account options:</h3>
                <div>
                    <button class="btn" id="deposit" aria-label="Make a deposit">Deposit</button>
                    <button class="btn" id="withdraw" aria-label="Make a withdrawal">Withdraw</button>
                </div>
            </div>`;
            return div.outerHTML;
        } else {
            // todo! Person not found
        }
    }
}
