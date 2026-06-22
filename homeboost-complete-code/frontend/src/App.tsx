import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Partners } from './pages/Partners';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { PartnershipLanding } from './pages/PartnershipLanding';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeResources } from './pages/EmployeeResources';
import { EmployeeQuiz } from './pages/EmployeeQuiz';
import { EmployeeMessages } from './pages/EmployeeMessages';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminPartnerships } from './pages/AdminPartnerships';
import { AdminContent } from './pages/AdminContent';
import { HbtDashboard } from './pages/HbtDashboard';
import { HbtCompanies } from './pages/HbtCompanies';
import { HbtEmployees } from './pages/HbtEmployees';
import { HbtEvents } from './pages/HbtEvents';
import { HbtMessages } from './pages/HbtMessages';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute roles={['employee']} />}>
        <Route path="/employee-portal" element={<EmployeeDashboard />} />
        <Route path="/employee/resources" element={<EmployeeResources />} />
        <Route path="/employee/quiz" element={<EmployeeQuiz />} />
        <Route path="/employee/messages" element={<EmployeeMessages />} />
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/partnerships" element={<AdminPartnerships />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/messages" element={<HbtMessages title="Platform Messages" />} />
      </Route>

      <Route element={<ProtectedRoute roles={['hbt_admin', 'hbt_member']} />}>
        <Route path="/hbt/dashboard" element={<HbtDashboard />} />
        <Route path="/hbt/companies" element={<HbtCompanies />} />
        <Route path="/hbt/employees" element={<HbtEmployees />} />
        <Route path="/hbt/events" element={<HbtEvents />} />
        <Route path="/hbt/messages" element={<HbtMessages />} />
      </Route>

      <Route path="/:slug" element={<PartnershipLanding />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
