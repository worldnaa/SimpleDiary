import React, { useRef, useState, useEffect, useContext } from 'react';
import { DiaryDispatchContext } from './App';


const DiaryEditor = () => {
  // DiaryDispatchContext에서 onCreate() 가져와 사용하기
  const {onCreate} = useContext(DiaryDispatchContext);

  // input box에 focus() 적용하기 위해 useRef 사용
  const authorInput = useRef();
  const contentInput = useRef();

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });


  // 작성한 내용 state에 저장해서 input 박스에 실시간으로 보여주기
  const handleChangeState = (e) => {
    // e.target.name을 사용해서 각각의 input에 맞는 값으로 state에 삽입
    // 객체 안에서 key를 [ ]로 감싸면 그 안에 넣은 레퍼런스가 가리키는 실제 값이 key 값으로 사용됨
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };


  // 일기 등록하기
  const handleSubmit = () => {
    if(state.author.length < 1) {
      authorInput.current.focus(); //현재 가르키는 값을 current로 가져와서 포커스 처리
      return;
    };

    if(state.content.length < 5) {
      contentInput.current.focus();
      return;
    };

    // 일기 저장하기
    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공!");
    
    // 기존 state 값 초기화하기
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };


  return (
    <div className='DiaryEditor'>
      <h2>오늘의 일기</h2>
      <div>
        <input 
          ref={authorInput}
          name='author'
          value={state.author}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          name='content'
          value={state.content}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <select name='emotion' value={state.emotion} onChange={handleChangeState}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);