import { METHOD_GET } from "../constant/constant";
import fetchWrapper from "../wrappers/fetch-wrapper";

export const createSlides = (data: any) => {
  window.postMessage(
    {
      source: "button-accessor",
      type: "generateSlides",
      payload: data,
    },
    "*"
  );
};

export const getSlides = (slideIndex: number) => {
  return fetchWrapper(METHOD_GET, `/slides/${slideIndex}`);
};

export const getSlidesById = (slideId: string) => {
  return fetchWrapper(METHOD_GET, `/slides/slide/${slideId}`);
};
