import React, { useEffect } from 'react'


function Navbar() {

  useEffect(() => {
    const menuIcon = document.getElementById('menuIcon');
    const offcanvas = document.getElementById('offcanvasNavbar');

    const showIcon = () => {
      if (menuIcon) menuIcon.style.display = 'inline';
    };


    offcanvas.addEventListener('hidden.bs.offcanvas', showIcon);

    return () => {
      offcanvas.removeEventListener('hidden.bs.offcanvas', showIcon);
    };

  }, []);
  
  return (
    <>
      <nav className=" container my-4 rounded navbar  border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#"><i class="fa-solid fa-code text-warning me-1 "></i>   Codion </a>
          <button
            className="navbar-toggler "
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
            onClick={() => {
              const menuIcon = document.getElementById('menuIcon');
              if (menuIcon) menuIcon.style.display = 'none';
            }}
          >
            <span id='menuIcon' className="fs-4 text-white">☰</span>
          </button>
          <div
            className="offcanvas offcanvas-end opacity-50"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header ">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link text-dark fw-bold" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-dark fw-bold" href="#">History</a>
                </li>
                <li className="nav-item">
                  <button className='btn nav-link fw-bold text-primary'>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar