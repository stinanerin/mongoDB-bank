import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.id = window.location.href.split("/").at(-1).split("?")[0];
        this.setTitle("Profile page");
    }
    async getHtml() {
        const profile = await fetchData(`/api/accounts/${this.id}`);

        if (profile) {
            const div = createElement("div");
            const name = createElement("h2", "", profile.name);
            const profilId = createElement("p", "", `Account #${this.id}`);
            const amount = createElement("p", "", `Amount $${profile.amount}`);
            div.append(name, profilId, amount);
            div.innerHTML += `
            <div>
                <h3>Account options:</h3>
                <div>
                    <form id="transaction">
                        <h4>Transaction</h4>
                        <div class="form-group">
                            <label class="form-label" for="transInput">Enter amount:</label>
                            <input class="form-control" id="transInput" type="number" placeholder="Enter amount " required/>
                        </div>
                        <button class="btn" aria-label="Make a deposit">Deposit</button>
                        <button class="btn" aria-label="Make a withdrawal">Withdraw</button>
                    </form>
                        
                    <form id="deleteAcc">
                        <h4>Delete Account</h4>
                        <button class="btn" aria-label="Delete account">Delete</button>

                    </form>
                </div>
            </div>`;
            return div.outerHTML;
        } else {
            // todo! Person not found
        }
    }
    addEventListeners() {
        document
            .querySelector("#transaction")
            .addEventListener("submit", (e) => this.handleTransactionSubmit(e));
    }

    async handleTransactionSubmit(e) {
        e.preventDefault();
        console.log("in form");

        const transactionAmount = e.target.querySelector("input").value;

        try {
            const response = await updateAccount(
                `/api/accounts/${this.id}/update-amount`,
                transactionAmount
            );
            console.log(response);

            if (response) {
                await this.updateUI();
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }
    async updateUI() {
        try {
            const html = await this.getHtml();
            document.querySelector("#app").innerHTML = html;
        } catch (error) {
            console.error("Error occurred:", error);
            // Handle the error appropriately, e.g., display an error message to the user.
        }
    }
}
