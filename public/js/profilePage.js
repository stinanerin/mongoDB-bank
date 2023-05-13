const renderProfile = async (id) => {
    const profile = await fetchData(`/api/accounts/${id}`);
    console.log(profile);

    if (profile) {
        const div = createElement("div");
        const name = createElement("h1", "", profile.name);
        const id = createElement("p", "", `Account #${id}`);
        const amount = createElement("p", "", `Amount $${profile.amount}`);
        div.append(name, id, amount);
        document.body.append(div);
    } else {
        // todo! Person not found
    }
};


