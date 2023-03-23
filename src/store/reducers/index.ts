import {combineReducers} from '@reduxjs/toolkit'
import counterSlice from './counter' // 可以引入各种 reducer

const rootReducers = combineReducers({
  counter: counterSlice // 这里通过 MAP 形式，自定义不同 reducer 的“命名空间”
  // ... 可以在这里扩展添加任意的 reducer
})

// 默认导出，给 configureStore 消费
export default rootReducers