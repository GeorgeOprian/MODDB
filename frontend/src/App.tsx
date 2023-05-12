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
import AdressesBucurestiPage from './pages-bucuresti/addresses/addresses.page';
import ApartmentsBucurestiPage from './pages-bucuresti/apartments/apartments.page';
import ClientsBucurestiPage from './pages-bucuresti/clients/clients.page';
import RentBucurestiPage from './pages-bucuresti/rent/rent.page';
import PayRentBucurestiPage from './pages-bucuresti/pay-rent/pay-rent.page';
import ApartmentsProvinciePage from './page-provincie/apartments/apartments.page';
import AdressesProvinciePage from './page-provincie/addresses/addresses.page';
import ClientsProvinciePage from './page-provincie/clients/clients.page';
import RentProvinciePage from './page-provincie/rent/rent.page';
import PayRentProvinciePage from './page-provincie/pay-rent/pay-rent.page';
import AgentsProvinciePage from './page-provincie/agents/agents.page';
import AgentsBucurestiPage from './pages-bucuresti/agents/agents.page';

const App = observer(() => {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/national">
          <Route path="apartments" element={<ApartmentsPage />} />
          <Route path="addresses" element={<AdressesPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="contracts" element={<RentPage />} />
          <Route path="payrent" element={<PayRentPage />} />
        </Route>
        <Route path="/bucuresti">
          <Route path="apartments" element={<ApartmentsBucurestiPage />} />
          <Route path="addresses" element={<AdressesBucurestiPage />} />
          <Route path="agents" element={<AgentsBucurestiPage />} />
          <Route path="clients" element={<ClientsBucurestiPage />} />
          <Route path="contracts" element={<RentBucurestiPage />} />
          <Route path="payrent" element={<PayRentBucurestiPage />} />
        </Route>
        <Route path="/provincie">
          <Route path="apartments" element={<ApartmentsProvinciePage />} />
          <Route path="addresses" element={<AdressesProvinciePage />} />
          <Route path="agents" element={<AgentsProvinciePage />} />
          <Route path="clients" element={<ClientsProvinciePage />} />
          <Route path="contracts" element={<RentProvinciePage />} />
          <Route path="payrent" element={<PayRentProvinciePage />} />
        </Route>
      </Routes>
  );
})

export default App;
