import AbstractView from "./AbstractView.js";
import { navigateTo } from "../routes.js";
import { displayAlert } from "../components/alert.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Bank Account");
    }

    async getHtml() {
        return `
            <div class="form-wrapper">

                <h2>Create bank account</h2>
                
                <form action="" class="form" id="createAccount" >

                    <div class="form-group">
                        <label for="accountName" class="form-label">Choose name for account<sup>*</sup></label>
                        <input class="form-control" type="text" id="accountName" placeholder="Enter account name" required />
                    </div>

                    <div id="createAccError"></div>

                    <div class="form-group">
                        <label for="accountAmount" class="form-label">Amount<sup>*</sup> </label>
                        <input class="form-control" type="number" id="accountAmount" placeholder="Enter the amount" required />
                    </div>

                    <button class="btn">Create account</button>
                    
                </form>

            </div>`;
    }
    async addEventListeners() {
        document
            .querySelector("#createAccount")
            .addEventListener("submit", async (e) => {
                e.preventDefault();

                try {
                    const accName =
                        document.querySelector("#accountName").value;
                    const accAmount =
                        document.querySelector("#accountAmount").value;
                    const res = await addData("/api/acc,ounts", {
                        accName,
                        accAmount,
                    });

                    if (res.acknowledged) {
                        navigateTo((location.pathname = "/accounts"));
                    } else {
                        const createAccError =
                            document.querySelector("#createAccError");
                        const errMsg = res.error
                            ? res.error
                            : "Something went wrong, please try again later.";
                        displayAlert(createAccError, errMsg);
                    }
                } catch (error) {
                    // Handle any network or server errors
                    console.error("Create bank account error:", error);
                    displayModal(error);
                }
            });
    }
}
