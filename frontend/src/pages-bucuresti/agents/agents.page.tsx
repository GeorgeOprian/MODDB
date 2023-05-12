import { Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo, useState } from "react";
import { PanelContext, ToastContext } from "../../mobx/store";
import { getAgents } from "./agents.page.requests";
import TableComponent from "../../components/table/table.component";
import { styleHeader } from "../addresses/addresses.page";
import { TableHeaderTypes } from "../../components/table/table.component.types";

export type AgentType = {
    idAgent: number,
    prenume: string,
    nume: string,
    telefon: string,
    email: string,
    dataAngajare: Date,
    salariu: number,
    comision: number
}

const AgentsBucurestiPage = observer(() => {

    const [agents, setAgents] = useState<any[]>()
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(
        () => {
            setLoading(() => true)
            getAgents()
            .then(data => setAgents(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
      ) 
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshAgents) return; 

            setLoading(() => true)
            getAgents()
            .then(data => {
                setAgents(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const tableHeadersAgent: TableHeaderTypes[] = useMemo(
        () => {
            return [
                {
                    style: styleHeader,
                    value: "Nume",
                    align: "left"
                },
                {
                    style: styleHeader,
                    value: "Prenume"
                },
                {
                    style: styleHeader,
                    value: "Telefon"
                },
                {
                    style: styleHeader,
                    value: "Email"
                },
                {
                    style: styleHeader,
                    value: "Data angajare"
                }
            ]
        },
        []
    )
    
    const rowsAgenti: TableHeaderTypes[] = useMemo(
        () => {
            if(!agents) return []
    
            return agents.map((agent: AgentType) => {
                return {
                    value: {
                        nume: {
                          align: "left",
                          value: agent.nume
                        },
                        prenume: {
                          value: agent.prenume
                        },
                        telefon: {
                          value: agent.telefon
                        },
                        email: {
                          value: agent.email
                        },
                        dataAngajareFormated: {
                          value: new Date(agent.dataAngajare).toLocaleDateString('ro-RO').toString()
                        },
                        idAgent: {
                          value: agent.idAgent,
                          hideCell: true
                        },
                        dataAngajare: {
                            value: agent.dataAngajare,
                            hideCell: true
                        }
                    }
                }
            })
        },
        [agents]
    )

    return (
        <div
            style={{
                paddingRight: "2rem",
                paddingLeft: "2rem",
                minHeight: "90vh",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <TableComponent
                tableHeaders={{
                    items: tableHeadersAgent,
                    style: {
                        backgroundColor: "black",
                    }
                }}
                rows={rowsAgenti}
                loading={loading}
                title="Agenti Bucuresti"
            />

            <Snackbar
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                open={toastState.toast?.open}
                onClose={() => toastState.setToast(undefined)}
                message={toastState.toast?.message}   
                autoHideDuration={2500}
            />
        </div>
    )

})

export default AgentsBucurestiPage;