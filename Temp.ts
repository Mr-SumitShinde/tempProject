function processRefData(
    response: ApiResponse
): Record<string, { key: string; text: string }[]> {
    const result: Record<string, { key: string; text: string }[]> = {};

    const extractDeepestSubcategories = (category: any): { key: string; text: string }[] =>
        category.subCategories && category.subCategories.length > 0
            ? category.subCategories.flatMap(extractDeepestSubcategories)
            : [{ key: category.code, text: category.desc }];

    response.data.attributes.categories.forEach((category) => {
        result[category.code] = category.subCategories && category.subCategories.length > 0
            ? extractDeepestSubcategories(category)
            : [{ key: category.code, text: category.desc }];
    });

    return result;
}

export default processRefData;