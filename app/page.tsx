import { App} from "./components"; 
import { getBasicCharList } from "./actions";
import { AppStoreProvider } from "./stores/appStoreProvider";

export default async function Home() {
  // Fetch initial data server-side for faster initial load
  const [baseCharacterList] = await Promise.all([
    getBasicCharList(),
  ]);

  const charList:[] = []

  return (
    <div className="font-sans items-center justify-items-center min-h-screen pb-20 gap-16 h-screen">
      <AppStoreProvider initialState={{baseCharacterList}}>
        <App initialCharList={charList ?? []} />
      </AppStoreProvider>
    </div>
  );
}


