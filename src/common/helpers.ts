const removeUndefinedFields = <T extends object>(obj: T): Partial<T> => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key as keyof T] = value;
            }
            return acc;
        }, {} as Partial<T>);
};

const snakeToCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());


export { removeUndefinedFields, snakeToCamel };