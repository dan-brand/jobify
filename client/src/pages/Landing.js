import React from 'react'
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
        <div className='container page'>
          <div className='info'>
            <h1>job tracking app</h1>
            <p>I'm baby schlitz umami etsy marfa asymmetrical. Lomo next level fashion axe, truffaut PBR&B yes plz quinoa knausgaard dreamcatcher lo-fi cold-pressed vice enamel pin hella.</p>
            <Link to='/register' className='btn btn-hero'>Login/Register</Link>
          </div>
          <img src={main} alt='job-hunt' className='img main-img' />
        </div>
    </Wrapper>
  )
}

export default Landing;

