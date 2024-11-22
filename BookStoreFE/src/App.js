
import React, {Fragment, Suspense} from 'react'
import {useEffect} from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComPonent from './components/DefaultComponent/DefaultComPonent'
import LoadingComponent from './components/LoadingComponent/LoadingComponent'
import * as UserService from "./Service/UserService";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import { jwtDecode } from 'jwt-decode'
import { isJsonString } from "./utils";
import { Spin } from 'antd'


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleGetDetailUser = async (id, token) => {
    try{
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    }catch(e){
      console.log("Error getting details",e)
    }
  };
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };


  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      const currentTime = new Date();
      const { decoded,storageData } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    } else {
      console.log("user not found");
    }
  }, []);


 
  return (
    
    <div>
      <Suspense fallback={<LoadingComponent></LoadingComponent>}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const ischeckAuth = !route.isPrivate || user.isAdmin;
            const Layout = route?.isShowHearder ?  Fragment: DefaultComPonent;
            return (
              <Route
                key={route.path}
                path={ischeckAuth ? route.path : ""}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
      </Suspense>
    </div>
  )
}
export default App