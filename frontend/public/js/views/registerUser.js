import AbstractView from "./AbstractView.js";

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
                regPass
            })

            console.log("Register user res: ",res);
            if (res.acknowledged) {
                // Navigates to the route the user rpeviously visited before registering in
                window.history.back();
            } else {
                const registerError = document.querySelector("#registerError");
                registerError.innerHTML = ` 
                <div class="alert-danger" role="alert">
                    <div class="col-auto">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="col">
                        <span>${res.error}.</span>
                    </div>
                </div>`;
            }
        } catch (error) {
            // Handle any network or server errors
            // todo! display modal?
            console.error("Login error:", error);
        }


    }
}
