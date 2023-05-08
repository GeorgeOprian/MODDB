import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import { Button, LinearProgress, IconButton, Menu, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { deleteContractDB, getActiveContracts, getContracts } from "./rent.page.requests";
import RentPanel from "./components/rent-panel/rent.panel";

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
    "Adresa apartament",
    "Client",
    "Agent",
    "Data inceput",
    "Data final",
    "Ziua scandenta",
    "Pret inchiriere",
    "Incasari",
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

const RentPage = observer(() => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [contracts, setContracts] = useState<any[]>();
    const [activeAontracts, setActiveContracts] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [currentContract, setCurrentContract] = useState()

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
            getContracts()//contracts
            .then(data => setContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    )

    useEffect(
        () => {
            setLoading(() => true)
            getActiveContracts()//contracts
            .then(data => setActiveContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    ) 
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshContracts) return; 

            setLoading(() => true)
            getContracts()//contracts
            .then(data => {
                setContracts(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))

            getActiveContracts()//contracts
            .then(data => setActiveContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const createPanel = () => {

        panelState.setOpenPanel({
            body: (<RentPanel  />)
        });
        setAnchorEl(null);
    }

    const editPanel = () => {
        panelState.setOpenPanel({
            body: (<RentPanel editContract={currentContract} />)
        });
        setAnchorEl(null);
    }

    const deleteDialog = () => {
        dialogState.setDialog({
            open: true,
            dialogTitle: "Stergi contractul...",
            dialogContent: "Esti sigur ca vrei sa stergi contractul?",
            actionOne: () => {
                dialogState.setDialog(undefined);
                setAnchorEl(null);
            },
            textButtonOne: "Anuleaza",
            actionTwo: async () => {
                try {
                    await deleteContractDB((currentContract as any).idContract);
                    dialogState.setDialog(undefined);
                    panelState.setRefreshData({
                        refreshContracts: true
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
        <div className='apartment-page-style' style={{ height: "100%" }}>
            <div>
                <div 
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <h1>Contracte active</h1>
                    <div>
                        <Button
                            onClick={createPanel}
                            variant="contained"
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Creeaza contract
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
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[7]}</TableCell>
                            <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[8]}</TableCell>
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
                                            ? (activeAontracts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                            : (activeAontracts ?? [])
                                        ).map((contract, index) => (
                                            <TableRow key={contract.idContract}>
                                                <TableCell component="th" scope="row">
                                                    <span>{contract.Apartament.Adresa.strada}, </span>
                                                    <span>{contract.Apartament.Adresa.numar}, </span>
                                                    <span>{contract.Apartament.Adresa.bloc}, </span>
                                                    <span>{contract.Apartament.Adresa.scara}, </span>
                                                    <span>{contract.Apartament.Adresa.numarApartament}, </span>
                                                    <span>{contract.Apartament.Adresa.Localitate.nume}, </span>
                                                    <span>{contract.Apartament.Adresa.Localitate.Judet.nume} </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span>{contract.Chiria.nume} </span>
                                                    <span>{contract.Chiria.prenume}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span>{contract.AgentImobiliar.nume} </span>
                                                    <span>{contract.AgentImobiliar.prenume}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(contract.dataInceput).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(contract.dataFinal).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.ziuaScandenta}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.pretInchiriere}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.incasari}
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
                                                            setCurrentContract(() => contract)
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
                            count={activeAontracts?.length ?? 0}
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
            </div>
            <div>
                <div 
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <h1>Contracte</h1>
                    <div>
                        <Button
                            onClick={createPanel}
                            variant="contained"
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Creeaza contract
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
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[7]}</TableCell>
                            <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[8]}</TableCell>
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
                                            ? (contracts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                            : (contracts ?? [])
                                        ).map((contract, index) => (
                                            <TableRow key={contract.idContract}>
                                                <TableCell component="th" scope="row">
                                                    <span>{contract["Apartament.Adresa.strada"]}, </span>
                                                    <span>{contract["Apartament.Adresa.numar"]}, </span>
                                                    <span>{contract["Apartament.Adresa.bloc"]}, </span>
                                                    <span>{contract["Apartament.Adresa.scara"]}, </span>
                                                    <span>{contract["Apartament.Adresa.numarApartament"]}, </span>
                                                    <span>{contract["Apartament.Adresa.Localitate.nume"]}, </span>
                                                    <span>{contract["Apartament.Adresa.Localitate.Judet.nume"]} </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span>{contract["Chiria.nume"]} </span>
                                                    <span>{contract["Chiria.prenume"]}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span>{contract["AgentImobiliar.nume"]} </span>
                                                    <span>{contract["AgentImobiliar.prenume"]}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(contract.dataInceput).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(contract.dataFinal).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.ziuaScandenta}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.pretInchiriere}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {contract.incasari}
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
                                                            setCurrentContract(() => contract)
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
                            count={contracts?.length ?? 0}
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
            </div>
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

export default RentPage;