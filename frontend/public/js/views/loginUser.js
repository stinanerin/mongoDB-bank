import AbstractView from "./AbstractView.js";
import { displayAlert } from "../components/alert.js";


export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }
    async getHtml() {
        return `
            <div class="form-wrapper">
                <form class="form" id="loginForm">
                    <h2>Log in</h2>
                    <div class="form-group">
                        <label for="loginName" class="form-label">
                            Username<sup>*</sup>
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            id="loginName"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div id="loginError"></div>
                    <div class="form-group">
                        <label for="loginPwd" class="form-label">
                            Password<sup>*</sup>
                        </label>
                        <input
                            class="form-control"
                            type="password"
                            id="loginPwd"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button class="btn">Log in</button>
                </form>
            </div>`;
    }
    addEventListeners() {
        document
            .querySelector("#loginForm")
            .addEventListener("submit", (e) => this.loginUser(e));
    }
    async loginUser(e) {
        e.preventDefault();
        const loginName = document.querySelector("#loginName").value;
        const loginPass = document.querySelector("#loginPwd").value;
        console.log(loginName, loginPass);

        try {
            const res = await addData("/api/user/login", {
                loginName,
                loginPass,
            });
            console.log("Login result: ", res.acknowledged);
            if (res.acknowledged) {
                // Navigates to the route the user previously visited before signing in
                window.history.back();
            } else {
                const loginError = document.querySelector("#loginError");
                displayAlert(loginError, "Invalid username or password.");
            }
        } catch (error) {
            // Handle any network or server errors
            console.error("Login error:", error);
            displayModal(error);
        }
    }
}
