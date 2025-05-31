import { METHOD_GET, METHOD_POST } from "../constant/constant"
import fetchWrapper from "../wrappers/fetch-wrapper"

export const createSlides = (data : any) => {
    return fetchWrapper(METHOD_POST, '/slides', data)
}

export const getSlides = (slideIndex: number) => {
    return fetchWrapper(METHOD_GET, `/slides/${slideIndex}`)
}

export const getSlidesById = (slideId: string) => {
    return fetchWrapper(METHOD_GET, `/slides/slide/${slideId}`)
}