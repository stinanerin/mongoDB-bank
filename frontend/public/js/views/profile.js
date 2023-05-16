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
 
        document.querySelector("#deposit").addEventListener("submit", async(e) => {
            e.preventDefault()
    
            const depositAmount = e.target.querySelector("input").value;

            const response = await updateAccount(
                `/api/accounts/${this.id}/update-amount`,
                depositAmount
            );
            console.log(response);
            if(response) {

                console.log(await this.getHtml());
                document.querySelector("#app").innerHTML = await this.getHtml();
            }

        });
    }

}
