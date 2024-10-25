import { openDB } from 'idb';

const DB_NAME = 'kpMedizinCache';
const STORE_NAME = 'protocols';

export const cacheDB = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  },
});

export const cacheProtocol = async (protocol: z.infer<typeof ExamProtocolSchema>) => {
  const db = await cacheDB;
  const transformed = transformProtocolData(protocol);
  await db.put(STORE_NAME, transformed);
};

export const getCachedProtocol = async (id: string) => {
  const db = await cacheDB;
  return db.get(STORE_NAME, id);
};
