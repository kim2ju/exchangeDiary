import React from "react";
import {dbService} from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

const Reply = ({diaryObj, replyObj, isOwner}) => {
  const onDeleteClick = async () => {
    const ok = window.confirm("이 답글을 삭제하시겠습니까?");
    if (ok) {
        await dbService.doc(`diarys/${diaryObj.id}/replys/${replyObj.id}`).delete();
    }
  };

  return(
      <div className="replySet">
        <span className="Writer">{replyObj.creatorName}</span>
        <div className="day">
          <span>{replyObj.createdMonth}월</span>
          <span>{replyObj.createdDate}일</span>
          <span>{replyObj.createdHours}시</span>
          <span>{replyObj.createdMinutes}분</span>
        </div>
        <h4>{replyObj.text}</h4>
        {isOwner && (
          <span onClick={onDeleteClick} className="replyDelete">
            <FontAwesomeIcon icon={faTrashAlt} />
          </span>)}
        </div>
  );
}

export default Reply;