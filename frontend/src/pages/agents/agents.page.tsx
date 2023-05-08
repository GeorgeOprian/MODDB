import { Box, Button, IconButton, LinearProgress, Menu, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { observer } from "mobx-react-lite";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteAgentDB, getAgents } from "./agents.page.requests";
import AgentPanel from "./components/agent-panel/agent.panel";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

  const TableHeaders = [
    "Nume",
    "Prenume",
    "Telefon",
    "Email",
    "Data angajare",
    "Salariu (RON)",
    "Comision",
    "Actiuni"
]

const ITEM_HEIGHT = 48;

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const AgentsPage = observer(() => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [agents, setAgents] = useState<any[]>()
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [currentAgent, setCurrentAgent] = useState()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    const editPanel = () => {

        panelState.setOpenPanel({
            body: (<AgentPanel editAgent={currentAgent} />)
        });
        setAnchorEl(null);
    }

    const deleteDialog = () => {
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
                    await deleteAgentDB((currentAgent as any).idAgent);
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
    }

    return (
        <div
        className='apartment-page-style'
    >
        <div 
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <h1>Agenti</h1>
            <div>
                <Button
                    onClick={createPanel}
                    variant="contained"
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    Adauga agent
                </Button>
            </div>
        </div>

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
                <TableRow sx={{ backgroundColor: "black"}}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[0]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[1]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[2]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[3]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[4]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[5]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[6]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[7]}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>

                    {
                        loading ?
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <LinearProgress color="success"/>
                                </TableCell>
                            </TableRow>
                            :
                            <>
                                {(rowsPerPage > 0
                                    ? (agents?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                    : (agents ?? [])
                                ).map((agent, index) => (
                                    <TableRow key={agent.idApartament}>
                                        <TableCell component="th" scope="row">
                                            {agent.nume}
                                        </TableCell>
                                        <TableCell align="center">
                                            {agent.prenume}
                                        </TableCell>
                                        <TableCell align="center">
                                            {agent.telefon}
                                        </TableCell>
                                        <TableCell align="center">
                                            {agent.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {new Date(agent.dataAngajare).toLocaleDateString('ro-RO').toString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            {agent.salariu}
                                        </TableCell>
                                        <TableCell align="center">
                                            {agent.comision}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(e) => {
                                                    handleClick(e);
                                                    setCurrentAgent(() => agent)
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                    'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: ITEM_HEIGHT * 4.5,
                                                        width: '20ch',
                                                    },
                                                }}
                                            >
                                                
                                                <MenuItem 
                                                    onClick={() => editPanel()}
                                                >
                                                    Editeaza
                                                </MenuItem>
                                                <MenuItem 
                                                    onClick={() => deleteDialog()}
                                                >
                                                    Sterge
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                    }
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={TableHeaders.length}
                    count={agents?.length ?? 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: {
                        'aria-label': 'rows per page',
                        },
                        native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        
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