import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }
    async getHtml() {
        return `
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
            </form>`;
    }
}

;
