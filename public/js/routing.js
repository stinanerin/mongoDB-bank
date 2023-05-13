document.addEventListener("click", (e) => {
    e.preventDefault();
    const { target } = e;
    console.log("click", e, target);
    if (target.tagName === "A" && target.href.includes("/profile/")) {
        console.log("inne");
        const id = target.href.split("/").pop();
        console.log(id);
        renderProfile(id);
    }
});

