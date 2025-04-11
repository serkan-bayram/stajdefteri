// ~/lib/localStorage.ts
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reportState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("loadState error:", err);
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reportState", serializedState);
  } catch (err) {
    console.error("saveState error:", err);
  }
};
