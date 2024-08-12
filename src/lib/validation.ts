const onKeyDownTextArea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (
    e.key === "Enter" && 
    !e.shiftKey
  ) {
    e.preventDefault();
  }
};

export {
  onKeyDownTextArea
}