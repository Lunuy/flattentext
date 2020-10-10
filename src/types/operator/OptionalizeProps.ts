type OptionalizeProps<O> = { [K in keyof O]?: O[K] };

export default OptionalizeProps;