import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile page");
    }
    async getHtml() {
        const id = window.location.href.split("/").at(-1);
        
        const profile = await fetchData(`/api/accounts/${id}`);
        console.log(profile);

        if (profile) {
            const div = createElement("div");
            const name = createElement("h1", "", profile.name);
            const profilId = createElement("p", "", `Account #${id}`);
            const amount = createElement("p", "", `Amount $${profile.amount}`);
            div.append(name, profilId, amount);
            return div.outerHTML;
        } else {
            // todo! Person not found
        }
    }
}
