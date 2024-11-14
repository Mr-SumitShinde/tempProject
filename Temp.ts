type Category = {
    id: string;
    type: string;
    code: string;
    desc: string;
    flow: string;
    subCategories?: {
        id: string;
        type: string;
        code: string;
        desc: string;
        flow: string;
    }[];
};

type ApiResponse = {
    data: {
        id: string;
        type: string;
        attributes: {
            categories: Category[];
        };
    };
};

function processRefData(response: ApiResponse): Record<string, { code: string; desc: string }[]> {
    const result: Record<string, { code: string; desc: string }[]> = {};

    response.data.attributes.categories.forEach((category) => {
        const key = category.code;

        if (category.subCategories && category.subCategories.length > 0) {
            result[key] = category.subCategories.map((subCat) => ({
                code: subCat.code,
                desc: subCat.desc,
            }));
        } else {
            result[key] = [{ code: category.code, desc: category.desc }];
        }
    });

    return result;
}

export default processRefData;