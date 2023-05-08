import axios from "axios";

export const getAddresses = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adresa`)

    return data;
}

export const getCounties = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/localitate`)

    return data;
}

export const editAddressDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/adresa/${id}`, body)

    return data;
}

export const createAddressDB = async(body: any) => {

    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/adresa`, body)

    return data;
}

export const deleteAddressDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/adresa/${id}`)

    return data;
}