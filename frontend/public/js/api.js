const addData = async (route, data) => {
    try {
        const res = await axios.post(route, data);
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        // todo? Display success?
        return res.data;
    } catch (error) {
        // todo!
        console.error(error);
        return error.response.data
    }
};

const updateAccount = async(route, value) => {
    try {
        const res = await axios.put(route, {
            amount: Number(value),
        })
        return res.data
    } catch (error) {
        // todo! Display modal?
        return error.response.data;
    }
}

const fetchData = async(route) => {
    try {
        const res = await axios.get(route);
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        return res.data.accounts; 
    } catch (error) {
        // todo! Display modal?
        console.log(error.response.data.error);
    }
}

const deleteDocument = async(route) => {
    try {
        const res = await axios.delete(route);
        return res.data
    } catch (error) {
        // todo! Display modal?
        console.log(error);
        return error.response.data
    }
}