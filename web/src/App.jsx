import { TopNav } from './components/TopNav'
import { Footer } from './components/Footer'
import { AppRoutes } from './routes/AppRoutes'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="app-layout-wrapper">
        <TopNav />
        <AppRoutes />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App