import React, { useState } from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
    };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="닉네임"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="닉네임 바꾸기"
          className="formBtn"
        />
      </form>
      <span className="formBtn logOut" onClick={onLogOutClick}>
        로그아웃
      </span>
    </div>
  );
};

export default Profile;