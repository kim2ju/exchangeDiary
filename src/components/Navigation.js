import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard,faUserCircle } from "@fortawesome/free-regular-svg-icons";

const Navigation = () => (
  <nav>
    <ul>
      <li>
        <Link to="/write">
          <FontAwesomeIcon icon={faKeyboard} />
        </Link>
      </li>
      <li>
        <Link to="/">
          떡뽀끼팸 교환일기!
        </Link>
      </li>
      <li>
        <Link to="/profile">
          <FontAwesomeIcon icon={faUserCircle} />
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;