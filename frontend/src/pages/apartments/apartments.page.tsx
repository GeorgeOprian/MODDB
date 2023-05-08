import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { deleteApartmnetDB, getApartments } from './apartments.page.requests';
import { useState } from 'react';
import { Button, LinearProgress, Menu, MenuItem, Snackbar, TableHead } from '@mui/material';
import './apartments.page.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { observer } from 'mobx-react-lite';
import { DialogContext, PanelContext, ToastContext } from '../../mobx/store';
import ApartmentPanel from './components/apartment/apartment.panel';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

export type ApartmentType = {
    idApartament: number,
    etaj: string,
    centralaProprie: string,
    numarCamere: number,
    pretInchiriere: number,
    suprafata: number,
    tipConfort: number,
    ID_ADRESA: number,
    adresa?: any
}

const TableHeaders = [
    "Etaj",
    "Adresa",
    "Centrala proprie",
    "Numar camere",
    "Tip confort",
    "Suprafata (m^2)",
    "Pret Inchiriere (RON)",
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

const  ApartmentsPage = observer(() => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [apartments, setApartments] = React.useState<any[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const panelState = React.useContext(PanelContext);
  const toastState = React.useContext(ToastContext);
  const dialogState = React.useContext(DialogContext);

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [currentApartment, setCurrentApartment] = useState()

  React.useEffect(
    () => {
        setLoading(() => true)
        getApartments()
        .then(data => setApartments(() => data))
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    []
  ) 

  React.useEffect(
    () => {
        if(!panelState.refreshData?.refreshApartments) return; 
        setLoading(() => true)
        getApartments()
        .then(data => {
            setApartments(() => data);
            panelState.setRefreshData(undefined);
        })
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    [panelState.refreshData]
  )

  const editPanel = () => {

    panelState.setOpenPanel({
        body: (<ApartmentPanel editApartment={currentApartment} />)
    });
    setAnchorEl(null);
  }

  const createPanel = () => {

    panelState.setOpenPanel({
        body: (<ApartmentPanel />)
    });
    setAnchorEl(null);
  }

  const deleteDialog = () => {
    dialogState.setDialog({
        open: true,
        dialogTitle: "Stergi apartamentul...",
        dialogContent: "Esti sigur ca vrei sa stergi apartamentul?",
        actionOne: () => {
            dialogState.setDialog(undefined);
            setAnchorEl(null);
        },
        textButtonOne: "Anuleaza",
        actionTwo: async () => {
            try {
                await deleteApartmnetDB((currentApartment as any).idApartament);
                dialogState.setDialog(undefined);
                panelState.setRefreshData({
                    refreshApartments: true
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
            <h1>Apartamente</h1>
            <div>
                <Button
                    onClick={createPanel}
                    variant="contained"
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    Adauga apartament
                </Button>
            </div>
        </div>

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
                <TableRow sx={{ backgroundColor: "black"}}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[0]}</TableCell>
                    <TableCell align='center' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[1]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[2]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[3]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[4]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[5]}</TableCell>
                    <TableCell align='right' sx={{ color: "white", fontWeight: "bold" }}>{TableHeaders[6]}</TableCell>
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
                                    ? (apartments?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ?? [])
                                    : (apartments ?? [])
                                ).map((apartment, index) => (
                                    <TableRow key={apartment.idApartament}>
                                        <TableCell component="th" scope="row">
                                            {apartment.etaj}
                                        </TableCell>
                                        <TableCell align="center">
                                            <span>{apartment["Adresa.strada"]}, </span>
                                            <span>{apartment["Adresa.numar"]}, </span>
                                            <span>{apartment["Adresa.bloc"]}, </span>
                                            <span>{apartment["Adresa.scara"]}, </span>
                                            <span>{apartment["Adresa.numarApartament"]}, </span>
                                            <span>{apartment["Adresa.Localitate.nume"]}, </span>
                                            <span>{apartment["Adresa.Localitate.Judet.nume"]} </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            {apartment.centralaProprie}
                                        </TableCell>
                                        <TableCell align="right">
                                            {apartment.numarCamere}
                                        </TableCell>
                                        <TableCell align="right">
                                            {apartment.tipConfort}
                                        </TableCell>
                                        <TableCell align="right">
                                            {apartment.suprafata}
                                        </TableCell>
                                        <TableCell align="right">
                                            {apartment.pretInchiriere}
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
                                                    setCurrentApartment(() => apartment)
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
                                                
                                                <MenuItem onClick={() => editPanel()}>
                                                    Editeaza
                                                </MenuItem>
                                                <MenuItem onClick={() => deleteDialog()}>
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
                    count={apartments?.length ?? 0}
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
  );
})

export default ApartmentsPage;