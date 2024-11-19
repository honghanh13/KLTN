
import React, {Fragment} from 'react'
import {useEffect} from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComPonent from './components/DefaultComponent/DefaultComPonent'
import axios from 'axios'
function App() {
  
  useEffect(() => {
    fetchApi()
  }, [])
  const fetchApi = async () =>{
    const res = axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
    console.log('res', res)
  }
  return (
    
    <div>
      <Router>
        <Routes>
          {routes.map((route)=>{
            const Page = route.page 
            const Layout = route.isShowHeader ? DefaultComPonent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
              <Layout>
                <Page/>
              </Layout>
              }/>
            )
          })}
          
        </Routes>
      </Router>
    </div>
  )
}
export default App