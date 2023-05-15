document.addEventListener("click", (e) => {
    const { target } = e;
    if (target.tagName === "A" && target.href.includes("/profile/")) {
        console.log("click", e, target);
        e.preventDefault();
        console.log("inne");
        const id = target.href.split("/").pop();
        console.log(id);
        renderProfile(id);
    }
})

