import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Diary from "components/Diary";

const Home = ({ userObj }) => {
    const [diarys, setDiarys] = useState([]);
    useEffect(() => {
        dbService.collection("diarys").orderBy("createdAt","desc").onSnapshot((snapshot) => {
            const diaryArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDiarys(diaryArray);
          });
    }, []);
  return (
    <div className="container">
      <div className="banner">
        <p>영원하자 떡뽀끼팸~~</p>
      </div>
      {diarys.map((diary) => (
        <Diary
          key={diary.id}
          diaryObj={diary}
          userObj={userObj}
          isOwner={diary.creatorId === userObj.uid}
        />
      ))}
    </div>
  );
};

export default Home;