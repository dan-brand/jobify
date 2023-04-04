import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { BigSidebar, SmallSidebar, Navbar } from '../../components'

function SharedLayout() {

    // Check the css from BigSidebar and SmallSidebar - we are using css there (media queries) to control which components are displayed as opposed to logic here. We are only showing SmallSidebar OR BigSidebar
    return (
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    )
  }
  
  export default SharedLayout;
  