export const uuid = (id: string | number): string => {
    return typeof id === "number" ? id.toString() : id;
};