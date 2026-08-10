import { TopNav } from './components/TopNav'
import { AppRoutes } from './routes/AppRoutes'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <TopNav />
      <AppRoutes />
    </AppProvider>
  )
}

export default App