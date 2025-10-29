const removeUndefinedFields = <T extends object>(obj: T): Partial<T> => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key as keyof T] = value;
            }
            return acc;
        }, {} as Partial<T>);
};

export { removeUndefinedFields };