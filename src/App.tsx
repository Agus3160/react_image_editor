import ImageEditor from "./components/ImgEditor/ImageEditor";
import { EditImageProvider } from "./context/EditImageContext";

function App() {
  
  const imageUrl = "/michi.png";

  return (
    <div
      className="bg-slate-900 h-dvh w-dvw w-full h-full text-white relative gap-8"
    >
      <EditImageProvider imageUrl={imageUrl}>
        <ImageEditor />
      </EditImageProvider>
    </div>
  );
}

export default App;
