import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";

const Write = ({ userObj }) => {
    const [diary, setDiary] = useState("");
    const [attachment, setAttachment] = useState("");
    const day = new Date();
    const onSubmit = async (event) => {
      if (diary === "") {
          return;
        }
      event.preventDefault();
      let attachmentUrl = "";
      if (attachment !== "") {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
        const response = await attachmentRef.putString(attachment, "data_url");
        attachmentUrl = await response.ref.getDownloadURL();
      }
      const diaryObj = {
        text: diary,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        creatorName: userObj.displayName,
        createdMonth: day.getMonth() + 1,
        createdDate: day.getDate(),
        createdHours: day.getHours(),
        createdMinutes: day.getMinutes(),
        attachmentUrl,
      };
      await dbService.collection("diarys").add(diaryObj);
      setDiary("");
      setAttachment("");
    };
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setDiary(value);
    };
    const onFileChange = (event) => {
      const {
        target: { files },
      } = event;
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment("");
    return (
      <div className="container">
      <form onSubmit={onSubmit} className="diaryForm">
      <div className="diaryInput__container">
        <textarea
          className="diaryInput__input"
          value={diary}
          onChange={onChange}
          type="text"
          placeholder="오늘 무엇을 했나요?"
        />
        <input type="submit" value="&rarr;" className="diaryInput__arrow" />
      </div>
      <label for="attach-file" className="diaryInput__label">
        <span>사진 추가하기</span>
      </label>
        <input
           id="attach-file"
           type="file"
           accept="image/*"
           onChange={onFileChange}
           style={{
             opacity: 0,
           }}
        />
        {attachment && (
          <div className="diaryForm__attachment">
             <img
               src={attachment}
               style={{
                 backgroundImage: attachment,
               }}
               alt = "attachment"
             />
             <div className="diaryForm__clear" onClick={onClearAttachment}>
               <span>지우기</span>
             </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Write;