import './App.css';
import React, { useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import DiaryList from './DiaryList';
import DiaryEditor from './DiaryEditor';


// 기존 state를 reducer로 대체하고, 컴포넌트 밖으로 분리한다
const reducer = (state, action) => {
  // action.type에 따라 리턴하는 값이 새로운 data가 된다
  switch(action.type) {
    // 샘플 데이터 20개를 그대로 리턴
    case 'INIT': {
      return action.data;
    }
    // 생성: 전달받은 data와 날짜를 합한 newItem을 기존 배열에 추가해서 리턴
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {...action.data, created_date};
      return [newItem, ...state]; //최신에 추가한 값이 상단으로 올라간다
    }
    // 삭제: 기존 state의 id와 전달받은 id가 다른 것만 새 배열에 담아서 리턴
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId);
    }
    // 수정: 기존 state의 id와 전달받은 id가 같은게 있다면 content만 새로운 컨텐츠로 수정
    case 'EDIT': {
      return state.map((it) =>
       it.id === action.targetId ? {...it, content: action.newContent} : it
      );
    }
    // 그 외의 경우 값이 안 바뀌고 기존 값 그대로 사용
    default:
      return state; 
  }
};

// Context를 사용하면 값을 전역으로 저장하고 아무데서나 가져다 사용할 수 있다
export const DiaryStateContext = React.createContext();    // data 저장
export const DiaryDispatchContext = React.createContext(); // create(), remove(), edit() 저장


function App() {
  // 복잡한 상태변화 로직을 컴포넌트 밖으로 분리하기 위해 useState 대신 useReducer 사용 
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0); // id 초기값은 0

  // 가짜 API를 호출해서 샘플 데이터 불러오기
  const getData = async() => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());

    // 샘플 데이터에서 20개를 잘라와 데이터 가공하기
    const initData = res.slice(0,20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++
      };
    });

    // 리듀서는 액션 객체를 받는데, 액션의 타입은 INIT이고, 그 액션에 필요한 데이터는 initData다
    dispatch({type:"INIT", data:initData})
  };


  // Mount 시점에 가짜 API를 호출해서 샘플 데이터 만들기
  useEffect(() => {
    getData();
  },[]);


  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: { author, content, emotion, id:dataId.current }
    });
    dataId.current += 1;
  }, []);


  const onRemove = useCallback((targetId) => {
    dispatch({type:"REMOVE", targetId});
  }, []);


  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type:"EDIT", targetId, newContent});
  }, []);


  // App 컴포넌트가 리렌더링될 때 함수가 재생성되지 않도록 useMemo로 묶는다
  const memoizedDispatches = useMemo(() => {
    return {onCreate, onRemove, onEdit};
  }, []);


  // data.length가 변할 때만 콜백함수 재실행하고, 일반 리렌더링의 경우에는 이전에 계산했던 결과 사용
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio};
  }, [data.length]);


  // useMemo는 값을 리턴하기에 getDiaryAnalysis() 라고 함수로 작성하면 안된다
  // 함수로 작성시 발생 에러 => Uncaught TypeError: getDiaryAnalysis is not a function
  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;


  return (
    // DiaryStateContext에 create, remove, edit도 data처럼 Provider로 전달할 경우
    // data가 변경될 때마다 함수들이 실행되므로 이전에 작성한 최적화가 풀려버린다
    // 그러므로 data를 전달하는 Context와 행위를 전달하는 Context를 분리한다
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor/>
          <div>전체 일기 개수 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList/>
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
