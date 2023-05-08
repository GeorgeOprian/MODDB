import axios from "axios";

export const getAgents = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/agent`)

    return data;
}

export const editAgentDB = async(body: any, id: number) => {

    let { data } = await axios.put(`${process.env.REACT_APP_API_URL}/agent/${id}`, body)

    return data;
}

export const createAgentDB = async(body: any) => {

    let { data } = await axios.post(`${process.env.REACT_APP_API_URL}/agent`, body)

    return data;
}

export const deleteAgentDB = async (id: number) => {
    let { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/agent/${id}`)

    return data;
}