import axios from "axios";

export const getClientWithRent = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractProvincie`, {
        params: {
            clientsWithContracts: true
        }
    })

    return data;
}

export const getClientContracts = async (idChirias?: number) => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractProvincie`, {
        params: {
            idChirias: idChirias
        }
    })

    return data;
}

export const getAllPaidRents = async() => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/plataProvincie`, )

    return data;
}

export const deletePayDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/plataProvincie/${id}`)

    return data;
}
