import { displayModal } from "./components/modal.js";

document.querySelector("#logoutUser").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("/api/user/logout");
        if (!res.data.loggedin) {
            location.reload();
        } else {
            throw new Error();
        }
    } catch (error) {
        // Handle any network or server errors
        console.error("Log out error:", error);
        displayModal();
    }
});
