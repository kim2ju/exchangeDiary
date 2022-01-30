import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import Reply from "components/Reply";

const Diary = ({ diaryObj, userObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [replying, setReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [newDiary, setNewDiary] = useState(diaryObj.text);
    const [replies, setReplies] = useState([]);
    // 글 삭제하기
    const onDeleteClick = async () => {
      const ok = window.confirm("이 일기를 삭제하시겠습니까?");
      if (ok) {
        await dbService.doc(`diarys/${diaryObj.id}`).delete();
        if(diaryObj.attachmentUrl !== "" ){
          await storageService.refFromURL(diaryObj.attachmentUrl).delete();
          }
      };
    };
    // 글 수정하기
    const onEditSubmit = async (event) => {
      event.preventDefault();
      await dbService.doc(`diarys/${diaryObj.id}`).update({
        text: newDiary,
      });
      setEditing(false);
    };
    // 글 수정 취소하기
    const toggleEditing = () => setEditing((prev) => !prev);
    // 글 수정 입력한 거 표시하는 기능
    const onEditChange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDiary(value);
    };
    // 댓글 달기
    const onReplySubmit = async (event) => {
      const day = new Date()
      const replyObj = {
        text: reply,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        creatorName: userObj.displayName,
        createdMonth: day.getMonth() + 1,
        createdDate: day.getDate(),
        createdHours: day.getHours(),
        createdMinutes:day.getMinutes(),
      };
      event.preventDefault();
      await dbService.collection(`diarys/${diaryObj.id}/replys`).add(replyObj);
      setReplying(false);
      setReply("");
    };
    // 댓글 입력 취소하기
    const toggleReplying = () => setReplying((prev) => !prev);
    // 댓글 입력한 거 표시하는 기능
    const onReplyChange = (event) => {
      const {
        target: { value },
      } = event;
      setReply(value);
    };
    // 댓글 배열 만들기
    useEffect(() => {
        dbService.collection(`diarys/${diaryObj.id}/replys`).orderBy("createdAt","asc").onSnapshot((snapshot) => {
            const replyArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setReplies(replyArray);
          });
    }, []);

    return (
      <div className="diary">
        {editing ? (
          <>
            <form onSubmit={onEditSubmit}>
              <input
                type="text"
                placeholder="일기를 수정하세요"
                value={newDiary}
                required
                autoFocus
                onChange={onEditChange}
                className="formInput"
              />
              <input type="submit" value="업데이트" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn">
              취소
            </span>
          </>
        ) : (
          <>
            <span className="Writer">{diaryObj.creatorName}</span>
            <div className="day">
              <span>{diaryObj.createdMonth}월</span>
              <span>{diaryObj.createdDate}일</span>
              <span>{diaryObj.createdHours}시</span>
              <span>{diaryObj.createdMinutes}분</span>
            </div>
            <h4>{diaryObj.text}</h4>
            {diaryObj.attachmentUrl && <img src={diaryObj.attachmentUrl} alt="attachment"/>}
            <span onClick={toggleReplying} className="replyBtn">
              <FontAwesomeIcon icon={faCommentAlt} />
            </span>   
            <div className="replies">
              {replies.map((reply) => (
            <Reply
            replyObj={reply}
            diaryObj={diaryObj}
            isOwner={reply.creatorId === userObj.uid}
            />
         ))}</div>         
            {isOwner && (
               <div className="diaryBtn">
                 <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faEdit} />
                 </span>
                 <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                 </span>
               </div>
            )}
            {replying && (
              <div className="container">
                <form onSubmit={onReplySubmit}>
                  <input
                    type="text"
                    placeholder=""
                    value={reply}
                    required
                    autoFocus
                    onChange={onReplyChange}
                    className="formInput"
                  />
                  <input type="submit" value="답글 달기" className="formBtn" />
                </form>
                <span onClick={toggleReplying} className="formBtn">
                  취소
                </span>
              </div>
            )}
          </>
        )}
    </div>
  );
};
  
export default Diary;