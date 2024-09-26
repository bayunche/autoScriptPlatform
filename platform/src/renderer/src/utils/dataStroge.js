//使用localstorage存储数据
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

//获取localstorage存储的数据
export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

//删除localstorage存储的数据
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}
//清空localstorage存储的数据
export const clearLocalStorage = () => {
  localStorage.clear()
}
