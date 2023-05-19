import AbstractView from "./AbstractView.js";
import { displayAlert } from "../components/alert.js";
import { displayModal } from "../components/modal.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.id = window.location.href.split("/").at(-1).split("?")[0];
        this.setTitle("Profile page");
    }
    async getHtml() {
        try {

            const account = await fetchData(`/api/accounts/${this.id}`);

            if (account) {
                const div = createElement("div");
                const name = createElement("h2", "", account.name);
                const accountId = createElement("p", "", `Account #${this.id}`);
                const amount = createElement("p", "", `Amount $${account.amount}`);
                div.append(name, accountId, amount);
                div.innerHTML += `
                <div>
                    <h3>Account options:</h3>
                    <div>
                        <form id="transactionForm">
                            <h4>Transaction</h4>
                            <div class="form-group">
                                <label class="form-label" for="transactionInput">Enter amount:</label>
                                <input class="form-control" id="transactionInput" type="number" placeholder="Enter amount " required/>
                            </div>
    
                            <div id="transactionError" ></div>
    
                            <div class="btn-wrapper">
                                <button type="submit" class="btn" name="action" value="deposit" aria-label="Make a deposit">Deposit</button>
                                <button type="submit" class="btn" name="action" value="withdraw" aria-label="Make a withdrawal">Withdraw</button>
                            </div>
                        </form>
                            
                        <form id="deleteForm">
                            <h4>Delete Account</h4>
                            
                            <div id="deleteAccError" ></div>
    
                            <div class="btn-wrapper"><button class="btn" aria-label="Delete account">Delete</button></div>
                        </form>
                    </div>
                </div>`
                return div.outerHTML;
            } else {
                return `<p>The account no longer exists</p>`;
            }
        } catch (error) {
            // Handle any network or server errors
            console.error("Account #id fetch error:", error);
            displayModal();
        }

    }
    addEventListeners() {
        document
            .querySelector("#transactionForm")
            ?.addEventListener("submit", (e) =>
                this.handleTransactionSubmit(e)
            );

        document
            .querySelector("#transactionInput")
            ?.addEventListener("input", () => {
                clearNumericInput("transactionInput");
            });

        document
            .querySelector("#deleteForm")
            ?.addEventListener("submit", (e) => this.deleteAccount(e));
    }

    async handleTransactionSubmit(e) {
        e.preventDefault();

        let transactionAmount = e.target.querySelector("input").value;

        if (e.submitter.value === "withdraw") {
            transactionAmount = transactionAmount * -1;
        }

        try {
            const res = await updateAccount(
                `/api/accounts/${this.id}/update-amount`,
                transactionAmount
            )
            if (res.acknowledged) {
                await this.updateUI();
            } else if (res.error === "Current balance of $3434 is too low for the withdrawl amount") {
                console.log(res);
                displayAlert(transactionError, res.error);
            } else {
                throw new Error()
            }
        } catch (error) {
            console.error("Error occurred with transaction:", error);
            const transactionError =
                document.querySelector("#transactionError");
            displayModal("...when making the transaction. Please try again later.");           
        }
    }
    async updateUI() {
        try {
            document.querySelector("#app").innerHTML = await this.getHtml();
            // Re-add event listeners after updating the UI since they are "removed" when reloading the HTML
            this.addEventListeners();
        } catch (error) {
            console.error("Error occurred:", error);
            displayModal();
        }
    }
    async deleteAccount(e) {
        e.preventDefault();
        try {
            const res = await deleteDocument(`/api/accounts/${this.id}`);
            console.log(res);
            if (res.acknowledged) {
                // todo! Some succes msg
                console.log(this);
                document.querySelector("#app").innerHTML = await this.getHtml();
            } else {
                throw new Error()
            }
        } catch (error) {
            console.error("Error occurred when DEL acc :", error);
            displayModal(
                "...when deleting account. Please try again later."
            );
        }
    }
}
