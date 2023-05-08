import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/home.page';
import ApartmentsPage from './pages/apartments/apartments.page';
import AdressesPage from './pages/addresses/addresses.page';
import { observer } from 'mobx-react-lite';
import AgentsPage from './pages/agents/agents.page';
import ClientsPage from './pages/clients/clients.page';
import RentPage from './pages/rent/rent.page';
import PayRentPage from './pages/pay-rent/pay-rent.page';

const App = observer(() => {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apartments" element={<ApartmentsPage />} />
        <Route path="/addresses" element={<AdressesPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/contracts" element={<RentPage />} />
        <Route path="/payrent" element={<PayRentPage />} />
      </Routes>
  );
})

export default App;
