// https://chatgpt.com/share/67f8f9bb-0894-8013-9065-b5a7bb628af3
export class PhotoStorage {
  private dbName = "photoStorageDB";
  private storeName = "photos";
  private dbVersion = 1;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
    });
  }

  async savePhoto(id: string, file: Blob): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.put({ id, file });

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  async loadPhotoURL(id: string): Promise<string | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        db.close();
        if (result?.file) {
          const url = URL.createObjectURL(result.file);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  }

  async deletePhoto(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.delete(id);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  // Yeni fonksiyon: Birden fazla ID'yi kullanarak kayıtları JSON formatında döndürme
  async loadPhotosByIds(ids: string[]): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const results: any[] = [];
      let count = 0;

      // ID dizisini her birine karşılık gelen kayıtları çekmek için kullanıyoruz
      ids.forEach((id) => {
        const request = store.get(id);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            results.push(result);
          }
          count++;

          // Tüm istekler tamamlandığında sonuçları döndür
          if (count === ids.length) {
            db.close();
            resolve(results);
          }
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    });
  }
}
