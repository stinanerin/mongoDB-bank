import AbstractView from "./AbstractView.js";
import { displayAlert } from "../components/alert.js";
import { displayModal } from "../components/modal.js";
import { navigateTo } from "../routes.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Register");
    }
    async getHtml() {
        return `
            <div class="form-wrapper">
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
                    <div id="registerError"></div>
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
                </form>
            </div>`;
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

        try {
            const res = await addData("/api/user/register", {
                regName,
                regPass,
            });

            console.log("Register user res: ", res);
            
            if (res.acknowledged) {
                // Navigates to /accounts
                navigateTo("/accounts");
            } else if (res.customError) {
                const registerError = document.querySelector("#registerError");
                displayAlert(registerError, res.error);
            } else {
                throw new Error(res.error)
            }
        } catch (error) {
            // Handle any network or server errors
            console.error("Login error:", error);
            displayModal(
                "...when registration the user. Please try again later."
            );
        }
    }
}
