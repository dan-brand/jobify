import Wrapper from '../assets/wrappers/SmallSidebar';
import { FaTimes } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Logo from './Logo';
import NavLinks from './NavLinks';

function SmallSidebar() {

    const { showSidebar, toggleSidebar } = useAppContext();
    
    return (
        <Wrapper>
            <div className={showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
                <div className='content'>
                    <button onClick={toggleSidebar} className='close-btn'><FaTimes /></button>
                    <header>
                        <Logo />
                    </header>
                        <NavLinks toggleSidebar={toggleSidebar} />
                </div>
            </div>
        </Wrapper>
    )
}

export default SmallSidebar;

// We will be toggling the css class 'show-sidebar' to display/hide the sidebar