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
import { deletePayDB, getAllPaidRents, getClientWithRent } from "./pay-rent.page.requests";
import RentPanel from "./components/pay-rent-panel/pay-rent.panel";
import PayRentPanel from "./components/pay-rent-panel/pay-rent.panel";
import AddCardIcon from '@mui/icons-material/AddCard';
import Tooltip from '@mui/material/Tooltip';
import { editContractDB } from "../rent/rent.page.requests";

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
    "Data Nastere",
    "Sex",
    "Stare civila",
    "Actiuni"
]

const TableHeadersPaidRents = [
    "Adresa apartament",
    "Chirias",
    "Pret inchiriere",
    "Data efectuarii",
    "Numar zile intarziere",
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

const PayRentPage = observer(() => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clients, setClients] = useState<any[]>();
    const [paidRents, setPaidRents] = useState<any[]>();
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

            getAllPaidRents()
            .then(data => setPaidRents(() => (data as any[])))
            .catch(e => console.log(e))

            getClientWithRent()//contracts
            .then(data => setClients(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    )
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshPaidRents) return; 

            setLoading(() => true)

            getAllPaidRents()
            .then(data => setPaidRents(() => (data as any[])))
            .catch(e => console.log(e))

            getClientWithRent()//contracts
            .then(data => {
                setClients(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const createPanel = (client: any) => {

        panelState.setOpenPanel({
            body: (<PayRentPanel idChirias={client.idChirias} />)
        });
        setAnchorEl(null);
    }

    const editPanel = () => {
        panelState.setOpenPanel({
            body: (<PayRentPanel editPayRent={currentContract} idChirias={(currentContract as any).Contract.ID_CHIRIAS} />)
        });
        setAnchorEl(null);
    }

    const deleteDialog = () => {
        dialogState.setDialog({
            open: true,
            dialogTitle: "Stergi plata...",
            dialogContent: "Esti sigur ca vrei sa stergi plata?",
            actionOne: () => {
                dialogState.setDialog(undefined);
                setAnchorEl(null);
            },
            textButtonOne: "Anuleaza",
            actionTwo: async () => {
                try {
                    await deletePayDB((currentContract as any).idPlata);
                    await editContractDB({incasari: Number((currentContract as any).Contract.incasari) - Number((currentContract as any).suma)}, (currentContract as any).Contract.idContract)
                    dialogState.setDialog(undefined);
                    panelState.setRefreshData({
                        refreshPaidRents: true
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
                    <h1>Chiriasi</h1>
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
                                            ? (clients?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                            : (clients ?? [])
                                        ).map((client, index) => (
                                            <TableRow key={client.idApartament}>
                                                <TableCell component="th" scope="row">
                                                    {client.nume}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {client.prenume}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {client.telefon}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {client.email}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(client.dataNastere).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {client.sex}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {client.stareaCivila}
                                                </TableCell>
                                                <TableCell align="right">
                                                <Tooltip title="Plateste">
                                                    <IconButton
                                                        aria-label="more"
                                                        id="long-button"
                                                        aria-controls={open ? 'long-menu' : undefined}
                                                        aria-expanded={open ? 'true' : undefined}
                                                        aria-haspopup="true"
                                                        onClick={(e) => {
                                                            createPanel(client)
                                                        }}
                                                    >
                                                        <AddCardIcon />
                                                    </IconButton>
                                                </Tooltip>
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
                            count={clients?.length ?? 0}
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
                    <h1>Plati</h1>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "black"}}>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[0]}</TableCell>
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[1]}</TableCell>
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[2]}</TableCell>
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[3]}</TableCell>
                            <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[4]}</TableCell>
                            <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeadersPaidRents[5]}</TableCell>
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
                                            ? (paidRents?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                            : (paidRents ?? [])
                                        ).map((rent, index) => (
                                            <TableRow key={rent.idPlata}>
                                                <TableCell component="th" scope="row">
                                                    <span>{rent.Contract.Apartament.Adresa.strada}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.numar}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.bloc}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.scara}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.numarApartament}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.Localitate.nume}, </span>
                                                    <span>{rent.Contract.Apartament.Adresa.Localitate.Judet.nume}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span>{rent.Contract.Chiria.nume}, </span>
                                                    <span>{rent.Contract.Chiria.prenume}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rent.suma}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(rent.dataEfectuarii).toLocaleDateString('ro-RO').toString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rent.nrZileIntarziere}
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
                                                            setCurrentContract(() => rent)
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
                            count={paidRents?.length ?? 0}
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

export default PayRentPage;