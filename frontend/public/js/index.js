//! new

import home from "./views/home.js";
import createAccount from "./views/createAccount.js";
import accounts from "./views/accounts.js";

// Navigates to a specific url and updates the history
const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

// Asynchronous function that loads content for each view/route/path
const router = async () => {
    const routes = [
        // Root route - view: home class reference
        { path: "/", view: home },
        // Accounts route - View all accounts:
        { path: "/accounts", view: accounts },
        // Create Account route - View form for creating an account:
        {
            path: "/create-account",
            view: createAccount,
        },
    ];

    // Test each route for potential match
    // Loops through each route and returns an object with the route and a boolean isMatch value
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            // Does the current url location match a specified route
            isMatch: location.pathname === route.path,
        };
    });

    console.log("potentialMatches", potentialMatches);

    // Finds the route with the isMatch: true key/value pair
    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    // If match is undefined - navigate to home page
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        };
    }
    // Creates new isntance of the view at the match route
    const currentView = new match.route.view();
    console.log("currentView", currentView);

    // Set the current views HTML as the main div:s HTML
    document.querySelector("#app").innerHTML = await currentView.getHtml();
};

// Adds an event listener for when the user navigates using browser history buttons, and calls the router function.
window.addEventListener("popstate", router);

// Listens to DOM loads
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        // Does the link have the [data-link] attribute
        if (e.target.matches("[data-link]")) {
            // Prevent following the link and site refresh
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});
