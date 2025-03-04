import { IAuth } from "@/interfaces/auth.interface";

const AUTH_LOCAL_STORAGE_KEY = "auth";

const getAuth = (): IAuth | undefined => {
  if (typeof localStorage === "undefined") {
    return;
  }

  const lsValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    return JSON.parse(lsValue) as IAuth;
  } catch (error) {
    console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
  }
};

const setAuth = (auth: IAuth) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error("AUTH LOCAL STORAGE SAVE ERROR", error);
  }
};

const removeAuth = () => {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
  }
};

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY };
