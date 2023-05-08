import axios from "axios";

export const getContracts = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contract`)

    return data;
}

export const getActiveContracts = async () => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/apartament`,
        {
            params: {
                busy: true
            }
        }
    )

    return data;
}

export const getFreeApartments = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/apartament`,
        {
            params: {
                busy: false
            }
        }
    )

    return data;
}

export const createContractDB = async (body: any) => {
    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/contract`, body)

    return data;
}

export const editContractDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/contract/${id}`, body)

    return data;
}

export const deleteContractDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/contract/${id}`)

    return data;
}

export const createPayRentDB = async(body: any) => {
    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/plata`, body)

    return data;
}

export const editPayRentDB = async(body: any, id: number) => {
    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/plata/${id}`, body)

    return data;
}