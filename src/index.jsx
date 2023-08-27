import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/*Pages*/
import Home from './pages/home'
import Inventory from './pages/inventory'
import Calendar from './pages/calendar'
import Dashboard from './pages/admin_dashboard'
import Burger from './pages/burger'
import Login from './pages/login'
import Test from './trash-test/test' //! À SUPPRIMER
import AdminCategory from './pages/admin_category'
import AdminMachinery from './pages/admin_machinery'
import AdminCalendar from './pages/admin_calendar'
/*Components*/
import Header from './components/header'
import Footer from './components/footer'
import Error from './components/error'
/*Toast*/
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
/*Utils*/
import { AuthProvider } from './utils/react/context'
import { ScreenProvider } from './utils/react/context'
import ProtectedRoute from './utils/react/protectedroute'
/*Style*/
import styled from 'styled-components'
import GlobalStyle from './utils/styles/globalStyle'
import AdminBreakdown from './pages/admin_bris'

//Style du wrapper.
const StyledWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
`

//Style du footer.
const StyledFooter = styled.div`
  margin-top: auto;
`

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <ScreenProvider>
        <AuthProvider>
          <StyledWrapper>
            {/* Wrapper pour le header, le body et le footer */}
            <div className="header">
              <GlobalStyle />
              <Header />
            </div>
            <div className="content">
              <Routes>
                <Route path="/login" element={<ProtectedRoute />}>
                  <Route index element={<Login />} />
                </Route>
                <Route path="/" element={<ProtectedRoute />}>
                  <Route index element={<Home />} />
                </Route>
                <Route path="/inventory" element={<ProtectedRoute />}>
                  <Route index element={<Inventory />} />
                </Route>
                <Route path="/calendar" element={<ProtectedRoute />}>
                  <Route index element={<Calendar />} />
                </Route>
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="/admin/category" element={<ProtectedRoute />}>
                  <Route index element={<AdminCategory />} />
                </Route>
                <Route path="/admin/machinery" element={<ProtectedRoute />}>
                  <Route index element={<AdminMachinery />} />
                </Route>
                <Route path="/admin/calendar" element={<ProtectedRoute />}>
                  <Route index element={<AdminCalendar />} />
                </Route>
                <Route path="/admin/breakdown" element={<ProtectedRoute />}>
                  <Route index element={<AdminBreakdown />} />
                </Route>
                <Route path="/others" element={<ProtectedRoute />}>
                  <Route index element={<Burger />} />
                </Route>
                {/* À SUPPRIMER */}
                <Route path="/test" element={<ProtectedRoute />}>
                  <Route index element={<Test />} />
                </Route>
                <Route path="*" element={<Error />} />
              </Routes>
              {/* Toast */}
              <ToastContainer
                position="top-center"
                theme="colored"
                hideProgressBar={true}
                autoClose={2000}
              />
            </div>
            <StyledFooter>
              {/* Footer en bas de page */}
              <Footer />
            </StyledFooter>
          </StyledWrapper>
        </AuthProvider>
      </ScreenProvider>
    </Router>
  </React.StrictMode>,
)
