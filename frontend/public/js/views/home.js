import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Bank");
    }
    async getHtml() {
        return `
            <h2>Bank</h2>
            <p>Welcome to our bank! We offer a range of services to help you manage your money and achieve your financial goals. With our easy-to-use interface, you can create and manage multiple accounts, deposit and withdraw funds, and view your transaction history all in one place.</p>
            <div class="btn-wrapper">
                <a href="/accounts" class="btn" data-link>View accounts</a>
            </div>
        `;
    }
}
