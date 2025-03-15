import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="logo">
          <h1 className="mb-0">TaskMaster</h1>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link active" href="#">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Analytics</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Settings</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;