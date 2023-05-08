import axios from "axios";

export const getApartments = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/apartament`)

    return data;
}

export const getAddresses = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/adresa`)

    return data;
}

export const editApartmentDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/apartament/${id}`, body)

    return data;
}

export const createApartmentDB = async(body: any) => {

    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/apartament`, body)

    return data;
}

export const deleteApartmnetDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/apartament/${id}`)

    return data;
}