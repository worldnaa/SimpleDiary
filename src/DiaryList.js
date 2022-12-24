import { useContext } from 'react';
import { DiaryStateContext } from './App';
import DiaryItem from './DiaryItem';


const DiaryList = () => {
  // DiaryStateContext에서 data를 가져와 list에 저장
  const diaryList = useContext(DiaryStateContext);
  
  return(
    <div className='DiaryList'>
      
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      
      <div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} />
        ))}
      </div>

    </div>
  );
};

// undefined 같은 값이 오면 에러가 발생하므로 default를 []로 설정
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;