import { App} from "./components"; 
import { getBasicCharList, getCharacterList } from "./actions";

export default async function Home() {
  // Fetch initial data server-side for faster initial load
  const [charactersList] = await Promise.all([
    getBasicCharList(),
    // getCharacterList(),
  ]);

  const charList:[] = []

  return (
    <div className="font-sans items-center justify-items-center min-h-screen pb-20 gap-16 h-screen">
      <App initialCharactersList={charactersList} initialCharList={charList ?? []} />
    </div>
  );
}


