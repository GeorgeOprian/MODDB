import axios from "axios";

export const getClients = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/chiriasBucuresti`)

    return data;
}

export const editClientDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/chiriasBucuresti/${id}`, body)

    return data;
}

export const createClientDB = async(body: any) => {

    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/chiriasBucuresti`, body)

    return data;
}

export const deleteClientDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/chiriasBucuresti/${id}`)

    return data;
}