
const renderAccList = async() => {
    const accArr = await fetchData("/api/accounts");
    console.log(accArr);
}

renderAccList()