// electron.d.ts
declare global {
    interface Window {
      electron: {
        closeApp: () => void;
      };
    }
  }
  
  export {};
  