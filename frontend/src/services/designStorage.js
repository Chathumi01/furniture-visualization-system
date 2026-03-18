import { fetchData, postData } from "./api";

export const saveDesignLayout = async (userId, layoutData) => {
  return await postData(`designs/${userId}`, layoutData);
};

export const getSavedDesigns = async (userId) => {
  return await fetchData(`designs/${userId}`);
};

export const deleteDesignLayout = async (designId) => {
  return true;
};
