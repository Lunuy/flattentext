import FindElementsToFlatCallback from "./FindElementsToFlatCallback";
import GetReferenceInfo from "./GetReferenceInfo";
import CreateContainer from "./CreateContainer";
import ModifyContainer from "./ModifyContainer";

interface FlatOptions<P extends HTMLElement, C extends HTMLElement> {
    deduplication: boolean,
    className: string,
    messageID: string,
    findElementsToFlat: FindElementsToFlatCallback<P, C>,
    getReferenceInfo: GetReferenceInfo<C>,
    createContainer: CreateContainer<P>,
    modifyContainer: ModifyContainer<P>,
    trustedOrigins: string[]
}

export default FlatOptions;