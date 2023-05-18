import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.id = window.location.href.split("/").at(-1).split("?")[0];
        this.setTitle("Profile page");
    }
    async getHtml() {
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

                        <button type="submit" class="btn" name="action" value="deposit" aria-label="Make a deposit">Deposit</button>
                        <button type="submit" class="btn" name="action" value="withdraw" aria-label="Make a withdrawal">Withdraw</button>
                    </form>
                        
                    <form id="deleteForm">
                        <h4>Delete Account</h4>
                        <button class="btn" aria-label="Delete account">Delete</button>
                    </form>
                </div>
            </div>`;
            return div.outerHTML;
        } else {
            // todo! account not found
            //! render 404?
            return `<p>The account no longer exists</p>`;
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
            if (res) {
                await this.updateUI();
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error("Error occurred:", error);
            const transactionError =
                document.querySelector("#transactionError");
            transactionError.innerHTML = ` 
            <div class="alert-danger" role="alert">
                <div class="col-auto">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="col">
                    <span>Something went wrong with the transaction. Please try again later.</span>
                </div>
            </div>`;
        }
    }
    async updateUI() {
        try {
            document.querySelector("#app").innerHTML = await this.getHtml();
            // Re-add event listeners after updating the UI since they are "removed" when reloading the HTML
            this.addEventListeners();
        } catch (error) {
            // todo!
            console.error("Error occurred:", error);
        }
    }
    async deleteAccount(e) {
        e.preventDefault();

        try {
            const response = await deleteDocument(`/api/accounts/${this.id}`);
            if(response) {
                // todo! Some succes msg
                this.getHtml();
            }
        } catch (error) {
            // todo!
            console.error("Error occurred:", error);
        }
    }
}
