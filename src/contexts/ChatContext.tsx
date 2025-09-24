import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

type ChatCtx = {
  tutorInstruction: string | null;
  refreshInstruction: () => Promise<void>;
};

const ChatContext = createContext<ChatCtx>({
  tutorInstruction: null,
  refreshInstruction: async () => {},
});

export const ChatProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [tutorInstruction, setTutorInstruction] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u ? u.uid : null));
    return () => unsub();
  }, []);

  const refreshInstruction = async () => {
    if (!uid) { setTutorInstruction(null); return; }
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.exists() ? snap.data() : null;
      setTutorInstruction((data?.tutorInstruction as string) ?? null);
    } catch (e) {
      console.error("Failed to load tutorInstruction:", e);
      setTutorInstruction(null);
    }
  };

  useEffect(() => { refreshInstruction(); }, [uid]);

  return (
    <ChatContext.Provider value={{ tutorInstruction, refreshInstruction }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
