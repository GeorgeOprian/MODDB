import axios from "axios";

export const getClientWithRent = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractBucuresti`, {
        params: {
            clientsWithContracts: true
        }
    })

    return data;
}

export const getClientContracts = async (idChirias?: number) => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractBucuresti`, {
        params: {
            idChirias: idChirias
        }
    })

    return data;
}

export const getAllPaidRents = async() => {
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/plataBucuresti`, )

    return data;
}

export const deletePayDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/plataBucuresti/${id}`)

    return data;
}
