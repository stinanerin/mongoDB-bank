import AbstractView from "./AbstractView.js";
import { displayAlert } from "../components/alert.js";
import { displayModal } from "../components/modal.js";
import { navigateTo } from "../routes.js";


export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }
    async getHtml() {
        return `
            <div class="form-wrapper">
            <h2 class="form-heading">Log in</h2>
                <form class="form" id="loginForm">
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

                    <div class="center">
                        <button class="btn">Log in</button>
                    </div>

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

        try {
            const res = await addData("/api/user/login", {
                loginName,
                loginPass,
            });
            if (res.acknowledged) {
                // Navigates to /accounts
                navigateTo("/accounts");
            } else if (res.customError) {
                const loginError = document.querySelector("#loginError");
                displayAlert(loginError, res.error);
            } else {
                throw new Error(res.error);
            }
        } catch (error) {
            // Handle any network or server errors
            console.error("Login error:", error);
            displayModal(error);
        }
    }
}
