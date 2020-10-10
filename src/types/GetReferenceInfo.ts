import ReferenceInfo from "./ReferenceInfo";

type GetReferenceInfo<C extends HTMLElement> = (element : C) => ReferenceInfo;

export default GetReferenceInfo;