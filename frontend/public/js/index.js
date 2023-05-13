//! new

// asynkron laddar innehåller för varje view/route/path
const router = async () => {
    const routes = [
        // root path - view:

        { path: "/", view: () => console.log("viewing home") },
        { path: "/accounts", view: () => console.log("viewing accounts") },
        {
            path: "/accounts/:id",
            view: () => console.log("viewing accounts/:id"),
        },
    ];

    // Test each route for potential match
    // loopar igenom och retunerar
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            // Does the current url location match a route
            isMatch: location.pathname === route.path,
        };
    });

    console.log("potentialMatches", potentialMatches);

    // Finds the route with the isMatch: true
    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    // If match is undefined - navigate to home page
    if (!match) {
        match = { 
            route: routes[0], 
            isMatch: true
        };
    }
    console.log("match", match.route.view());
};

// Listens to DOM loads
document.addEventListener("DOMContentLoaded", () => {
    // document.body.addEventListener("click", (e) => {
    //     if (e.target.matches("[data-link]")) {
    //         e.preventDefault();
    //         navigateTo(e.target.href);
    //     }
    // });

    router();
});
