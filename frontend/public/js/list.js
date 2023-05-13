
const renderAccList = async() => {
    const accArr = await fetchData("/api/accounts");
    console.log(accArr);

    if (accArr) {

        const ul = createElement("ul" )
        document.body.append(ul)
        console.log(ul);
        accArr.forEach(({name, amount, _id}) => {
            const li = createElement("li")
            const a = createElement("a")
            a.href=`/profile/${_id}`
            a.innerHTML = `Account# ${_id} <br> ${name} <br> ${amount}`;
            li.append(a)
            ul.append(li)
        });

    } else {
        // todo! No registered accounts
    }
}

renderAccList()

