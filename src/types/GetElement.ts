
type GetElement<E extends HTMLElement> = () => (E | Promise<E>);

export default GetElement;