import GetElement from "./types/GetElement";
import OptionalizeProps from "./types/operator/OptionalizeProps";
import ReferenceInfo from "./types/ReferenceInfo";
import RegisterOptions from "./types/RegisterOptions";

function register<P extends HTMLElement>(getElement : GetElement<P>, registerOptions_ : OptionalizeProps<RegisterOptions> = {}) {
    const registerOptions : RegisterOptions = {
        getInfo() {
            return undefined;
        },
        messageID: "ft",
        trustedOrigins: [location.origin],
        ...registerOptions_
    }

    const {
        getInfo,
        messageID,
        trustedOrigins
    } = registerOptions;

    if(!window.parent) return () => {};

    async function messageListener(e : MessageEvent) {
        if(e.data.id !== messageID) return;
        if(!trustedOrigins.includes(e.origin)) throw new Error(`flattenText :: ${e.origin} is not trusted`);
        const element = await getElement();
        window.parent.postMessage({
            id: messageID,
            numId: e.data.numId,
            data: {
                html: element.innerHTML,
                info: getInfo()
            }
        }, "*");
    }
    window.addEventListener("message", messageListener);

    return () => {
        window.removeEventListener("message", messageListener);
    };
}

export default register;