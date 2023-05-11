import axios from "axios";

export const getAddresses = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adresaBucuresti`)

    return data;
}

export const getCounties = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/localitateBucuresti`)

    return data;
}

export const editAddressDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/adresaBucuresti/${id}`, body)

    return data;
}

export const createAddressDB = async(body: any) => {

    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/adresaBucuresti`, body)

    return data;
}

export const deleteAddressDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/adresaBucuresti/${id}`)

    return data;
}