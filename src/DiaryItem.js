import React, { useContext, useEffect, useRef, useState } from 'react';
import { DiaryDispatchContext } from './App';


const DiaryItem = ({author, content, emotion, created_date, id}) => {
  // DiaryDispatchContext에서 onRemove(), onEdit()를 가져오기
  // onCreate, onRemove, onEdit 라는 이름의 객체로 저장되어 있기에 비구조할당으로 가져와야 한다
  const {onRemove, onEdit} = useContext(DiaryDispatchContext);

  const [isEdit, setIsEdit] = useState(false);// 수정중인지 아닌지 여부를 저장
  const [localContent, setLocalContent] = useState(content);
  
  const localContentInput = useRef(); // focus() 사용하기 위해 useRef 사용

  const toggleIsEdit = () => setIsEdit(!isEdit); 

  
  // 일기 수정 취소하기
  const handleQuitEdit = () => {
    setIsEdit(false);         // 수정 여부 false 설정
    setLocalContent(content); // 기존 내용 보여주기
  };


  // 일기 수정하기
  const handleEdit = () => {
    // 내용 길이가 5 미만이면 포커스주고 return
    if(localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }
    // 일기 수정 확인 팝업
    if(window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent); // 확인을 누르면 수정 함수 실행
      toggleIsEdit();           // 수정 여부를 false로 변경
    }
  };


  // 일기 삭제하기
  const handleRemove = () => {
    // 일기 삭제 확인 팝업
    if(window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
      onRemove(id); // 확인을 누르면 삭제 함수 실행
    };
  };

  
  return (
    <div className='DiaryItem' key={id}>
      {/* 인트로 영역 */}
      <div className='info'>
        <span>작성자: {author} | 감정점수: {emotion}</span>
        <br/>
        <span className='date'>{new Date(created_date).toLocaleString()}</span>
      </div>

      {/* 컨텐츠 영역 */}
      <div className='content'>
        {// 수정중일 경우 textarea 노출, 아닐경우 기존 content 값 노출
          isEdit ? (
            <>
              <textarea
                ref={localContentInput}
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
              />
            </> 
          ) : ( 
            <>{content}</>
          )
        }
      </div>

      {/* 버튼 영역 */}
      {
        isEdit ? (
          <>
            <button onClick={handleQuitEdit}>수정 취소</button>
            <button onClick={handleEdit}>수정 완료</button>
          </>
        ) : (
          <>
            <button onClick={handleRemove}>삭제하기</button>
            <button onClick={toggleIsEdit}>수정하기</button>
          </>
        )
      }
    </div>
  );
};

export default React.memo(DiaryItem);