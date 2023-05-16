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
                    <form id="deposit">
                        <h4>Deposit</h4>
                        <input type="number" placeholder="Enter amount to deposit" required/>
                        <button class="btn" aria-label="Make a deposit">Deposit</button>
                    </form>

                    <form id="withdraw">
                        <h4>Withdraw</h4>
                        <input type="number" placeholder="Enter amount to withdraw" required/>
                        <button class="btn" aria-label="Make a withdrawal">Withdraw</button>
                    </form>
                </div>
            </div>`;
            return div.outerHTML;
        } else {
            // todo! Person not found
        }
    }
    addEventListeners() {
        //todo! OBS! Det skall inte gå att ta bort mer pengar än det finns på kontot!

        document.querySelector("#deposit").addEventListener("submit", (e) => {
            e.preventDefault()
            console.log(e.target);
            console.log(e.target.querySelector("input").value);
        });
    }

}
