import { useEffect, useState } from "react";
import SettingsModal from "./components/settingsModal";
import { onValue, ref } from "firebase/database";
import { database } from "@/config/firebase";
import CustomTable from "./components/customTable";
import ListModal from "./components/listModal";

export default function Ads() {
  const [adsSettings, setAdsSettings] = useState(null);
  const [adsData, setAdsData] = useState(null);
  const [modal, setModal] = useState(false);
  const [listModal, setListModal] = useState(false);
  const [listData, setListData] = useState(null);
  const adsRef = ref(database, "/ads");

  const handleData = (data) => {
    const normalized = Object.keys(data.data).map((key) => {
      return {
        id: key,
        ...data.data[key],
      };
    });
    setAdsData(normalized);
  };

  useEffect(() => {
    onValue(adsRef, (snapshot) => {
      const data = snapshot.val();
      setAdsSettings(data.options);
      handleData(data);
    });
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row w-full justify-between items-center border-slate-700 border border-solid p-2 rounded-md">
        <h1 className="text-2xl font-medium">Ads</h1>
        <button
          className="flex flex-row bg-cyan-400 hover:bg-cyan-600 items-center py-2 px-4 rounded-md "
          onClick={() => setModal(true)}
        >
          <ion-icon name="settings"></ion-icon>
          <p className="ml-2">Settings</p>
        </button>
      </div>
      <div>
        <CustomTable
          data={adsData}
          actionPressed={(data) => {
            setListData(data);
            setListModal(true);
          }}
        />
      </div>

      {modal && (
        <SettingsModal
          data={adsSettings}
          open={modal}
          handleClose={() => setModal(false)}
        />
      )}
      <ListModal
        open={listModal}
        data={listData}
        handleClose={() => {
          setListModal(false);
          setListData(null);
        }}
      />
    </div>
  );
}
