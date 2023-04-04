import links from '../utils/links';
import { NavLink } from 'react-router-dom';

function NavLinks({toggleSidebar}) {
    
    // Note onClick={toggleSidebar} inside the map is there just to close the sidebar when a link is clicked
    // ({isActive})=>{isActive ? 'nav-link active' : 'nav-link'} isActive is a Navlink thing we can get
    const renderLinks = links.map((link) => {
        const { text, path, id, icon } = link
        return (
            <NavLink key={id} to={path} onClick={toggleSidebar} className={({isActive})=>{ return isActive ? 'nav-link active' : 'nav-link'}}>
                <span className='icon'>{icon}</span>
                {text}                
            </NavLink>
        )
    })

    return (
        <div className='nav-links'>
            {renderLinks}
        </div>
    )
    
}

export default NavLinks