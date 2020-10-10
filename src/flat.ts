import DocumentData from "./types/DocumentData";
import FlatOptions from "./types/FlatOptions";
import OptionalizeProps from "./types/operator/OptionalizeProps";
import ReferenceInfo from "./types/ReferenceInfo";
import makeIframe from "./utils/makeIframe";

// <div class="ft" to="/post2"></div>

function flat<P extends HTMLElement, C extends HTMLElement>
    (element : P, options_ : OptionalizeProps<FlatOptions<P, C>> = {}) {
    const options : FlatOptions<P, C> = {
        className: "ft",
        messageID: "ft",
        findElementsToFlat(element) {
            return element.getElementsByClassName(options.className) as HTMLCollectionOf<C>;
        },
        getReferenceInfo(element) {
            return element.dataset.to;
        },
        createContainer() {
            return document.createElement("div") as unknown as P;
        },
        modifyContainer() {

        },
        trustedOrigins: [location.origin],
        deduplication: true,
        ...options_
    };

    const {
        messageID,
        findElementsToFlat,
        getReferenceInfo,
        trustedOrigins,
        createContainer,
        modifyContainer,
        deduplication
    } = options;

    let numId = -1;

    const processedReferenceInfos : ReferenceInfo[] = [];

    function getDocumentData(iframe : HTMLIFrameElement, numId : number) : Promise<DocumentData> {
        return new Promise(solve => {
            iframe.contentWindow.postMessage({ id: messageID, numId }, "*");

            function messageListener(e : MessageEvent) {
                if(!(e.data instanceof Object)) return;
                if(e.data.id !== messageID) return;
                if(!trustedOrigins.includes(e.origin)) throw new Error(`flattenText :: ${e.origin} is not trusted`);
                if(e.data.numId !== numId) return;
                solve(e.data.data as DocumentData);
                window.removeEventListener("message", messageListener);
            }

            window.addEventListener("message", messageListener);
        });
    }

    async function flatChild(childElement : C, referenceInfo : ReferenceInfo): Promise<any[]> {

        const iframe = await makeIframe(referenceInfo);

        numId++;
        const currentNumId = numId;
        const documentData = await getDocumentData(iframe, currentNumId);

        iframe.outerHTML = "";

        const container = createContainer(currentNumId);
        container.innerHTML = documentData.html;
        modifyContainer(container, currentNumId);

        const parentElement = childElement.parentElement;
        parentElement.replaceChild(container, childElement);

        return [await flat(findElementsToFlat(container)), { info: documentData.info, numId: currentNumId }];
    }

    async function flat(childElements : Iterable<C>): Promise<any[]> {
        const promises = [];
        for(const childElement of childElements) {
            const referenceInfo = getReferenceInfo(childElement);
            if(deduplication && processedReferenceInfos.includes(referenceInfo)) continue;

            promises.push(flatChild(childElement, referenceInfo));

            if(deduplication) processedReferenceInfos.push(referenceInfo);
        }
        return await Promise.all(promises);
    }
    return flat(findElementsToFlat(element));
}

export default flat;