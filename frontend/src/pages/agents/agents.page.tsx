import { Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import { deleteAgentDB, getAgents } from "./agents.page.requests";
import AgentPanel from "./components/agent-panel/agent.panel";
import TableComponent from "../../components/table/table.component";
import { MenuActionItemsType, TableHeaderTypes } from "../../components/table/table.component.types";
import { styleHeader } from "../addresses/addresses.page";

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

const AgentsPage = observer(() => {

    const [agents, setAgents] = useState<any[]>()
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentAgent, setCurrentAgent] = useState<any>()

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

    const createPanel = () => {

        panelState.setOpenPanel({
            body: (<AgentPanel />)
        });
        setAnchorEl(null);
    }

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
                },
                {
                    style: styleHeader,
                    value: "Salariu (RON)"
                },
                {
                    style: styleHeader,
                    value: "Comision"
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
                        salariu: {
                          value: agent.salariu
                        },
                        comision: {
                          value: agent.comision
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

    const menuActionItems: MenuActionItemsType[] = useMemo(
        () => {
            
            if(!currentAgent) return [];
      
            let currentAgentValues = {
                nume: (currentAgent?.nume as any).value,
                prenume: (currentAgent?.prenume as any).value,
                telefon: (currentAgent?.telefon as any).value,
                email: (currentAgent?.email as any).value,
                dataAngajare: (currentAgent?.dataAngajare as any).value,
                salariu: (currentAgent?.salariu as any).value,
                comision: (currentAgent?.comision as any).value,
                idAgent: (currentAgent?.idAgent as any).value,
            }
    
            return [
                {
                    action: () => {
                        panelState.setOpenPanel({
                            body: (<AgentPanel editAgent={currentAgentValues} />)
                        });
                    },
                    actionTitle: "Edit"
                },
                {
                    action: () => {
                        dialogState.setDialog({
                            open: true,
                            dialogTitle: "Stergi agentul...",
                            dialogContent: "Esti sigur ca vrei sa stergi agentul?",
                            actionOne: () => {
                                dialogState.setDialog(undefined);
                                setAnchorEl(null);
                            },
                            textButtonOne: "Anuleaza",
                            actionTwo: async () => {
                                try {
                                    await deleteAgentDB((currentAgent as any).idAgent.value);
                                    dialogState.setDialog(undefined);
                                    panelState.setRefreshData({
                                        refreshAgents: true
                                    });
                                    toastState.setToast({
                                        open: true,
                                        message: "Actiune realizata cu succes"
                                    });
                                    setAnchorEl(null);
                                } catch (error) {
                                    toastState.setToast({
                                        open: true,
                                        message: "Eroare"
                                    })
                                }
                                
                            },
                            textButtonTwo: "Sterge"
                        })
                    },
                    actionTitle: "Delete"
                }
            ]
        },
        [currentAgent]
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
                menuActionItems={{
                    actions: menuActionItems,
                    title: {
                        value: "Actions",
                        align: "right",
                        style: styleHeader
                    }
                }}
                rowDetails={(value) => setCurrentAgent(() => value)}
                loading={loading}
                headerButtonTitle="Adauga agent"
                headerButton={createPanel}
                title="Agenti"
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

export default AgentsPage;