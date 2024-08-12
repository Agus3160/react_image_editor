
import ImageEditor from "./components/ImgEditor/ImageEditor";
import { EditImageProvider } from "./context/EditImageContext";

function App() {

  const imageUrl = "/michi.png";

  return (
    <main className="bg-slate-900 h-dvh w-dvw text-white flex items-center justify-center gap-8">
      <EditImageProvider imageUrl={imageUrl}>
        <ImageEditor />
      </EditImageProvider>
    </main>
  );
}

export default App;
