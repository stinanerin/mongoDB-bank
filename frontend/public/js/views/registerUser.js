import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Register");
    }
    async getHtml() {
        return `
            <form class="form" id="registerForm">
                <h2>Register</h2>
                <div class="form-group">
                    <label for="registerName" class="form-label">
                        Username<sup>*</sup>
                    </label>
                    <input
                        class="form-control"
                        type="text"
                        id="registerName"
                        placeholder="Enter username"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="registerPwd" class="form-label">
                        Password<sup>*</sup>
                    </label>
                    <input
                        class="form-control"
                        type="password"
                        id="registerPwd"
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button class="btn">Register</button>
            </form>`;
    }
    addEventListeners() {
        document
            .querySelector("#registerForm")
            .addEventListener("submit", (e) => this.registerUser(e));
    }
    async registerUser(e) {
        e.preventDefault();

        const regName = document.querySelector("#registerName").value;
        const regPass = document.querySelector("#registerPwd").value;

        const res = await addData("/api/user/register", {
            regName,
            regPass
        })
        console.log("Register user res: ",res);

    }
}
