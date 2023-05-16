import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Account");
    }

    async getHtml() {
        return `
            <div class="form-wrapper">

                <h2>Create account</h2>
                
                <form action="" class="form" id="createAccount" >

                    <div class="form-group">
                        <label for="accountName" class="form-label">Choose name for account<sup>*</sup></label>
                        <input class="form-control" type="text" id="accountName" placeholder="Enter account name" required />
                    </div>

                    <div class="form-group">
                        <label for="accountAmount" class="form-label">Amount<sup>*</sup> </label>
                        <input class="form-control" type="number" id="accountAmount" placeholder="Enter the amount" required />
                    </div>

                    <button class="btn">Create account</button>
                    
                </form>

            </div>`;
    }
    async addEventListeners() {
        document.querySelector("#createAccount").addEventListener("submit", async (e) => {
            e.preventDefault();

            const accName = document.querySelector("#accountName").value;
            const accAmount = document.querySelector("#accountAmount").value;
            const response = await addData("/api/accounts", {
                accName,
                accAmount,
            });
            console.log(response);
            // todo! succes creating account
        });
    }
}

