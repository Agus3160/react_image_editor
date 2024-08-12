
const onChange = <T, D>(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, setValues: React.Dispatch<React.SetStateAction<T>>) => {
  
  setValues(prev => {
    return {...prev, [e.target.name || e.target.id]: e.target.value as unknown as D}
  })

}

export { onChange }