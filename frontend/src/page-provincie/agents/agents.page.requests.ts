import axios from "axios";

export const getAgents = async () => {
    
    let { data } = await axios.get(`${process.env.REACT_APP_API_URL}/agentProvincie`)

    return data;
}
