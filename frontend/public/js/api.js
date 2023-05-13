const addAccount = async (name, amount) => {
    try {
        const res = await axios.post(
            "/api/accounts",
            // Axios automatically parses data as JSON
            {
                name,
                amount,
            }
        );
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        // todo? Display success?
        return res.data.account
    } catch (error) {
        console.log(error);
    }
};

const fetchData = async(route) => {
    try {
        const res = await axios.get(route);
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        return res.data.accounts; 
    } catch (error) {
        // todo? Display modal?
        console.log(error);
    }

}