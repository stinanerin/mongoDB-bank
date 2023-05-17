document.querySelector("#logoutUser").addEventListener("submit", async (e) => {
    e.preventDefault();
    // todo! try catch
    const res = await axios.post("/api/user/logout");
    if(!res.data.loggedin) {
        location.reload();
    }
    
});
