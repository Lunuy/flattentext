
type FindElementsToFlatCallback<P extends HTMLElement, C extends HTMLElement> = (parentElement : P) => Iterable<C>;

export default FindElementsToFlatCallback;