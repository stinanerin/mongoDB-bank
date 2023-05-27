export const addData = async (route, data) => {
    try {
        const res = await axios.post(route, data);
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        return res.data;
    } catch (error) {
        console.error(error);
        return error.response.data
    }
};

export const updateAccount = async(route, value) => {
    try {
        const res = await axios.put(route, {
            amount: Number(value),
        })
        return res.data
    } catch (error) {
        return error.response.data;
    }
}

export const fetchData = async(route) => {
    try {
        const res = await axios.get(route);
        if (res.status !== 200) {
            console.log(res.response.statusText);
            throw new Error(res.response.statusText);
        }
        return res.data; 
    } catch (error) {
        return error.response.data
    }
}

export const deleteDocument = async(route) => {
    try {
        const res = await axios.delete(route);
        return res.data
    } catch (error) {
        console.log(error);
        return error.response.data
    }
}