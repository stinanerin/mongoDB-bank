import home from "./views/home.js";
import createAccount from "./views/createAccount.js";
import accounts from "./views/accounts.js";
import profile from "./views/profile.js";
import loginUser from "./views/loginUser.js";
import registerUser from "./views/registerUser.js";
import loginReq from "./views/loginReq.js";
import pageNotFound from "./views/404.js";

// Navigates to a specific url and updates the history
export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const isAuthenticated = async () => {
    try {
        // todo! use fetchData
        const res = await axios.get("/api/user/active");
        // console.log(res);
        return res.data.acknowledged;
    } catch (error) {
        return error.response.data.acknowledged;
    }
};

// Asynchronous function that loads content for each view/route/path
const router = async () => {
    const routes = [
        // Root route - view: home class reference
        { path: "/", view: home },
        // Accounts route - View all accounts:
        { path: "/accounts", view: accounts, requiresAuth: true },
        // Create Account route - View form for creating an account:
        {
            path: "/create-account",
            view: createAccount,
            requiresAuth: true,
        },
        {
            path: "/profile",
            view: profile,
            requiresAuth: true,
        },
        {
            path: "/login",
            view: loginUser,
        },
        {
            path: "/register",
            view: registerUser,
        },
        {
            path: "/404",
            view: pageNotFound,
        },
    ];

    // Test each route for potential match
    // Loops through each route and returns an object with the route and a boolean isMatch value
    const potentialMatches = routes.map((route) => {
        if (location.pathname.split("/")[1] === route.path.split("/")[1]) {
            return {
                route: route,
                // Does the current url location match a specified route
                isMatch: true,
            };
        } else {
            return {
                route: route,
                // Does the current url location match a specified route
                isMatch: location.pathname === route.path,
            };
        }
    });

    // Finds the route with the isMatch: true key/value pair
    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    // If match is undefined - navigate to home page
    if (!match) {
        match = {
            route: routes.find(route => route.path === "/404"),
            isMatch: true,
        };
    }
    console.log(match);
    console.log("match.route.requiresAuth", match.route.requiresAuth);

    const isAuth = await isAuthenticated();
    
    // todo! do this entire below block better!!!
    const loginLink = document.querySelector("#loginLink");
    const registerLink = document.querySelector("#registerLink");
    const logoutLink = document.querySelector("#logoutUser");
    if (isAuth) {
        addClass([loginLink, registerLink], "hidden");
        removeClass([logoutLink], "hidden");
    } else {
        removeClass([loginLink, registerLink], "hidden");
        addClass([logoutLink], "hidden");
    }
    if (match.route.requiresAuth && !isAuth) {
        /* If route requires authenticated user & user is not authenticated(signed in),
        prevent user from viewing route */
        console.log("ej auth");
        match = {
            isMatch: true,
            route: {
                path: match.route.path,
                requiresAuth: true,
                view: loginReq,
            },
        };
        console.log(match);
    }



    // Creates new instance of the view: importedClass - at the match route
    const currentView = new match.route.view();
    // console.log("currentView", match.route);

    // Set the current views HTML as the main div:s HTML
    document.querySelector("#app").innerHTML = await currentView.getHtml();

    // If addEventListener method exists on currentView instance - invoke it
    if (currentView.addEventListeners) {
        currentView.addEventListeners();
    }

    setCurrentPage();

};

// Adds an event listener for when the user navigates using browser history buttons, and calls the router function.
window.addEventListener("popstate", () => router());

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
